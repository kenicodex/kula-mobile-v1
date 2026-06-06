import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { NavHeader } from '@/components/layout/NavHeader';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { bookingsService, messagingService, apiErrorMessage } from '@/services';
import { asUser, idOf } from '@/services/adapters';
import { fmtDate, fmtMoney, fmtDateTime } from '@/lib/format';
import { useAuthStore } from '@/store/auth.store';
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

  const accept = useMutation({
    mutationFn: () => bookingsService.confirm(id),
    onSuccess: () => {
      showMessage({ message: 'Booking accepted', type: 'success' });
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['creator', 'bookings'] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not accept booking.'),
        type: 'danger',
      });
    },
  });

  const decline = useMutation({
    mutationFn: () => bookingsService.decline(id),
    onSuccess: () => {
      showMessage({ message: 'Booking declined', type: 'success' });
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['creator', 'bookings'] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not decline booking.'),
        type: 'danger',
      });
    },
  });

  const advance = useMutation({
    mutationFn: (next: 'in_progress' | 'completed') =>
      bookingsService.setStatus(id, next),
    onSuccess: (_data, next) => {
      showMessage({
        message: next === 'in_progress' ? 'Booking started' : 'Booking completed',
        type: 'success',
      });
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['creator', 'bookings'] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not update booking.'),
        type: 'danger',
      });
    },
  });

  const openChat = useMutation({
    mutationFn: async (input: {
      recipientUserId: string;
      name: string;
      avatar?: string;
    }) => {
      const conv = await messagingService.startConversation(
        input.recipientUserId,
        id,
      );
      return { conversationId: conv.id, name: input.name, avatar: input.avatar };
    },
    onSuccess: ({ conversationId, name, avatar }) => {
      router.push({
        pathname: '/chat/[id]',
        params: {
          id: conversationId,
          name,
          avatar: avatar ?? '',
        },
      });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not open chat.'),
        type: 'danger',
      });
    },
  });

  const creator = booking?.creator;
  const creatorUser = asUser(creator?.user) ?? asUser(creator?.userId);
  const creatorName = creatorUser?.name ?? 'Creator';
  const clientUser = asUser(booking?.client) ?? asUser(booking?.clientId);
  const clientName = clientUser?.name ?? 'Client';
  const cuisine = (creator?.cuisineTypes ?? []).join(' · ');
  const status = booking?.status ?? 'pending';
  const statusTheme = STATUS_THEME[status] ?? STATUS_THEME.pending;

  const currentUser = useAuthStore((s) => s.user);
  const isCreatorForBooking =
    currentUser?.role === 'creator' &&
    !!creator &&
    (creator.userId === currentUser.id || creatorUser?.id === currentUser.id);

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <NavHeader
        title="Booking Details"
        backVariant="circle"
        rightAction={{
          icon: 'ellipsis-horizontal',
          onPress: () => {},
          accessibilityLabel: 'More options',
        }}
      />

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

          {/* Creator card */}
          <Pressable
            onPress={() => router.push(`/creators/${idOf(booking.creatorId)}`)}
            style={styles.creatorCard}
          >
            <Avatar uri={creatorUser?.avatar} name={creatorName} size="md" />
            <View style={styles.creatorBody}>
              <View style={styles.creatorNameRow}>
                <Text style={styles.creatorName}>{creatorName}</Text>
                <Ionicons
                  name="checkmark-circle"
                  size={13}
                  color={theme.primary}
                  style={styles.creatorIconSpacer}
                />
              </View>
              {cuisine && <Text style={styles.creatorCuisine}>{cuisine}</Text>}
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

          {/* Grocery link (available once creator has accepted) */}
          {status === 'confirmed' || status === 'in_progress' || status === 'completed' ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/booking/grocery',
                  params: { bookingId: id },
                })
              }
              style={styles.groceryLink}
            >
              <View style={styles.groceryIconWrap}>
                <Ionicons name="basket-outline" size={20} color={theme.primary} />
              </View>
              <View style={styles.groceryBody}>
                <Text style={styles.groceryTitle}>Grocery list</Text>
                <Text style={styles.grocerySubtitle}>
                  {isCreatorForBooking
                    ? 'Submit items, then upload receipt after purchase'
                    : 'Review and approve items the creator will purchase'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />
            </Pressable>
          ) : null}

          {/* Actions */}
          {isCreatorForBooking ? (
            <>
              <View style={styles.actionsRow}>
                <View style={styles.actionFlex}>
                  <Button
                    label="Message Client"
                    variant="ghost"
                    loading={openChat.isPending}
                    disabled={!clientUser?.id}
                    onPress={() =>
                      clientUser?.id &&
                      openChat.mutate({
                        recipientUserId: clientUser.id,
                        name: clientName,
                        avatar: clientUser.avatar ?? '',
                      })
                    }
                  />
                </View>
              </View>
              {status === 'pending' ? (
                <View style={styles.actionsRow}>
                  <View style={styles.actionFlex}>
                    <Button
                      label="Decline"
                      variant="outline"
                      loading={decline.isPending}
                      disabled={accept.isPending}
                      onPress={() => decline.mutate()}
                    />
                  </View>
                  <View style={styles.actionFlex}>
                    <Button
                      label="Accept"
                      loading={accept.isPending}
                      disabled={decline.isPending}
                      onPress={() => accept.mutate()}
                    />
                  </View>
                </View>
              ) : null}
              {status === 'confirmed' ? (
                <View style={styles.actionsRow}>
                  <View style={styles.actionFlex}>
                    <Button
                      label="Start booking"
                      loading={advance.isPending}
                      onPress={() => advance.mutate('in_progress')}
                    />
                  </View>
                </View>
              ) : null}
              {status === 'in_progress' ? (
                <View style={styles.actionsRow}>
                  <View style={styles.actionFlex}>
                    <Button
                      label="Mark as completed"
                      loading={advance.isPending}
                      onPress={() => advance.mutate('completed')}
                    />
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            <View style={styles.actionsRow}>
              <View style={styles.actionFlex}>
                <Button
                  label="Message Creator"
                  variant="ghost"
                  loading={openChat.isPending}
                  disabled={!creatorUser?.id}
                  onPress={() =>
                    creatorUser?.id &&
                    openChat.mutate({
                      recipientUserId: creatorUser.id,
                      name: creatorName,
                      avatar: creatorUser.avatar ?? '',
                    })
                  }
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
          )}
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
