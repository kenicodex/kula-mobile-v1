import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useQueries } from '@tanstack/react-query';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { creatorsService, feedService, hashtagsService } from '@/services';
import { creatorToListItem, postToItem } from '@/services/adapters';
import { SignedImage } from '@/components/ui/SignedImage';
import { fmtMoney } from '@/lib/format';
import { makeStyles } from './explore.styles';

export default function ExploreScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [tagsQ, creatorsQ, postsQ] = useQueries({
    queries: [
      {
        queryKey: ['hashtags', 'trending'],
        queryFn: () => hashtagsService.trending(10),
      },
      {
        queryKey: ['creators', 'popular'],
        queryFn: () => creatorsService.search({ limit: 10 }),
      },
      {
        queryKey: ['feed', 'trending'],
        queryFn: () => feedService.trending(30),
      },
    ],
  });

  const tagList = (tagsQ.data ?? []).map((t) => t.name);
  const creatorList = (creatorsQ.data ?? []).map(creatorToListItem);
  const postGrid = (postsQ.data ?? []).map(postToItem);

  const isLoading = tagsQ.isLoading || creatorsQ.isLoading || postsQ.isLoading;
  const isRefetching =
    tagsQ.isRefetching || creatorsQ.isRefetching || postsQ.isRefetching;
  const onRefresh = () => {
    tagsQ.refetch();
    creatorsQ.refetch();
    postsQ.refetch();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Pressable
          onPress={() => router.push('/creators')}
          style={styles.searchBar}
        >
          <Ionicons name="search" size={18} color={theme.inkMuted} />
          <Text style={styles.searchPlaceholder}>
            Search creators, posts, cuisines…
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={postGrid}
        keyExtractor={(p, i) => `${p.id}-${i}`}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <Pressable
              onPress={() => router.push('/creators')}
              style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
            >
              <Text style={styles.ctaTitle}>Find a Creator Today</Text>
              <Text style={styles.ctaSubtitle}>
                Browse professional creators near you and book in minutes.
              </Text>
              <View style={styles.ctaActionRow}>
                <Text style={styles.ctaActionText}>Browse creators</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={theme.white}
                  style={styles.ctaActionIcon}
                />
              </View>
            </Pressable>

            {tagList.length > 0 && (
              <View style={styles.hashtagSection}>
                <Text style={styles.sectionHeader}>Trending tags</Text>
                <FlatList
                  horizontal
                  data={tagList}
                  keyExtractor={(t) => t}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hashtagListContent}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => router.push(`/hashtag/${item}`)}
                      style={({ pressed }) => [
                        styles.hashtagPill,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.hashtagText}>#{item}</Text>
                    </Pressable>
                  )}
                />
              </View>
            )}

            <View style={styles.creatorsHeaderRow}>
              <Text style={styles.sectionHeader}>Popular creators</Text>
              <Pressable
                onPress={() => router.push('/creators')}
                hitSlop={10}
              >
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>
            {creatorList.length === 0 && !creatorsQ.isLoading ? (
              <Text style={styles.emptyInline}>No creators yet.</Text>
            ) : (
              <FlatList
                horizontal
                data={creatorList}
                keyExtractor={(c) => c.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.creatorsListContent}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => router.push(`/creators/${item.id}`)}
                    style={({ pressed }) => [
                      styles.creatorCard,
                      pressed && styles.pressed,
                    ]}
                  >
                    <SignedImage
                      uri={item.coverImageUrl || undefined}
                      style={styles.creatorCover}
                      fallbackStyle={styles.creatorCoverFallback}
                    />
                    <View style={styles.creatorBody}>
                      <Text numberOfLines={1} style={styles.creatorName}>
                        {item.name}
                      </Text>
                      {item.cuisine ? (
                        <Text numberOfLines={1} style={styles.creatorSubtitle}>
                          {item.cuisine}
                        </Text>
                      ) : null}
                      <View style={styles.creatorMetaRow}>
                        <Ionicons name="star" size={11} color="#FFB020" />
                        <Text style={styles.creatorRating}>
                          {item.rating ? item.rating.toFixed(1) : '—'}
                        </Text>
                        {item.basePrice ? (
                          <Text style={styles.creatorPrice}>
                            · from {fmtMoney(item.basePrice)}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            )}

            <Text style={styles.sectionHeaderWithTopGap}>Trending posts</Text>
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
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="sparkles-outline"
                  size={28}
                  color={theme.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>No posts to discover yet</Text>
              <Text style={styles.emptySub}>
                Check back soon — new dishes are added every day.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
