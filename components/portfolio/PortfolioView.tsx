import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { NavHeader } from '@/components/layout/NavHeader';
import { Avatar } from '@/components/ui/Avatar';
import { SignedImage } from '@/components/ui/SignedImage';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { feedService, menuService, usersService } from '@/services';
import { postToItem } from '@/services/adapters';
import { useAuthStore } from '@/store/auth.store';
import { sharePortfolio } from '@/lib/sharePortfolio';
import { fmtMoney, fmtNumber } from '@/lib/format';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './PortfolioView.styles';

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_LABELS: Record<string, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};
const SHORT_DAY_FROM_FULL: Record<string, string> = {
  monday: 'mon',
  tuesday: 'tue',
  wednesday: 'wed',
  thursday: 'thu',
  friday: 'fri',
  saturday: 'sat',
  sunday: 'sun',
};

// Normalize the creator's availability slots into a set of short-day keys (mon..sun).
function openDaysFromAvailability(
  slots: { dayOfWeek: string }[] | undefined,
): Set<string> {
  return new Set(
    (slots ?? []).map((s) => {
      const k = (s.dayOfWeek ?? '').toLowerCase();
      return SHORT_DAY_FROM_FULL[k] ?? k.slice(0, 3);
    }),
  );
}

interface PortfolioViewProps {
  userId?: string;
  /** Show the back chevron in the header. Off when rendered as a root tab. */
  showBack?: boolean;
}

