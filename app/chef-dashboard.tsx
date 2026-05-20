import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { bookingsService, chefsService } from '@/services';
import { asUser } from '@/services/adapters';
import { useAuthStore } from '@/store/auth.store';
import { fmtDateTime, fmtMoney, fmtNumber } from '@/lib/format';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './chef-dashboard.styles';

const QUICK_ACTIONS: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; href: string }[] = [
  { icon: 'calendar-outline', label: 'Availability', href: '/chef-availability' },
  { icon: 'restaurant-outline', label: 'Menu', href: '/chef-menu' },
  { icon: 'wallet-outline', label: 'Earnings', href: '/earnings' },
  { icon: 'add-circle-outline', label: 'New Post', href: '/post/create' },
];

export default function ChefDashboardScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['chef', 'stats'],
    queryFn: () => bookingsService.chefStats(),
  });

  const { data: bookings } = useQuery({
    queryKey: ['chef', 'bookings', 'pending'],
    queryFn: () => bookingsService.chefBookings('pending'),
  });

  const { data: chefProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['chef', 'me', 'profile'],
    queryFn: () => chefsService.myProfile(),
    retry: false,
  });

  const pending = (bookings ?? []).slice(0, 3);
  const needsOnboarding = !profileLoading && !chefProfile?.status;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Avatar uri={user?.avatar} name={user?.name} size="sm" />
        <View style={styles.headerBody}>
          <Text style={styles.greeting}>
            Good morning, {user?.name?.split(' ')[0] ?? 'Chef'} 👋
          </Text>
          <Text style={styles.roleLabel}>Chef</Text>
        </View>
        <Pressable onPress={() => router.push('/notifications')} hitSlop={10}>
          <Ionicons name="notifications-outline" size={22} color={theme.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {needsOnboarding && (
          <Pressable
            onPress={() => router.push('/(auth)/chef/onboard/step1')}
            style={styles.completeProfileCard}
          >
            <View style={styles.completeProfileIcon}>
              <Ionicons name="ribbon-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.completeProfileBody}>
              <Text style={styles.completeProfileTitle}>Complete your chef profile</Text>
              <Text style={styles.completeProfileSubtitle}>
                Set up your bio, cuisines, services and availability so clients can find you.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />
          </Pressable>
        )}

        {/* Earnings card */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Revenue (lifetime)</Text>
          <Text style={styles.revenueAmount}>{fmtMoney(stats?.revenue)}</Text>
          <View style={styles.statsRow}>
            <Stat label="Total" value={fmtNumber(stats?.total)} />
            <Stat label="Confirmed" value={fmtNumber(stats?.confirmed)} />
            <Stat label="Completed" value={fmtNumber(stats?.completed)} />
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              onPress={() => router.push(a.href as any)}
              style={styles.quickAction}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={a.icon} size={20} color={theme.primary} />
              </View>
              <Text style={styles.quickActionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Pending requests */}
        <View style={styles.pendingHeaderRow}>
          <Text style={styles.pendingHeaderTitle}>Pending requests</Text>
          <Pressable onPress={() => router.push('/chef-bookings')}>
            <Text style={styles.pendingSeeAll}>See all</Text>
          </Pressable>
        </View>
        <View style={styles.pendingList}>
          {pending.length === 0 ? (
            <Text style={styles.pendingEmpty}>No pending requests</Text>
          ) : (
            pending.map((b) => {
              const client = asUser(b.clientId);
              return (
                <Pressable
                  key={b.id}
                  onPress={() => router.push(`/booking/${b.id}`)}
                  style={styles.pendingCard}
                >
                  <Avatar name={client?.name ?? 'Client'} size="md" />
                  <View style={styles.pendingCardBody}>
                    <Text style={styles.pendingClient}>{client?.name ?? 'Client'}</Text>
                    <Text style={styles.pendingService}>
                      {b.serviceType.replace(/_/g, ' ')} · {b.numberOfGuests} guests
                    </Text>
                    <Text style={styles.pendingDate}>{fmtDateTime(b.date)}</Text>
                  </View>
                  <View style={styles.pendingPill}>
                    <Text style={styles.pendingPillText}>Pending</Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.statCol}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
