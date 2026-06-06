import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
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
import { SignedImage } from '@/components/ui/SignedImage';
import { creatorsService, feedService, menuService, reviewsService, savedService, usersService, apiErrorMessage } from '@/services';
import { asUser, idOf } from '@/services/adapters';
import { useAuthStore } from '@/store/auth.store';
import { fmtDate, fmtMoney, fmtNumber } from '@/lib/format';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './[id].styles';

type Tab = 'posts' | 'menu' | 'reviews' | 'about';

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

function openDaysFromAvailability(availability: unknown): Set<string> {
  // Backend returns CreatorAvailabilitySlot[] (Prisma rows); older shapes were a
  // Record<dayShort, slots[]>. Normalize both into a set of short-day keys.
  if (Array.isArray(availability)) {
    return new Set(
      availability
        .filter((s: { isAvailable?: boolean }) => s.isAvailable !== false)
        .map((s: { dayOfWeek?: string }) => {
          const k = (s.dayOfWeek ?? '').toLowerCase();
          return SHORT_DAY_FROM_FULL[k] ?? k.slice(0, 3);
        }),
    );
  }
  if (availability && typeof availability === 'object') {
    return new Set(Object.keys(availability as Record<string, unknown>));
  }
  return new Set();
}

function locationText(location: unknown): string {
  if (!location) return '';
  if (typeof location === 'string') return location;
  if (typeof location === 'object') {
    const l = location as { city?: string; state?: string; country?: string };
    return [l.city, l.state, l.country].filter(Boolean).join(', ');
  }
  return '';
}

