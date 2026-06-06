import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Button } from '@/components/ui/Button';
import { NavHeader } from '@/components/layout/NavHeader';
import { creatorsService, apiErrorMessage } from '@/services';
import { useStyles } from '@/hooks/useStyles';
import { makeStyles } from './creator-availability.styles';

// Day ids are the full lowercase names the backend's Prisma DayOfWeek enum
// expects (monday…sunday); labels stay short for the pills.
type DayId =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

const DAYS: { id: DayId; label: string }[] = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' },
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '18:00';

type DaySlot = { start: string; end: string };

// myProfile() returns CreatorAvailabilitySlot[] (Prisma rows). Normalize into a
// map of full-day-name → { start, end }, tolerating the older object shape too.
function parseAvailability(availability: unknown): Record<string, DaySlot> {
  const out: Record<string, DaySlot> = {};
  if (Array.isArray(availability)) {
    for (const s of availability as Array<{
      dayOfWeek?: string;
      startTime?: string;
      endTime?: string;
      isAvailable?: boolean;
    }>) {
      if (s.isAvailable === false || !s.dayOfWeek) continue;
      out[s.dayOfWeek.toLowerCase()] = {
        start: s.startTime ?? DEFAULT_START,
        end: s.endTime ?? DEFAULT_END,
      };
    }
  } else if (availability && typeof availability === 'object') {
    for (const [day, v] of Object.entries(availability as Record<string, unknown>)) {
      const slot = Array.isArray(v) ? v[0] : v;
      const s = (slot ?? {}) as { start?: string; end?: string };
      out[day.toLowerCase()] = {
        start: s.start ?? DEFAULT_START,
        end: s.end ?? DEFAULT_END,
      };
    }
  }
  return out;
}

const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

// "9:00 AM" / "12:00 PM" / "1:00 PM" → 24-hour hour (9, 12, 13).
function slotHour(label: string): number {
  const m = label.match(/^(\d+):\d+\s*(AM|PM)$/i);
  if (!m) return -1;
  let h = parseInt(m[1], 10);
  const mer = m[2].toUpperCase();
  if (mer === 'PM' && h !== 12) h += 12;
  if (mer === 'AM' && h === 12) h = 0;
  return h;
}

// "09:00" → 9 (slots are hourly, so the hour is all we compare on).
function hourOf(time: string): number {
  return parseInt(time.split(':')[0], 10);
}

// A slot is blocked when its hour falls outside every working day's
// [start, end) window. Returns [] when there are no saved hours so the
// section stays blank rather than showing everything blocked.
function deriveBlocked(byDay: Record<string, DaySlot>): string[] {
  const windows = Object.values(byDay).map(
    (s) => [hourOf(s.start), hourOf(s.end)] as const,
  );
  if (!windows.length) return [];
  return SLOTS.filter((label) => {
    const h = slotHour(label);
    const covered = windows.some(([start, end]) => h >= start && h < end);
    return !covered;
  });
}

export default function CreatorAvailabilityScreen() {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [days, setDays] = useState<string[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  // Per-day working hours, preserved across edits so we don't clobber times the
  // creator set during onboarding.
  const [timesByDay, setTimesByDay] = useState<Record<string, DaySlot>>({});

  const { data: creator } = useQuery({
    queryKey: ['creator', 'me'],
    queryFn: () => creatorsService.myProfile(),
  });

  // Hydrate selections from the creator profile once it loads.
  useEffect(() => {
    if (!creator) return;
    const parsed = parseAvailability(creator.availability);
    setDays(Object.keys(parsed));
    setTimesByDay(parsed);
    // Reflect the saved working hours: slots outside the creator's start–end
    // window show as blocked.
    setBlocked(deriveBlocked(parsed));
  }, [creator]);

  const toggleDay = (id: string) =>
    setDays((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleSlot = (s: string) =>
    setBlocked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Backend expects a map keyed by the Prisma DayOfWeek enum:
      //   { monday: { start: "HH:MM", end: "HH:MM" }, ... }
      const availability = days.reduce<Record<string, DaySlot>>((acc, d) => {
        acc[d] = timesByDay[d] ?? { start: DEFAULT_START, end: DEFAULT_END };
        return acc;
      }, {});
      await creatorsService.setAvailability(availability as never);
    },
    onSuccess: () => {
      showMessage({ message: 'Availability saved', type: 'success' });
      router.back();
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not save availability.'),
        type: 'danger',
      });
    },
  });

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader title="Availability" backVariant="circle" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Working days</Text>
        <Text style={styles.sectionSub}>
          Tap to toggle days you&apos;re available for bookings.
        </Text>
        <View style={styles.pillsRow}>
          {DAYS.map((d) => {
            const on = days.includes(d.id);
            return (
              <Pressable
                key={d.id}
                onPress={() => toggleDay(d.id)}
                style={[styles.dayPill, on ? styles.dayPillOn : styles.dayPillOff]}
              >
                <Text
                  style={[
                    styles.dayPillText,
                    on ? styles.dayPillTextOn : styles.dayPillTextOff,
                  ]}
                >
                  {d.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Block time slots
        </Text>
        <Text style={styles.sectionSub}>
          Selected slots will be unavailable for new bookings.
        </Text>
        <View style={styles.pillsRow}>
          {SLOTS.map((s) => {
            const off = blocked.includes(s);
            return (
              <Pressable
                key={s}
                onPress={() => toggleSlot(s)}
                style={[styles.slotPill, off ? styles.slotPillOff : styles.slotPillOn]}
              >
                <Text
                  style={[
                    styles.slotPillText,
                    off ? styles.slotPillTextOff : styles.slotPillTextOn,
                  ]}
                >
                  {s}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Save Changes" size="lg" loading={isPending} onPress={() => mutate()} />
      </View>
    </SafeAreaView>
  );
}
