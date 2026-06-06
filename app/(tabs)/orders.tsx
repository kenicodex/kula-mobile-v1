import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import {
  BookingCard,
  type BookingItem,
  type BookingStatus as BookingCardStatus,
} from '@/components/booking/BookingCard';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { bookingsService, ordersService } from '@/services';
import { asUser, asCreator } from '@/services/adapters';
import { useAuthStore } from '@/store/auth.store';
import type { Booking, Order } from '@/types';
import { fmtDateTime, fmtMoney, fmtRelative } from '@/lib/format';
import { makeStyles } from './orders.styles';

type Tab = 'active' | 'past';

const ACTIVE_STATUSES = new Set(['placed', 'confirmed', 'preparing', 'ready']);

const ACTIVE_BOOKING_STATUSES = new Set(['pending', 'confirmed', 'in_progress']);

const BOOKING_STATUS_LABEL: Record<string, BookingCardStatus> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function bookingToItem(b: Booking): BookingItem {
  const client = asUser(b.client) ?? asUser(b.clientId);
  return {
    id: b.id,
    creatorName: client?.name ?? 'Client',
    service: `${(b.serviceType ?? '').replace(/_/g, ' ')} · ${b.numberOfGuests} guests`,
    date: fmtDateTime(b.date),
    status: BOOKING_STATUS_LABEL[b.status] ?? 'Pending',
  };
}

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_BG: Record<string, { bg: string; fg: string }> = {
  placed: { bg: '#FBF1DA', fg: '#D9962A' },
  confirmed: { bg: '#FBF1DA', fg: '#D9962A' },
  preparing: { bg: '#FBF1DA', fg: '#D9962A' },
  ready: { bg: '#FDE8D8', fg: '#E8681A' },
  delivered: { bg: '#E4F3EB', fg: '#2E8056' },
  cancelled: { bg: '#F8DCD7', fg: '#C84A3A' },
};

export default function OrdersScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('active');
  const role = useAuthStore((s) => s.user?.role);
  const isCreator = role === 'creator';

  const ordersQuery = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => ordersService.myOrders(),
    enabled: !isCreator,
  });

  const bookingsQuery = useQuery({
    queryKey: ['creator', 'bookings'],
    queryFn: () => bookingsService.creatorBookings(),
    enabled: isCreator,
  });

  const isLoading = isCreator ? bookingsQuery.isLoading : ordersQuery.isLoading;
  const isRefetching = isCreator
    ? bookingsQuery.isRefetching
    : ordersQuery.isRefetching;
  const refetch = isCreator ? bookingsQuery.refetch : ordersQuery.refetch;

  const orderList = useMemo<Order[]>(() => {
    if (isCreator) return [];
    const all = ordersQuery.data ?? [];
    return all.filter((o) =>
      tab === 'active' ? ACTIVE_STATUSES.has(o.status) : !ACTIVE_STATUSES.has(o.status),
    );
  }, [isCreator, ordersQuery.data, tab]);

  const bookingList = useMemo<BookingItem[]>(() => {
    if (!isCreator) return [];
    const all = bookingsQuery.data ?? [];
    return all
      .filter((b) =>
        tab === 'active'
          ? ACTIVE_BOOKING_STATUSES.has(b.status)
          : !ACTIVE_BOOKING_STATUSES.has(b.status),
      )
      .map(bookingToItem);
  }, [isCreator, bookingsQuery.data, tab]);

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>
            {isCreator ? 'Bookings' : 'Orders'}
          </Text>
        </View>
        <View style={styles.tabsRow}>
          {(['active', 'past'] as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[
                  styles.tabPill,
                  active ? styles.tabPillActive : styles.tabPillInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabPillText,
                    active ? styles.tabPillTextActive : styles.tabPillTextInactive,
                  ]}
                >
                  {t === 'active' ? 'Active' : 'Past'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {isCreator ? (
        <FlatList
          data={bookingList}
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
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="calendar-outline" size={28} color={theme.primary} />
                </View>
                <Text style={styles.emptyTitle}>No bookings yet</Text>
                <Text style={styles.emptySub}>
                  New booking requests will show up here.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onPress={() => router.push(`/booking/${item.id}`)}
              actionLabel={tab === 'active' ? 'Review' : 'View'}
              onAction={() => router.push(`/booking/${item.id}`)}
            />
          )}
        />
      ) : (
        <FlatList
          data={orderList}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={theme.primary} />
              </View>
            ) : (
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="receipt-outline" size={28} color={theme.primary} />
                </View>
                <Text style={styles.emptyTitle}>
                  No orders yet
                </Text>
                <Text style={styles.emptySub}>
                  Order a meal from a creator to get started.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => {
            const creatorUser = asUser(asCreator(item.creatorId)?.user);
            const creatorName = creatorUser?.name ?? 'Creator';
            const itemsText =
              (item.items ?? [])
                .map((i) => `${i.quantity}× ${i.name}`)
                .join(', ') || '—';
            const s = STATUS_BG[item.status] ?? STATUS_BG.placed;
            return (
              <Pressable
                onPress={() => router.push(`/order/${item.id}`)}
                style={({ pressed }) => [
                  styles.orderCard,
                  pressed ? { opacity: 0.9 } : null,
                ]}
              >
                <View style={styles.orderRow}>
                  <Avatar name={creatorName} size="md" />
                  <View style={styles.orderBody}>
                    <View style={styles.orderTopRow}>
                      <Text style={styles.orderCreatorName}>
                        {creatorName}
                      </Text>
                      <View style={[styles.statusPill, { backgroundColor: s.bg }]}>
                        <Text style={[styles.statusText, { color: s.fg }]}>
                          {STATUS_LABEL[item.status] ?? item.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.itemsText}>
                      {itemsText}
                    </Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLeft}>
                        #{item.reference ?? item.id.slice(-6)} · {fmtRelative(item.createdAt)}
                      </Text>
                      <Text style={styles.metaTotal}>
                        {fmtMoney(item.total)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
