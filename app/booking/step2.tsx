import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { BookingStepHeader } from '@/components/booking/BookingStepHeader';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useBookingStore } from '@/store/booking.store';
import { makeStyles } from './step2.styles';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const TIME_SLOTS: { label: string; available: boolean }[] = [
  { label: '9:00 AM', available: true },
  { label: '10:00 AM', available: true },
  { label: '11:00 AM', available: false },
  { label: '12:00 PM', available: true },
  { label: '1:00 PM', available: false },
  { label: '2:00 PM', available: true },
  { label: '3:00 PM', available: true },
  { label: '4:00 PM', available: true },
  { label: '5:00 PM', available: false },
  { label: '6:00 PM', available: true },
  { label: '7:00 PM', available: true },
];

export default function BookingStep2() {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { date, time, set } = useBookingStore();
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const grid = useMemo(() => {
    const first = new Date(viewMonth.year, viewMonth.month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(i);
    return cells;
  }, [viewMonth]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isoFor = (day: number) => {
    const dt = new Date(viewMonth.year, viewMonth.month, day);
    return dt.toISOString().slice(0, 10);
  };

  const fmt = date
    ? (() => {
        const d = new Date(date + 'T00:00:00');
        return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      })()
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <BookingStepHeader title="Date & Time" step={2} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarWrap}>
          <View style={styles.monthRow}>
            <Pressable
              onPress={() =>
                setViewMonth((m) => ({
                  year: m.month === 0 ? m.year - 1 : m.year,
                  month: m.month === 0 ? 11 : m.month - 1,
                }))
              }
              style={styles.navButton}
            >
              <Text style={styles.navArrow}>‹</Text>
            </Pressable>
            <Text style={styles.monthLabel}>
              {MONTHS[viewMonth.month]} {viewMonth.year}
            </Text>
            <Pressable
              onPress={() =>
                setViewMonth((m) => ({
                  year: m.month === 11 ? m.year + 1 : m.year,
                  month: m.month === 11 ? 0 : m.month + 1,
                }))
              }
              style={styles.navButton}
            >
              <Text style={styles.navArrow}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {DAY_LABELS.map((d, i) => (
              <View key={i} style={styles.weekdayCell}>
                <Text style={styles.weekdayText}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {grid.map((day, i) => {
              if (day === null) {
                return <View key={i} style={styles.dayCell} />;
              }
              const iso = isoFor(day);
              const dt = new Date(viewMonth.year, viewMonth.month, day);
              const past = dt < today;
              const selected = iso === date;
              return (
                <Pressable
                  key={i}
                  disabled={past}
                  onPress={() => set({ date: iso, time: undefined })}
                  style={[styles.dayCell, styles.dayCellPadded]}
                >
                  <View
                    style={[
                      styles.dayInner,
                      selected ? styles.dayInnerSelected : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        past
                          ? styles.dayTextPast
                          : selected
                          ? styles.dayTextSelected
                          : styles.dayTextDefault,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.slotsSection}>
          <Text style={styles.slotsTitle}>Select a time slot</Text>
          <Text style={styles.slotsSubtitle}>
            {fmt ? `Available slots for ${fmt}` : 'Pick a date first to see availability.'}
          </Text>

          {date && (
            <View style={styles.slotsList}>
              {TIME_SLOTS.map((t) => {
                const selected = time === t.label;
                return (
                  <Pressable
                    key={t.label}
                    disabled={!t.available}
                    onPress={() => set({ time: t.label })}
                    style={[
                      styles.slot,
                      !t.available
                        ? styles.slotUnavailable
                        : selected
                        ? styles.slotSelected
                        : styles.slotDefault,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        !t.available
                          ? styles.slotTextUnavailable
                          : selected
                          ? styles.slotTextSelected
                          : styles.slotTextDefault,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          size="lg"
          variant={date && time ? 'primary' : 'ghost'}
          disabled={!date || !time}
          onPress={() => router.push('/booking/step3')}
        />
      </View>
    </SafeAreaView>
  );
}
