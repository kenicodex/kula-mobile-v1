import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { chefsService, feedService, reviewsService } from '@/services';
import { asUser } from '@/services/adapters';
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

export default function ChefProfileScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('posts');
  const [following, setFollowing] = useState(false);

  const { data: chef, isLoading } = useQuery({
    queryKey: ['chef', id],
    queryFn: () => chefsService.get(id),
    enabled: !!id,
  });

  if (isLoading || !chef) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const chefUser = asUser(chef.user) ?? asUser(chef.userId);
  const chefName = chefUser?.name ?? 'Chef';
  const cuisine = (chef.cuisineTypes ?? []).join(' · ');
  const locText = chef.location
    ? [chef.location.city, chef.location.state].filter(Boolean).join(', ')
    : '';
  const cover = chefUser?.avatar;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.cover}>
          {cover ? (
            <Image source={{ uri: cover }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={styles.coverFallback} />
          )}
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={[styles.coverButton, styles.coverButtonLeft]}
          >
            <Ionicons name="chevron-back" size={22} color={theme.white} />
          </Pressable>
          <Pressable
            hitSlop={10}
            style={[styles.coverButton, styles.coverButtonRight]}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.white} />
          </Pressable>
        </View>

        {/* Header */}
        <View style={styles.headerBlock}>
          <View style={styles.headerTopRow}>
            <View style={styles.avatarRing}>
              <Avatar uri={chefUser?.avatar} name={chefName} size="xl" />
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => router.push(`/chat/${chef.id}`)}
                style={styles.messageBtn}
              >
                <Text style={styles.messageBtnLabel}>Message</Text>
              </Pressable>
              <Pressable
                onPress={() => setFollowing((p) => !p)}
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
            <Text style={styles.chefName}>{chefName}</Text>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.primary}
              style={{ marginLeft: 4 }}
            />
          </View>
          {chef.bio && <Text style={styles.bio}>{chef.bio}</Text>}

          <View style={styles.statsRow}>
            <Stat label="Bookings" value={fmtNumber(chef.bookingCount ?? 0)} />
            <Stat label="Reviews" value={fmtNumber(chef.reviewCount)} />
            <Stat label="Rating" value={chef.rating ? chef.rating.toFixed(1) : '—'} />
          </View>

          <View style={styles.metaRow}>
            {locText && (
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color={theme.inkMuted} />
                <Text style={styles.metaText}>{locText}</Text>
              </View>
            )}
            {chef.rating ? (
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color="#FFB020" />
                <Text style={styles.metaText}>
                  {chef.rating.toFixed(1)} ({chef.reviewCount ?? 0} reviews)
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.cuisineRow}>
            {(chef.cuisineTypes ?? []).slice(0, 4).map((t) => (
              <View key={t} style={styles.cuisinePill}>
                <Text style={styles.cuisineText}>{t}</Text>
              </View>
            ))}
          </View>
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
        {tab === 'posts' && <PostsGrid chefUserId={chefUser?.id ?? ''} />}
        {tab === 'menu' && <MenuList chef={chef} />}
        {tab === 'reviews' && <ReviewsList chefId={chef.id} />}
        {tab === 'about' && <AboutTab chef={chef} cuisine={cuisine} />}
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarSlot}>
          <Button
            label="Message"
            variant="ghost"
            onPress={() => router.push(`/chat/${chef.id}`)}
          />
        </View>
        <View style={styles.bottomBarSlot}>
          <Button
            label="Book Chef"
            variant="primary"
            onPress={() => router.push(`/booking/step1?chefId=${chef.id}`)}
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

function PostsGrid({ chefUserId }: { chefUserId: string }) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { data, isLoading } = useQuery({
    queryKey: ['feed', 'user', chefUserId],
    queryFn: () => feedService.byUser(chefUserId, { limit: 30 }),
    enabled: !!chefUserId,
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
            {uri ? (
              <Image source={{ uri }} style={styles.gridImage} resizeMode="cover" />
            ) : (
              <View style={styles.gridPlaceholder} />
            )}
          </View>
        );
      })}
    </View>
  );
}

function MenuList({ chef }: { chef: Awaited<ReturnType<typeof chefsService.get>> }) {
  const styles = useStyles(makeStyles);
  // Backend does not expose a per-chef menu endpoint. Surface signatureDishes
  // as the menu placeholder.
  const dishes = chef.signatureDishes ?? [];
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

function ReviewsList({ chefId }: { chefId: string }) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', 'chef', chefId],
    queryFn: () => reviewsService.forChef(chefId, { limit: 20 }),
    enabled: !!chefId,
  });
  const { data: rating } = useQuery({
    queryKey: ['reviews', 'chef-rating', chefId],
    queryFn: () => reviewsService.chefRating(chefId),
    enabled: !!chefId,
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
  chef,
  cuisine,
}: {
  chef: Awaited<ReturnType<typeof chefsService.get>>;
  cuisine: string;
}) {
  const styles = useStyles(makeStyles);
  const availability = chef.availability ?? {};
  const openDays = new Set(Object.keys(availability));
  return (
    <View style={styles.aboutPad}>
      <Section title="Services">
        {(chef.serviceTypes ?? []).length === 0 ? (
          <Text style={styles.emptyText}>No services listed.</Text>
        ) : (
          (chef.serviceTypes ?? []).map((s) => (
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
        {(chef.pricing ?? []).length === 0 ? (
          <Text style={styles.emptyText}>No pricing posted.</Text>
        ) : (
          (chef.pricing ?? []).map((p, i) => (
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