export default function CreatorProfileScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [tab, setTab] = useState<Tab>('posts');

  const { data: creator, isLoading } = useQuery({
    queryKey: ['creator', id],
    queryFn: () => creatorsService.get(id),
    enabled: !!id,
  });

  // Follow targets the creator's *user* account (follows are user→user).
  const targetUserId = idOf(creator?.user ?? creator?.userId);
  const canFollow = !!targetUserId && targetUserId !== currentUserId;
  const followQ = useQuery({
    queryKey: ['follow', targetUserId],
    queryFn: () => usersService.getFollowState(targetUserId),
    enabled: canFollow,
  });
  const following = followQ.data?.isFollowing ?? false;
  const followMut = useMutation({
    mutationFn: () =>
      following
        ? usersService.unfollow(targetUserId)
        : usersService.follow(targetUserId),
    onSuccess: (state) => {
      qc.setQueryData(['follow', targetUserId], state);
      qc.invalidateQueries({ queryKey: ['users', 'portfolio', targetUserId] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not update follow.'),
        type: 'danger',
      });
    },
  });

  const savedQuery = useQuery({
    queryKey: ['saved', 'creators'],
    queryFn: () => savedService.listCreators(),
  });

  const isSaved = useMemo(
    () => (savedQuery.data ?? []).some((c) => c.id === id),
    [savedQuery.data, id],
  );

  const toggleSave = useMutation({
    mutationFn: () => (isSaved ? savedService.unsaveCreator(id) : savedService.saveCreator(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['saved', 'creators'] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not update saved list.'),
        type: 'danger',
      });
    },
  });

  if (isLoading || !creator) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const creatorUser = asUser(creator.user) ?? asUser(creator.userId);
  const creatorName = creatorUser?.name ?? 'Creator';
  const cuisine = (creator.cuisineTypes ?? []).join(' · ');
  const locText = locationText(creator.location);
  const cover = creatorUser?.avatar;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.cover}>
          <SignedImage
            uri={cover}
            style={styles.coverImage}
            fallbackStyle={styles.coverFallback}
          />
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={[styles.coverButton, styles.coverButtonLeft]}
          >
            <Ionicons name="chevron-back" size={22} color={theme.white} />
          </Pressable>
          <Pressable
            onPress={() => toggleSave.mutate()}
            disabled={toggleSave.isPending}
            hitSlop={10}
            style={[styles.coverButton, styles.coverButtonRight]}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={theme.white}
            />
          </Pressable>
        </View>

        {/* Header */}
        <View style={styles.headerBlock}>
          <View style={styles.headerTopRow}>
            <View style={styles.avatarRing}>
              <Avatar uri={creatorUser?.avatar} name={creatorName} size="xl" />
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => router.push(`/chat/${creator.id}`)}
                style={styles.messageBtn}
              >
                <Text style={styles.messageBtnLabel}>Message</Text>
              </Pressable>
              <Pressable
                onPress={() => followMut.mutate()}
                disabled={!canFollow || followMut.isPending}
                style={[
                  styles.followBtn,
                  following ? styles.followBtnActive : styles.followBtnInactive,
                ]}
              >
                <Text
                  style={[
                    styles.followLabel,
                    following ? styles.followLabelActive : styles.followLabelInactive,
                  ]}
                >
                  {following ? 'Following' : 'Follow'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.creatorName}>{creatorName}</Text>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.primary}
              style={{ marginLeft: 4 }}
            />
          </View>
          {creator.bio && <Text style={styles.bio}>{creator.bio}</Text>}

          <View style={styles.statsRow}>
            <Stat label="Bookings" value={fmtNumber(creator.bookingCount ?? 0)} />
            <Stat label="Reviews" value={fmtNumber(creator.reviewCount)} />
            <Stat label="Rating" value={creator.rating ? creator.rating.toFixed(1) : '—'} />
          </View>

          <View style={styles.metaRow}>
            {locText && (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color={theme.inkMuted} />
                <Text style={styles.metaText}>{locText}</Text>
              </View>
            )}
            {creator.rating ? (
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color="#FFB020" />
                <Text style={styles.metaText}>
                  {creator.rating.toFixed(1)} ({creator.reviewCount ?? 0} reviews)
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.cuisineRow}>
            {(creator.cuisineTypes ?? []).slice(0, 4).map((t) => (
              <View key={t} style={styles.cuisinePill}>
                <Text style={styles.cuisineText}>{t}</Text>
              </View>
            ))}
          </View>

          {creatorUser?.id && (
            <Pressable
              onPress={() => router.push(`/portfolio/${creatorUser.id}`)}
              style={styles.portfolioLink}
            >
              <Ionicons name="briefcase-outline" size={16} color={theme.primary} />
              <Text style={styles.portfolioLinkText}>View Portfolio</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.primary} />
            </Pressable>
          )}
        </View>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {(['posts', 'menu', 'reviews', 'about'] as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={styles.tabButton}>
                <Text
                  style={[
                    styles.tabLabel,
                    active ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
                {active && <View style={styles.tabIndicator} />}
              </Pressable>
            );
          })}
        </View>

        {/* Tab content */}
        {tab === 'posts' && <PostsGrid creatorUserId={creatorUser?.id ?? ''} />}
        {tab === 'menu' && <MenuList creator={creator} />}
        {tab === 'reviews' && <ReviewsList creatorId={creator.id} />}
        {tab === 'about' && <AboutTab creator={creator} cuisine={cuisine} />}
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarSlot}>
          <Button
            label="Message"
            variant="ghost"
            onPress={() => router.push(`/chat/${creator.id}`)}
          />
        </View>
        <View style={styles.bottomBarSlot}>
          <Button
            label="Book Creator"
            variant="primary"
            onPress={() => router.push(`/booking/step1?creatorId=${creator.id}`)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.statWrap}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PostsGrid({ creatorUserId }: { creatorUserId: string }) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { data, isLoading } = useQuery({
    queryKey: ['feed', 'user', creatorUserId],
    queryFn: () => feedService.byUser(creatorUserId, { limit: 30 }),
    enabled: !!creatorUserId,
  });
  if (isLoading) {
    return (
      <View style={styles.loadingPad}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }
  const posts = data ?? [];
  if (posts.length === 0) {
    return (
      <View style={styles.emptyPadLg}>
        <Text style={styles.emptyText}>No posts yet</Text>
      </View>
    );
  }
  return (
    <View style={styles.gridWrap}>
      {posts.map((p) => {
        const uri = p.mediaUrls?.[0];
        return (
          <View key={p.id} style={styles.gridCell}>
            <SignedImage
              uri={uri}
              style={styles.gridImage}
              fallbackStyle={styles.gridPlaceholder}
            />
          </View>
        );
      })}
    </View>
  );
}