export function PortfolioView({ userId, showBack = true }: PortfolioViewProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const qc = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const isOwner = currentUserId === userId;
  const [tab, setTab] = useState<'posts' | 'service'>('posts');

  const [profileQ, postsQ] = useQueries({
    queries: [
      {
        queryKey: ['users', 'portfolio', userId],
        queryFn: () => usersService.getPortfolio(userId!),
        enabled: !!userId,
      },
      {
        queryKey: ['feed', 'user', userId],
        queryFn: () => feedService.byUser(userId!),
        enabled: !!userId,
      },
    ],
  });

  const profile = profileQ.data;
  const posts = useMemo(() => (postsQ.data ?? []).map(postToItem), [postsQ.data]);

  // Published menu items for the creator (available-only, public view).
  const creatorId = profileQ.data?.creatorProfile?.id;
  const menuQ = useQuery({
    queryKey: ['menu', 'creator', creatorId],
    queryFn: () => menuService.listByCreator(creatorId!),
    enabled: !!creatorId,
  });
  const menuItems = menuQ.data ?? [];

  // Follow state — only fetched when viewing someone else's portfolio.
  const followQ = useQuery({
    queryKey: ['follow', userId],
    queryFn: () => usersService.getFollowState(userId!),
    enabled: !!userId && !isOwner,
  });
  const isFollowing = followQ.data?.isFollowing ?? false;
  const followMut = useMutation({
    mutationFn: () =>
      isFollowing ? usersService.unfollow(userId!) : usersService.follow(userId!),
    onSuccess: (state) => {
      qc.setQueryData(['follow', userId], state);
      qc.invalidateQueries({ queryKey: ['users', 'portfolio', userId] });
    },
  });

  // Prefer live follow counts; fall back to the portfolio payload.
  const followerCount = followQ.data?.followerCount ?? profile?.followerCount ?? 0;
  const followingCount =
    followQ.data?.followingCount ?? profile?.followingCount ?? 0;

  const onShare = () => {
    if (!profile) return;
    return sharePortfolio({
      userId: profile.id,
      name: profile.name,
      role: profile.role,
    });
  };

  const onRefresh = () => {
    profileQ.refetch();
    postsQ.refetch();
    menuQ.refetch();
  };

  if (profileQ.isLoading || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <NavHeader
          title={isOwner ? 'My Portfolio' : 'Portfolio'}
          showBack={showBack}
          backVariant="circle"
        />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const creator = profile.creatorProfile;
  const certifications = creator?.certifications ?? [];
  const hasContact = !!(profile.phone || profile.email || creator?.location);
  const serviceTypes = creator?.serviceTypes ?? [];
  const availabilitySlots = creator?.availability ?? [];
  const openDays = openDaysFromAvailability(availabilitySlots);
  const availabilityHours = availabilitySlots.length
    ? `${availabilitySlots.reduce(
        (min, s) => (s.startTime < min ? s.startTime : min),
        availabilitySlots[0].startTime,
      )} – ${availabilitySlots.reduce(
        (max, s) => (s.endTime > max ? s.endTime : max),
        availabilitySlots[0].endTime,
      )}`
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader
        title={isOwner ? 'My Portfolio' : 'Portfolio'}
        showBack={showBack}
        backVariant="circle"
        rightAction={{
          icon: 'paper-plane-outline',
          onPress: onShare,
          accessibilityLabel: 'Share portfolio',
        }}
      />

      <FlatList
        data={tab === 'posts' ? posts : []}
        keyExtractor={(p, i) => `${p.id}-${i}`}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.gridRow}
        refreshControl={
          <RefreshControl
            refreshing={profileQ.isRefetching || postsQ.isRefetching}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <View>
            {profile.coverImageUrl ? (
              <SignedImage
                uri={profile.coverImageUrl}
                style={styles.cover}
                fallbackStyle={styles.coverFallback}
              />
            ) : (
              <View style={[styles.cover, styles.coverFallback]} />
            )}
            <View style={styles.hero}>
              <Avatar uri={profile.avatar ?? undefined} name={profile.name} size="xl" />

              <View style={styles.nameRow}>
                <Text style={styles.name}>{profile.name}</Text>
                {profile.isVerified && (
                  <VerifiedBadge role={profile.role} size={16} />
                )}
              </View>

              <Text style={styles.role}>
                {profile.role === 'creator' ? 'Creator' : 'Member'}
              </Text>

              {profile.creatorProfile?.location ? (
                <Text style={styles.location}>
                  <Ionicons name="location-outline" size={11} color={theme.inkMuted} />
                  {' '}
                  {profile.creatorProfile.location}
                </Text>
              ) : null}

              {profile.creatorProfile?.bio ? (
                <Text style={styles.bio}>{profile.creatorProfile.bio}</Text>
              ) : null}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{posts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{fmtNumber(followerCount)}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{fmtNumber(followingCount)}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                {creator && (
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {fmtNumber(creator.bookingCount ?? 0)}
                    </Text>
                    <Text style={styles.statLabel}>Bookings</Text>
                  </View>
                )}
                {profile.creatorProfile?.reviewCount != null && (
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {(profile.creatorProfile.rating ?? 0).toFixed(1)}
                    </Text>
                    <Text style={styles.statLabel}>
                      Rating · {profile.creatorProfile.reviewCount}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.actionsRow}>
                <Pressable
                  onPress={onShare}
                  style={({ pressed }) => [
                    styles.shareBtn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="paper-plane-outline" size={16} color={theme.white} />
                  <Text style={styles.shareBtnText}>
                    {isOwner ? 'Share My Portfolio' : 'Share Portfolio'}
                  </Text>
                </Pressable>

                {isOwner ? (
                  <Pressable
                    onPress={() => router.push('/account')}
                    style={({ pressed }) => [
                      styles.accountBtn,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name="person-circle-outline" size={16} color={theme.ink} />
                    <Text style={styles.accountBtnText}>My Account</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => followMut.mutate()}
                    disabled={followMut.isPending}
                    style={({ pressed }) => [
                      isFollowing ? styles.accountBtn : styles.shareBtn,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name={isFollowing ? 'checkmark' : 'person-add-outline'}
                      size={16}
                      color={isFollowing ? theme.ink : theme.white}
                    />
                    <Text
                      style={isFollowing ? styles.accountBtnText : styles.shareBtnText}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.tabBar}>
              {(['posts', 'service'] as const).map((t) => {
                const active = tab === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => setTab(t)}
                    style={[styles.tab, active && styles.tabActive]}
                  >
                    <Ionicons
                      name={t === 'posts' ? 'grid-outline' : 'briefcase-outline'}
                      size={16}
                      color={active ? theme.primary : theme.inkMuted}
                    />
                    <Text
                      style={[styles.tabLabel, active && styles.tabLabelActive]}
                    >
                      {t === 'posts' ? 'Posts' : 'Service'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {tab === 'service' ? (
              <View>
            {creator && serviceTypes.length > 0 && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Services</Text>
                <View style={styles.chipRow}>
                  {serviceTypes.map((s) => (
                    <View key={s} style={styles.chip}>
                      <Text style={styles.chipText}>{s.replace(/_/g, ' ')}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {creator && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Availability</Text>
                <View style={styles.dayRow}>
                  {DAY_KEYS.map((d) => {
                    const open = openDays.has(d);
                    return (
                      <View
                        key={d}
                        style={[
                          styles.dayPill,
                          open ? styles.dayPillOpen : styles.dayPillClosed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            open ? styles.dayTextOpen : styles.dayTextClosed,
                          ]}
                        >
                          {DAY_LABELS[d]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                {availabilityHours ? (
                  <Text style={styles.availabilityHours}>{availabilityHours}</Text>
                ) : (
                  <Text style={styles.availabilityEmpty}>
                    No availability set yet.
                  </Text>
                )}
              </View>
            )}

            {creator && menuItems.length > 0 && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Menu</Text>
                {menuItems.map((item, i) => (
                  <View key={item.id}>
                    {i > 0 && <View style={styles.menuDivider} />}
                    <View style={styles.menuRow}>
                      {item.imageUrl ? (
                        <SignedImage uri={item.imageUrl} style={styles.menuThumbImage} />
                      ) : (
                        <View style={styles.menuThumb}>
                          <Text style={styles.menuEmoji}>🍽️</Text>
                        </View>
                      )}
                      <View style={styles.menuBody}>
                        <Text style={styles.menuName}>{item.name}</Text>
                        {(item.description || item.category) && (
                          <Text style={styles.menuSub} numberOfLines={2}>
                            {item.description || item.category}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.menuPrice}>
                        {fmtMoney(item.price, item.currency ?? 'NGN')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {creator && certifications.length > 0 && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Certifications</Text>
                {certifications.map((c, i) => {
                  const sub = [c.issuingAuthority, c.year ? String(c.year) : null]
                    .filter(Boolean)
                    .join(' · ');
                  const row = (
                    <View style={styles.certRow}>
                      <Ionicons name="ribbon-outline" size={18} color={theme.primary} />
                      <View style={styles.certBody}>
                        <Text style={styles.certName}>{c.name}</Text>
                        {sub ? <Text style={styles.certSub}>{sub}</Text> : null}
                      </View>
                      {c.certificateUrl ? (
                        <Ionicons name="open-outline" size={16} color={theme.inkMuted} />
                      ) : null}
                    </View>
                  );
                  return c.certificateUrl ? (
                    <Pressable
                      key={`${c.name}-${i}`}
                      onPress={() => Linking.openURL(c.certificateUrl!)}
                    >
                      {row}
                    </Pressable>
                  ) : (
                    <View key={`${c.name}-${i}`}>{row}</View>
                  );
                })}
              </View>
            )}

            {hasContact && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Contact</Text>
                {profile.phone ? (
                  <Pressable
                    style={styles.contactRow}
                    onPress={() => Linking.openURL(`tel:${profile.phone}`)}
                  >
                    <Ionicons name="call-outline" size={16} color={theme.primary} />
                    <Text style={styles.contactText}>{profile.phone}</Text>
                  </Pressable>
                ) : null}
                {profile.email ? (
                  <Pressable
                    style={styles.contactRow}
                    onPress={() => Linking.openURL(`mailto:${profile.email}`)}
                  >
                    <Ionicons name="mail-outline" size={16} color={theme.primary} />
                    <Text style={styles.contactText}>{profile.email}</Text>
                  </Pressable>
                ) : null}
                {creator?.location ? (
                  <View style={styles.contactRow}>
                    <Ionicons name="location-outline" size={16} color={theme.primary} />
                    <Text style={styles.contactText}>{creator.location}</Text>
                  </View>
                ) : null}
              </View>
            )}

                {!creator && !hasContact ? (
                  <View style={styles.emptyWrap}>
                    <Ionicons
                      name="briefcase-outline"
                      size={32}
                      color={theme.inkFaint}
                    />
                    <Text style={styles.emptyText}>No service info yet.</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/post/${item.id}`)}
            style={({ pressed }) => [
              styles.postCell,
              pressed && styles.pressed,
            ]}
          >
            <SignedImage
              uri={item.imageUrl || undefined}
              style={styles.postImage}
              fallbackStyle={styles.postFallback}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          tab !== 'posts' ? null : postsQ.isLoading ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Ionicons name="images-outline" size={32} color={theme.inkFaint} />
              <Text style={styles.emptyText}>
                {isOwner
                  ? "You haven't posted anything yet."
                  : `${profile.name.split(' ')[0]} hasn't posted yet.`}
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

export default PortfolioView;
