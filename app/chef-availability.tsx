import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Button } from '@/components/ui/Button';
import { chefsService, apiErrorMessage } from '@/services';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './chef-availability.styles';

const DAYS: { id: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'; label: string }[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

export default function ChefAvailabilityScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [days, setDays] = useState<string[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);

  const { data: chef } = useQuery({
    queryKey: ['chef', 'me'],
    queryFn: () => chefsService.myProfile(),
  });

  // Hydrate selections from the chef profile once it loads.
  useEffect(() => {
    if (!chef) return;
    const av = chef.availability as Record<string, unknown> | undefined;
    if (av) {
      setDays(Object.keys(av));
    }
    setBlocked([]);
  }, [chef]);

  const toggleDay = (id: string) =>
    setDays((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleSlot = (s: string) =>
    setBlocked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const availability = days.reduce<Record<string, { start: string; end: string }[]>>(
        (acc, d) => {
          acc[d] = [{ start: '09:00', end: '18:00' }];
          return acc;
        },
        {},
      );
      await chefsService.setAvailability(availability as never);
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Availability</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Working days</Text>
        <Text style={styles.sectionSub}>
          Tap to toggle days you're available for bookings.
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
