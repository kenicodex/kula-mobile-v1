import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { BookingStepHeader } from '@/components/booking/BookingStepHeader';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/store/booking.store';
import { bookingsService, apiErrorMessage } from '@/services';
import { fmtMoney } from '@/lib/format';
import { makeStyles } from './step4.styles';

const SERVICE_TO_BACKEND: Record<string, string> = {
  private_dining: 'private_dining',
  catering: 'event_catering',
  meal_prep: 'meal_prep',
  cooking_class: 'virtual_class',
};

type PayMethod = {
  id: 'card' | 'transfer' | 'wallet';
  name: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const METHODS: PayMethod[] = [
  { id: 'card', name: 'Debit / Credit Card', subtitle: 'Visa, Mastercard, Verve', icon: 'card-outline' },
  { id: 'transfer', name: 'Bank Transfer', subtitle: 'Pay via instant bank transfer', icon: 'business-outline' },
  { id: 'wallet', name: 'Kula Wallet', subtitle: 'Balance: ₦12,500', icon: 'wallet-outline' },
];

export default function BookingStep4() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const {
    chefId,
    chefName,
    service,
    serviceLabel,
    date,
    time,
    guests,
    dietary,
    notes,
    address,
    city,
    payment,
    set,
  } = useBookingStore();

  const fmtDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const total = 47250; // pricing engine TBD on backend
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!chefId) throw new Error('Chef not selected');
      const backendService = SERVICE_TO_BACKEND[service ?? 'private_dining'] ?? 'private_dining';
      const booking = await bookingsService.create({
        chefId,
        serviceType: backendService,
        hireType: 'scheduled',
        date: date ?? new Date().toISOString().slice(0, 10),
        timeSlot: time ? { start: time, end: time } : undefined,
        numberOfGuests: guests,
        location: {
          address: address ?? 'TBD',
          city: city ?? 'Lagos',
        },
        occasion: dietary,
        specialInstructions: notes,
      });
      return booking;
    },
    onSuccess: (booking) => {
      set({ createdBookingId: booking.id, estimatedTotal: total });
      router.replace('/booking/confirmation');
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not create booking. Please try again.'),
        type: 'danger',
      });
    },
  });

  const confirm = () => mutate();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <BookingStepHeader title="Review & Pay" step={4} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SummarySection title="Booking summary">
          <Row label="Service" value={serviceLabel ?? 'Private Dining'} />
          <Row label="Chef" value={chefName ?? '—'} />
          <Row label="Date" value={fmtDate} />
          <Row label="Time" value={time ?? '—'} />
          <Row label="Guests" value={`${guests} people`} />
          <Row label="Dietary" value={dietary ?? 'None specified'} />
        </SummarySection>

        <View style={styles.sectionGap} />

        <SummarySection title="Payment breakdown">
          <Row label="Service fee" value="₦45,000" />
          <Row label="Platform fee (5%)" value="₦2,250" />
          <View style={styles.innerDivider} />
          <Row label="Total" value="₦47,250" bold />
        </SummarySection>

        <Text style={styles.paymentTitle}>Payment method</Text>
        <View style={styles.methodsList}>
          {METHODS.map((m) => {
            const selected = payment === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => set({ payment: m.id })}
                style={[
                  styles.methodCard,
                  selected ? styles.methodCardSelected : styles.methodCardDefault,
                ]}
              >
                <View style={styles.methodIconWrap}>
                  <Ionicons name={m.icon} size={20} color={theme.inkLight} />
                </View>
                <View style={styles.methodBody}>
                  <Text style={styles.methodName}>{m.name}</Text>
                  <Text style={styles.methodSubtitle}>{m.subtitle}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    selected ? styles.radioSelected : styles.radioDefault,
                  ]}
                >
                  {selected && <Ionicons name="checkmark" size={12} color={theme.white} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.secureRow}>
          <Ionicons name="lock-closed-outline" size={13} color={theme.inkMuted} />
          <Text style={styles.secureText}>Payments are secured and encrypted.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Confirm & Pay ${fmtMoney(total)}`}
          size="lg"
          loading={isPending}
          onPress={confirm}
        />
      </View>
    </SafeAreaView>
  );
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.summarySection}>
      <Text style={styles.summaryTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold ? styles.rowValueBold : styles.rowValueDefault]}>
        {value}
      </Text>
    </View>
  );
}