function MenuList({ creator }: { creator: Awaited<ReturnType<typeof creatorsService.get>> }) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);

  // Pull the creator's published menu items (available-only for the public view).
  const { data: items, isLoading } = useQuery({
    queryKey: ['menu', 'creator', creator.id],
    queryFn: () => menuService.listByCreator(creator.id),
    enabled: !!creator.id,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (items && items.length > 0) {
    return (
      <View style={styles.sectionPad}>
        {items.map((item) => (
          <View key={item.id} style={styles.menuRow}>
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
        ))}
      </View>
    );
  }

  // Fall back to signature dishes when the creator hasn't built a menu yet.
  const dishes = creator.signatureDishes ?? [];
  if (dishes.length === 0) {
    return (
      <View style={styles.emptyPadLg}>
        <Text style={styles.emptyText}>No menu items yet</Text>
      </View>
    );
  }
  return (
    <View style={styles.sectionPad}>
      {dishes.map((name, i) => (
        <View key={i} style={styles.menuRow}>
          <View style={styles.menuThumb}>
            <Text style={styles.menuEmoji}>🍽️</Text>
          </View>
          <View style={styles.menuBody}>
            <Text style={styles.menuName}>{name}</Text>
            <Text style={styles.menuSub}>Signature dish</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ReviewsList({ creatorId }: { creatorId: string }) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', 'creator', creatorId],
    queryFn: () => reviewsService.forCreator(creatorId, { limit: 20 }),
    enabled: !!creatorId,
  });
  const { data: rating } = useQuery({
    queryKey: ['reviews', 'creator-rating', creatorId],
    queryFn: () => reviewsService.creatorRating(creatorId),
    enabled: !!creatorId,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingPad}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }
  const list = reviews ?? [];
  return (
    <View style={styles.reviewsPad}>
      <View style={styles.reviewSummary}>
        <View style={styles.reviewSummaryLeft}>
          <Text style={styles.reviewAvg}>{rating?.average?.toFixed(1) ?? '—'}</Text>
          <View style={styles.reviewStars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={12} color="#FFB020" />
            ))}
          </View>
          <Text style={styles.reviewCount}>{rating?.count ?? 0} reviews</Text>
        </View>
      </View>

      {list.length === 0 ? (
        <View style={styles.reviewEmptyWrap}>
          <Text style={styles.emptyText}>No reviews yet</Text>
        </View>
      ) : (
        list.map((r) => {
          const u = asUser(r.clientId);
          return (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Avatar name={u?.name ?? 'Guest'} size="sm" />
                <Text style={styles.reviewName}>{u?.name ?? 'Guest'}</Text>
                <View style={styles.reviewRowRight}>
                  {Array.from({ length: Math.round(r.rating) }).map((_, i) => (
                    <Ionicons key={i} name="star" size={12} color="#FFB020" />
                  ))}
                </View>
              </View>
              {r.comment && <Text style={styles.reviewComment}>{r.comment}</Text>}
              <Text style={styles.reviewDate}>{fmtDate(r.createdAt)}</Text>
            </View>
          );
        })
      )}
    </View>
  );
}

function AboutTab({
  creator,
  cuisine,
}: {
  creator: Awaited<ReturnType<typeof creatorsService.get>>;
  cuisine: string;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const openDays = openDaysFromAvailability(creator.availability);
  const creatorUser = asUser(creator.user) ?? asUser(creator.userId);
  const locText = locationText(creator.location);
  const hasContact = !!(creatorUser?.email || creatorUser?.phone || locText);
  return (
    <View style={styles.aboutPad}>
      {hasContact && (
        <Section title="Contact">
          {creatorUser?.phone ? (
            <Pressable
              style={styles.contactRow}
              onPress={() => Linking.openURL(`tel:${creatorUser.phone}`)}
            >
              <Ionicons name="call-outline" size={16} color={theme.primary} />
              <Text style={styles.contactText}>{creatorUser.phone}</Text>
            </Pressable>
          ) : null}
          {creatorUser?.email ? (
            <Pressable
              style={styles.contactRow}
              onPress={() => Linking.openURL(`mailto:${creatorUser.email}`)}
            >
              <Ionicons name="mail-outline" size={16} color={theme.primary} />
              <Text style={styles.contactText}>{creatorUser.email}</Text>
            </Pressable>
          ) : null}
          {locText ? (
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={16} color={theme.primary} />
              <Text style={styles.contactText}>{locText}</Text>
            </View>
          ) : null}
        </Section>
      )}
      <Section title="Services">
        {(creator.serviceTypes ?? []).length === 0 ? (
          <Text style={styles.emptyText}>No services listed.</Text>
        ) : (
          (creator.serviceTypes ?? []).map((s) => (
            <View key={s} style={styles.serviceRow}>
              <View style={styles.serviceDot} />
              <Text style={styles.serviceText}>{s.replace(/_/g, ' ')}</Text>
            </View>
          ))
        )}
      </Section>
      <Section title="Availability">
        <View style={styles.availabilityRow}>
          {Object.keys(DAY_LABELS).map((d) => {
            const open = openDays.has(d);
            return (
              <View
                key={d}
                style={[styles.dayPill, open ? styles.dayPillOpen : styles.dayPillClosed]}
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
      </Section>
      <Section title="Pricing">
        {(creator.pricing ?? []).length === 0 ? (
          <Text style={styles.emptyText}>No pricing posted.</Text>
        ) : (
          (creator.pricing ?? []).map((p, i) => (
            <View key={i} style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>
                {p.serviceType.replace(/_/g, ' ')}
                {p.unit ? ` · ${p.unit}` : ''}
              </Text>
              <Text style={styles.pricingValue}>{fmtMoney(p.basePrice, p.currency)}</Text>
            </View>
          ))
        )}
      </Section>
      {cuisine && (
        <Text style={styles.cuisineCaption}>Specializing in {cuisine}</Text>
      )}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.aboutCard}>
      <Text style={styles.aboutTitle}>{title}</Text>
      {children}
    </View>
  );
}
