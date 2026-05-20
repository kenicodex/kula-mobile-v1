import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/store/booking.store';
import { makeStyles } from './confirmation.styles';

export default function BookingConfirmation() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { serviceLabel, date, time, guests, reset } = useBookingStore();

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const fmtDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.outerBadge}>
          <View style={styles.innerBadge}>
            <Ionicons name="checkmark" size={36} color={theme.white} />
          </View>
        </View>

        <Text style={styles.title}>Booking confirmed!</Text>
        <Text style={styles.subtitle}>
          Your chef has been notified. You'll receive a confirmation shortly.
        </Text>

        <View style={styles.refCard}>
          <Text style={styles.refLabel}>Reference</Text>
          <Text style={styles.refValue}>
            KULA-{Date.now().toString().slice(-6)}
          </Text>

          <View style={styles.divider} />

          <View style={styles.rowsList}>
            <Row icon="restaurant-outline" label="Service" value={serviceLabel ?? 'Private Dining'} />
            <Row icon="person-outline" label="Chef" value="Amaka Obi" />
            <Row icon="calendar-outline" label="Date" value={fmtDate} />
            <Row icon="time-outline" label="Time" value={time ?? '—'} />
            <Row icon="people-outline" label="Guests" value={`${guests}`} />
          </View>
        </View>

        <Pressable onPress={() => router.push('/bookings')} style={styles.viewBookingsLink}>
          <Text style={styles.viewBookingsText}>View my bookings</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Back to Home" onPress={() => router.replace('/(tabs)')} size="lg" />
      </View>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color={theme.inkMuted} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}
