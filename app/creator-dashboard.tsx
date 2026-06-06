import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { CreatorHomeDropdown, type CreatorHomeMode } from '@/components/home/CreatorHomeDropdown';
import { bookingsService, feedService, usersService } from '@/services';
import { asUser } from '@/services/adapters';
import { useAuthStore } from '@/store/auth.store';
import { fmtDateTime, fmtMoney, fmtNumber, timeOfDayGreeting } from '@/lib/format';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './creator-dashboard.styles';

const QUICK_ACTIONS: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; href: string }[] = [
  { icon: 'calendar-outline', label: 'Availability', href: '/creator-availability' },
  { icon: 'restaurant-outline', label: 'Menu', href: '/creator-menu' },
  { icon: 'wallet-outline', label: 'Earnings', href: '/earnings' },
  { icon: 'add-circle-outline', label: 'New Post', href: '/post/create' },
];

interface CreatorDashboardScreenProps {
  creatorMode?: CreatorHomeMode;
  onCreatorModeChange?: (mode: CreatorHomeMode) => void;
}

export default function CreatorDashboardScreen({
  creatorMode,
  onCreatorModeChange,
}: CreatorDashboardScreenProps = {}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const userId = user?.id;

  const { data: stats } = useQuery({
    queryKey: ['creator', 'stats'],
    queryFn: () => bookingsService.creatorStats(),
  });

  const { data: bookings } = useQuery({
    queryKey: ['creator', 'bookings', 'pending'],
    queryFn: () => bookingsService.creatorBookings('pending'),
  });

  // Creator (content) side: audience + engagement aggregated from the
  // creator's own profile and posts.
  const { data: portfolio } = useQuery({
    queryKey: ['creator', 'portfolio', userId],
    queryFn: () => usersService.getPortfolio(userId!),
    enabled: !!userId,
  });

  const { data: myPosts } = useQuery({
    queryKey: ['creator', 'posts', userId],
    queryFn: () => feedService.byUser(userId!),
    enabled: !!userId,
  });

  const posts = myPosts ?? [];
  const totalLikes = posts.reduce((sum, p) => sum + (p.likeCount ?? 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.commentCount ?? 0), 0);
  const reels = posts.filter((p) => p.type === 'video').length;
  const engagements = totalLikes + totalComments;
  const avgEngagement = posts.length
    ? Math.round(engagements / posts.length)
    : 0;

  const metrics: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value: string;
  }[] = [
    { icon: 'people-outline', label: 'Followers', value: fmtNumber(portfolio?.followerCount ?? 0) },
    { icon: 'grid-outline', label: 'Posts', value: fmtNumber(posts.length) },
    { icon: 'heart-outline', label: 'Likes', value: fmtNumber(totalLikes) },
    { icon: 'chatbubble-outline', label: 'Comments', value: fmtNumber(totalComments) },
    { icon: 'film-outline', label: 'Reels', value: fmtNumber(reels) },
    {
      icon: 'star-outline',
      label: 'Rating',
      value: (portfolio?.creatorProfile?.rating ?? 0).toFixed(1),
    },
  ];

  const pending = (bookings ?? []).slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing[3] }]}>
        <Avatar uri={user?.avatar} name={user?.name} size="sm" />
        {creatorMode && onCreatorModeChange ? (
          <CreatorHomeDropdown
            style={styles.headerBody}
            greeting={`${timeOfDayGreeting()}, ${user?.name?.split(' ')[0] ?? 'Creator'} 👋`}
            mode={creatorMode}
            onChange={onCreatorModeChange}
          />
        ) : (
          <View style={styles.headerBody}>
            <Text style={styles.greeting}>
              {timeOfDayGreeting()}, {user?.name?.split(' ')[0] ?? 'Creator'} 👋
            </Text>
            <Text style={styles.roleLabel}>Creator</Text>
          </View>
        )}
        <Pressable onPress={() => router.push('/notifications')} hitSlop={10}>
          <Ionicons name="notifications-outline" size={22} color={theme.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Earnings card */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Total earnings</Text>
          <Text style={styles.revenueAmount}>{fmtMoney(stats?.revenue)}</Text>
          <View style={styles.statsRow}>
            <Stat label="Bookings" value={fmtNumber(stats?.total)} />
            <Stat label="Confirmed" value={fmtNumber(stats?.confirmed)} />
            <Stat label="Completed" value={fmtNumber(stats?.completed)} />
          </View>
        </View>

        {/* Engagement highlight strip */}
        <View style={styles.engageRow}>
          <View style={styles.engageCard}>
            <Ionicons name="flame-outline" size={18} color={theme.primary} />
            <Text style={styles.engageValue}>{fmtNumber(engagements)}</Text>
            <Text style={styles.engageLabel}>Total engagements</Text>
          </View>
          <View style={styles.engageCard}>
            <Ionicons name="trending-up-outline" size={18} color={theme.primary} />
            <Text style={styles.engageValue}>{fmtNumber(avgEngagement)}</Text>
            <Text style={styles.engageLabel}>Avg / post</Text>
          </View>
        </View>

        {/* Audience & engagement metrics */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Audience &amp; engagement</Text>
          <Pressable onPress={() => userId && router.push(`/creators/${userId}` as any)}>
            <Text style={styles.sectionLink}>View profile</Text>
          </Pressable>
        </View>
        <View style={styles.metricsCard}>
          <View style={styles.metricsGrid}>
            {metrics.map((m) => (
              <View key={m.label} style={styles.metricTile}>
                <View style={styles.metricIcon}>
                  <Ionicons name={m.icon} size={18} color={theme.primary} />
                </View>
                <Text style={styles.metricValue}>{m.value}</Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
              </View>
            ))}
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
          <Pressable onPress={() => router.push('/creator-bookings')}>
            <Text style={styles.pendingSeeAll}>See all</Text>
          </Pressable>
        </View>
        <View style={styles.pendingList}>
          {pending.length === 0 ? (
            <Text style={styles.pendingEmpty}>No pending requests</Text>
          ) : (
            pending.map((b) => {
              const client = asUser(b.client) ?? asUser(b.clientId);
              return (
                <Pressable
                  key={b.id}
                  onPress={() => router.push(`/booking/${b.id}`)}
                  style={styles.pendingCard}
                >
                  <Avatar uri={client?.avatar} name={client?.name ?? 'Client'} size="md" />
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
