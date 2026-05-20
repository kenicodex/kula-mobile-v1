import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { ordersService } from '@/services';
import { asUser, asChef } from '@/services/adapters';
import type { Order } from '@/types';
import { fmtMoney, fmtRelative } from '@/lib/format';
import { makeStyles } from './orders.styles';

type Tab = 'active' | 'past';

const ACTIVE_STATUSES = new Set(['placed', 'confirmed', 'preparing', 'ready']);

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
  const [tab, setTab] = useState<Tab>('active');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => ordersService.myOrders(),
  });

  const all: Order[] = data ?? [];
  const list = all.filter((o) =>
    tab === 'active' ? ACTIVE_STATUSES.has(o.status) : !ACTIVE_STATUSES.has(o.status),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>
            Orders
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

      <FlatList
        data={list}
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
                Order a meal from a chef to get started.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const chefUser = asUser(asChef(item.chefId)?.user);
          const chefName = chefUser?.name ?? 'Chef';
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
                <Avatar name={chefName} size="md" />
                <View style={styles.orderBody}>
                  <View style={styles.orderTopRow}>
                    <Text style={styles.orderChefName}>
                      {chefName}
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
    </SafeAreaView>
  );
}
