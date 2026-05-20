import React, { useState, useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { BookingCard, type BookingItem, type BookingStatus } from '@/components/booking/BookingCard';
import { bookingsService } from '@/services';
import { asChef, asUser } from '@/services/adapters';
import { fmtDateTime } from '@/lib/format';
import type { Booking } from '@/types';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './bookings.styles';

type TabId = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

const TABS: { id: TabId; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const STATUS_LABEL: Record<string, BookingStatus> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function bookingToItem(b: Booking): BookingItem {
  const chef = asChef(b.chefId);
  const chefUser = asUser(chef?.user) ?? asUser(chef?.userId);
  return {
    id: b.id,
    chefName: chefUser?.name ?? 'Chef',
    service: `${(b.serviceType ?? '').replace(/_/g, ' ')} · ${b.numberOfGuests} guests`,
    date: fmtDateTime(b.date),
    status: STATUS_LABEL[b.status] ?? 'Pending',
  };
}

function filterForTab(b: Booking, tab: TabId): boolean {
  if (tab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed';
  if (tab === 'in_progress') return b.status === 'in_progress';
  if (tab === 'completed') return b.status === 'completed';
  return b.status === 'cancelled';
}

export default function BookingsScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [tab, setTab] = useState<TabId>('upcoming');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => bookingsService.myBookings(),
  });

  const items = useMemo(
    () => (data ?? []).filter((b) => filterForTab(b, tab)).map(bookingToItem),
    [data, tab],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Bookings</Text>
          <Pressable
            onPress={() => router.push('/chefs')}
            hitSlop={10}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={22} color={theme.primary} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTab(t.id)}
                style={styles.tab}
              >
                <Text
                  style={[
                    styles.tabText,
                    active ? styles.tabTextActive : styles.tabTextInactive,
                  ]}
                >
                  {t.label}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={items}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <EmptyState
              icon={
                tab === 'upcoming'
                  ? 'calendar-outline'
                  : tab === 'in_progress'
                  ? 'hourglass-outline'
                  : tab === 'completed'
                  ? 'checkmark-done-outline'
                  : 'close-circle-outline'
              }
              message={
                tab === 'upcoming'
                  ? 'No bookings yet'
                  : tab === 'in_progress'
                  ? 'No active bookings'
                  : tab === 'completed'
                  ? 'No completed bookings'
                  : 'No cancelled bookings'
              }
              sub={
                tab === 'upcoming'
                  ? 'Your upcoming bookings will appear here.'
                  : 'Once you have bookings, they will appear here.'
              }
              ctaLabel={tab === 'upcoming' ? 'Book a Chef' : undefined}
              onCta={() => router.push('/chefs')}
            />
          )
        }
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => router.push(`/booking/${item.id}`)}
            actionLabel={tab === 'completed' ? 'Review' : 'View'}
            onAction={() =>
              tab === 'completed'
                ? router.push(`/review/leave?bookingId=${item.id}`)
                : router.push(`/booking/${item.id}`)
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

function EmptyState({
  icon,
  message,
  sub,
  ctaLabel,
  onCta,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  message: string;
  sub: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={theme.primary} />
      </View>
      <Text style={styles.emptyMessage}>{message}</Text>
      <Text style={styles.emptySub}>{sub}</Text>
      {ctaLabel && (
        <Pressable onPress={onCta} style={styles.emptyCta}>
          <Text style={styles.emptyCtaText}>{ctaLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
