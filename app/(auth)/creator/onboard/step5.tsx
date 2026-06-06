import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StepTopBar } from '@/components/auth/StepTopBar';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { creatorsService, apiErrorMessage } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useCreatorOnboardStore } from '@/store/creator-onboard.store';
import { makeStyles } from './step5.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Backend uses Prisma's DayOfWeek enum: full lowercase day names.
const DAY_TO_ENUM: Record<DayKey, string> = {
  Mon: 'monday',
  Tue: 'tuesday',
  Wed: 'wednesday',
  Thu: 'thursday',
  Fri: 'friday',
  Sat: 'saturday',
  Sun: 'sunday',
};

// ─── Time stepper ─────────────────────────────────────────────────────────────

interface TimeStepperProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

function TimeStepper({ label, value, onChange, min = 0, max = 23 }: TimeStepperProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));
  const formatted = `${String(value).padStart(2, '0')}:00`;

  return (
    <View style={styles.stepperWrap}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <Pressable
          onPress={decrement}
          style={({ pressed }) => [
            styles.stepperBtn,
            pressed ? { opacity: 0.7 } : null,
          ]}
        >
          <Ionicons name="remove" size={18} color={theme.ink} />
        </Pressable>
        <Text style={styles.stepperValue}>{formatted}</Text>
        <Pressable
          onPress={increment}
          style={({ pressed }) => [
            styles.stepperBtn,
            pressed ? { opacity: 0.7 } : null,
          ]}
        >
          <Ionicons name="add" size={18} color={theme.ink} />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreatorOnboardStep5() {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const onboard = useCreatorOnboardStore();
  const { user, setAuth } = useAuthStore();
  const [selectedDays, setSelectedDays] = useState<DayKey[]>([]);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(18);

  const toggleDay = (day: DayKey) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // 1) Create the creator profile from data collected across step1-4. On
      //    success the backend upgrades this user to the `creator` role and hands
      //    back a fresh token carrying it.
      const profile = await creatorsService.createProfile({
        bio: onboard.bio,
        location: onboard.city || undefined,
        cuisineTypes: onboard.cuisineTypes,
        mealCategories: onboard.mealCategories,
        serviceTypes: onboard.services.map((s) => s.id),
        pricing: onboard.services.map((s) => ({
          hireType: s.id,
          rate: s.rate,
          currency: 'NGN',
        })),
        certifications: onboard.certifications.map((c) => ({
          name: c.name,
          certificateUrl: c.url,
        })),
      } as never);

      // Swap in the upgraded token + role BEFORE the next call — setAvailability
      // is a creator-only endpoint and would 403 against the old client token.
      if (profile?.accessToken && user) {
        await setAuth({ ...user, role: 'creator' }, profile.accessToken);
      }

      // 2) Set weekly availability. Backend expects:
      //    { monday: { start: "HH:MM", end: "HH:MM" }, ... } keyed by the
      //    Prisma DayOfWeek enum.
      const start = `${String(startHour).padStart(2, '0')}:00`;
      const end = `${String(endHour).padStart(2, '0')}:00`;
      const availability = selectedDays.reduce<Record<string, { start: string; end: string }>>(
        (acc, d) => {
          acc[DAY_TO_ENUM[d]] = { start, end };
          return acc;
        },
        {},
      );
      await creatorsService.setAvailability(availability as never);
    },
    onSuccess: () => {
      onboard.reset();
      router.replace('/(tabs)/profile');
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not finish onboarding. Try again.'),
        type: 'danger',
      });
    },
  });

  const canSubmit = selectedDays.length > 0 && endHour > startHour;

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
      <StepTopBar
        totalSteps={5}
        currentStep={5}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Set Your Availability</Text>
          <Text style={styles.subtitle}>
            Select the days and hours you're available for bookings.
          </Text>
        </View>

        {/* Day toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available days</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day) => {
              const active = selectedDays.includes(day);
              return (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={({ pressed }) => [
                    styles.dayBtn,
                    active ? styles.dayBtnActive : styles.dayBtnInactive,
                    pressed ? { opacity: 0.8 } : null,
                  ]}
                >
                  <Text
                    style={active ? styles.dayLabelActive : styles.dayLabelInactive}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Time range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleLg}>Working hours</Text>
          <View style={styles.timeRow}>
            <TimeStepper
              label="Start time"
              value={startHour}
              onChange={setStartHour}
              min={0}
              max={endHour - 1}
            />
            <View style={styles.timeDivider} />
            <TimeStepper
              label="End time"
              value={endHour}
              onChange={setEndHour}
              min={startHour + 1}
              max={23}
            />
          </View>
          {endHour <= startHour && (
            <Text style={styles.errorText}>
              End time must be after start time.
            </Text>
          )}
        </View>

        {/* CTA */}
        <Button
          label="Submit for Review"
          size="lg"
          disabled={!canSubmit}
          loading={isPending}
          onPress={() => mutate()}
        />
      </View>
    </ScreenWrapper>
  );
}
