import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { BookingCard, type BookingItem, type BookingStatus } from '@/components/booking/BookingCard';
import { bookingsService } from '@/services';
import { asUser } from '@/services/adapters';
import { fmtDateTime } from '@/lib/format';
import type { Booking } from '@/types';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './chef-bookings.styles';

type Tab = 'requests' | 'upcoming' | 'past';

const STATUS_LABEL: Record<string, BookingStatus> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function toItem(b: Booking): BookingItem {
  const client = asUser(b.clientId);
  return {
    id: b.id,
    chefName: client?.name ?? 'Client',
    service: `${b.serviceType.replace(/_/g, ' ')} · ${b.numberOfGuests} guests`,
    date: fmtDateTime(b.date),
    status: STATUS_LABEL[b.status] ?? 'Pending',
  };
}

function inTab(b: Booking, tab: Tab) {
  if (tab === 'requests') return b.status === 'pending';
  if (tab === 'upcoming') return b.status === 'confirmed' || b.status === 'in_progress';
  return b.status === 'completed' || b.status === 'cancelled';
}

export default function ChefBookingsScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('requests');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['chef', 'bookings'],
    queryFn: () => bookingsService.chefBookings(),
  });

  const data2 = useMemo(
    () => (data ?? []).filter((b) => inTab(b, tab)).map(toItem),
    [data, tab],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={20} color={theme.ink} />
          </Pressable>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.tabsRow}>
          {(['requests', 'upcoming', 'past'] as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    active ? styles.tabTextActive : styles.tabTextInactive,
                  ]}
                >
                  {t === 'requests' ? 'Requests' : t === 'upcoming' ? 'Upcoming' : 'Past'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={data2}
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
              <Text style={styles.emptyText}>Nothing here yet</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => router.push(`/booking/${item.id}`)}
            actionLabel={tab === 'requests' ? 'Review' : 'View'}
            onAction={() => router.push(`/booking/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}
