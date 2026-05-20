import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { bookingsService, apiErrorMessage } from '@/services';
import { asChef, asUser, idOf } from '@/services/adapters';
import { fmtDate, fmtMoney, fmtDateTime } from '@/lib/format';
import { makeStyles } from './[id].styles';

const STATUS_THEME: Record<string, { bg: string; fg: string; label: string }> = {
  pending: { bg: '#FBF1DA', fg: '#D9962A', label: 'Pending confirmation' },
  confirmed: { bg: '#FDE8D8', fg: '#E8681A', label: 'Upcoming' },
  in_progress: { bg: '#FDE8D8', fg: '#E8681A', label: 'In progress' },
  completed: { bg: '#E4F3EB', fg: '#2E8056', label: 'Completed' },
  cancelled: { bg: '#F8DCD7', fg: '#C84A3A', label: 'Cancelled' },
};

export default function BookingDetailScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsService.get(id),
    enabled: !!id,
  });

  const cancel = useMutation({
    mutationFn: () => bookingsService.cancel(id),
    onSuccess: () => {
      showMessage({ message: 'Booking cancelled', type: 'success' });
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['bookings', 'my'] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not cancel.'),
        type: 'danger',
      });
    },
  });

  const chef = asChef(booking?.chefId);
  const chefUser = asUser(chef?.user) ?? asUser(chef?.userId);
  const chefName = chefUser?.name ?? 'Chef';
  const cuisine = (chef?.cuisineTypes ?? []).join(' · ');
  const status = booking?.status ?? 'pending';
  const statusTheme = STATUS_THEME[status] ?? STATUS_THEME.pending;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.topTitle}>Booking Details</Text>
        <Pressable hitSlop={10} style={styles.topActionButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.ink} />
        </Pressable>
      </View>

      {isLoading || !booking ? (
        <View style={styles.centeredFill}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Status banner */}
          <View style={[styles.statusBanner, { backgroundColor: statusTheme.bg }]}>
            <Ionicons name="calendar" size={22} color={statusTheme.fg} />
            <View style={styles.statusBody}>
              <Text style={[styles.statusTitle, { color: statusTheme.fg }]}>
                {statusTheme.label}
              </Text>
              <Text style={[styles.statusSubtitle, { color: statusTheme.fg }]}>
                {fmtDateTime(booking.date)}
              </Text>
            </View>
          </View>

          {/* Chef card */}
          <Pressable
            onPress={() => router.push(`/chefs/${idOf(booking.chefId)}`)}
            style={styles.chefCard}
          >
            <Avatar uri={chefUser?.avatar} name={chefName} size="md" />
            <View style={styles.chefBody}>
              <View style={styles.chefNameRow}>
                <Text style={styles.chefName}>{chefName}</Text>
                <Ionicons
                  name="checkmark-circle"
                  size={13}
                  color={theme.primary}
                  style={styles.chefIconSpacer}
                />
              </View>
              {cuisine && <Text style={styles.chefCuisine}>{cuisine}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.inkMuted} />
          </Pressable>

          {/* Details card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Booking info</Text>
            <DetailRow
              icon="pricetag-outline"
              label="Reference"
              value={`#${booking.reference ?? booking.id.slice(-6)}`}
            />
            <DetailRow
              icon="restaurant-outline"
              label="Service"
              value={(booking.serviceType ?? '—').replace(/_/g, ' ')}
            />
            <DetailRow
              icon="calendar-outline"
              label="Date"
              value={fmtDate(booking.date)}
            />
            <DetailRow
              icon="time-outline"
              label="Time"
              value={
                booking.timeSlot
                  ? `${booking.timeSlot.start} – ${booking.timeSlot.end}`
                  : '—'
              }
            />
            <DetailRow
              icon="people-outline"
              label="Guests"
              value={`${booking.numberOfGuests} people`}
            />
            <DetailRow
              icon="location-outline"
              label="Location"
              value={
                booking.location
                  ? [booking.location.street, booking.location.city]
                      .filter(Boolean)
                      .join(', ')
                  : '—'
              }
            />
            {booking.specialInstructions && (
              <DetailRow
                icon="document-text-outline"
                label="Special requests"
                value={booking.specialInstructions}
              />
            )}
          </View>

          {/* Payment */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Payment</Text>
            <DetailRow
              icon="checkmark-circle-outline"
              label="Status"
              value={(booking as { escrowStatus?: string }).escrowStatus ?? 'pending'}
              valueColor={theme.success}
            />
            <DetailRow
              icon="cash-outline"
              label="Total"
              value={fmtMoney(booking.totalAmount)}
            />
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <View style={styles.actionFlex}>
              <Button
                label="Message Chef"
                variant="ghost"
                onPress={() => router.push(`/chat/${idOf(booking.chefId)}`)}
              />
            </View>
            {status === 'pending' || status === 'confirmed' ? (
              <View style={styles.actionFlex}>
                <Button
                  label="Cancel"
                  variant="outline"
                  loading={cancel.isPending}
                  onPress={() => cancel.mutate()}
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  valueColor?: string;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color={theme.inkMuted} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, { color: valueColor ?? theme.ink }]}>
        {value}
      </Text>
    </View>
  );
}
