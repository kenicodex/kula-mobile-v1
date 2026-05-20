import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { bookingsService, ordersService } from '@/services';
import { asUser } from '@/services/adapters';
import { fmtDate, fmtMoney, fmtNumber } from '@/lib/format';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './earnings.styles';

type Period = 'week' | 'month' | 'year';

const PERIOD_DAYS: Record<Period, number> = { week: 7, month: 30, year: 365 };

interface TxRow {
  id: string;
  label: string;
  amount: number;
  dateISO?: string;
  positive: boolean;
}

export default function EarningsScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('month');

  const { data: stats } = useQuery({
    queryKey: ['chef', 'stats'],
    queryFn: () => bookingsService.chefStats(),
  });

  const { data: bookings } = useQuery({
    queryKey: ['chef', 'bookings'],
    queryFn: () => bookingsService.chefBookings(),
  });

  const { data: orders } = useQuery({
    queryKey: ['chef', 'orders'],
    queryFn: () => ordersService.chefOrders(),
  });

  const transactions: TxRow[] = useMemo(() => {
    const days = PERIOD_DAYS[period];
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const bookingTx: TxRow[] = (bookings ?? [])
      .filter((b) => b.status === 'completed' || b.status === 'in_progress')
      .filter((b) => !b.createdAt || new Date(b.createdAt).getTime() >= cutoff)
      .map((b) => {
        const client = asUser(b.clientId);
        return {
          id: `b-${b.id}`,
          label: `${b.serviceType.replace(/_/g, ' ')} · ${client?.name ?? 'Client'}`,
          amount: b.totalAmount ?? 0,
          dateISO: b.createdAt,
          positive: true,
        };
      });

    const orderTx: TxRow[] = (orders ?? [])
      .filter((o) => o.status === 'delivered')
      .filter((o) => !o.createdAt || new Date(o.createdAt).getTime() >= cutoff)
      .map((o) => {
        const client = asUser(o.clientId);
        return {
          id: `o-${o.id}`,
          label: `Order #${o.reference ?? o.id.slice(-6)} · ${client?.name ?? 'Client'}`,
          amount: o.total,
          dateISO: o.createdAt,
          positive: true,
        };
      });

    return [...bookingTx, ...orderTx]
      .sort(
        (a, b) =>
          new Date(b.dateISO ?? 0).getTime() - new Date(a.dateISO ?? 0).getTime(),
      )
      .slice(0, 10);
  }, [bookings, orders, period]);

  const totalForPeriod = transactions.reduce(
    (sum, t) => sum + (t.positive ? t.amount : -t.amount),
    0,
  );

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
        <Text style={styles.headerTitle}>Earnings</Text>
        <Pressable hitSlop={10} style={styles.headerIconBtn}>
          <Ionicons name="download-outline" size={20} color={theme.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.periodSwitcher}>
          {(['week', 'month', 'year'] as Period[]).map((p) => {
            const active = period === p;
            return (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                style={[
                  styles.periodOption,
                  active ? styles.periodOptionActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    active ? styles.periodTextActive : styles.periodTextInactive,
                  ]}
                >
                  {p === 'week' ? 'This week' : p === 'month' ? 'This month' : 'This year'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Lifetime revenue</Text>
          <Text style={styles.revenueAmount}>{fmtMoney(stats?.revenue)}</Text>
          <View style={styles.revenueStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{fmtNumber(stats?.confirmed)}</Text>
              <Text style={styles.statLabel}>Confirmed</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{fmtNumber(stats?.completed)}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <Pressable style={styles.payoutBtn}>
              <Text style={styles.payoutText}>Payout</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.periodTotal}>
          {period === 'week' ? 'Past 7 days' : period === 'month' ? 'Past 30 days' : 'Past 12 months'}:{' '}
          <Text style={styles.periodTotalAmount}>{fmtMoney(totalForPeriod)}</Text>
        </Text>

        <Text style={styles.recentTitle}>Recent transactions</Text>
        <View style={styles.txCard}>
          {transactions.length === 0 ? (
            <View style={styles.txEmpty}>
              <Text style={styles.txEmptyText}>No transactions in this period</Text>
            </View>
          ) : (
            transactions.map((t, i) => (
              <View
                key={t.id}
                style={[
                  styles.txRow,
                  i < transactions.length - 1 ? styles.txRowDivider : null,
                ]}
              >
                <View
                  style={[
                    styles.txIconWrap,
                    { backgroundColor: t.positive ? '#E4F3EB' : '#F8DCD7' },
                  ]}
                >
                  <Ionicons
                    name={t.positive ? 'arrow-down' : 'arrow-up'}
                    size={16}
                    color={t.positive ? theme.success : theme.error}
                  />
                </View>
                <View style={styles.txBody}>
                  <Text style={styles.txLabel} numberOfLines={1}>
                    {t.label}
                  </Text>
                  <Text style={styles.txDate}>{fmtDate(t.dateISO)}</Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: t.positive ? theme.success : theme.error },
                  ]}
                >
                  {t.positive ? '+' : '-'}
                  {fmtMoney(t.amount)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
