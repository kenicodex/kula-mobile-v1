import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { CreatorCard } from '@/components/creator/CreatorCard';
import { SignedImage } from '@/components/ui/SignedImage';
import { savedService } from '@/services';
import { creatorToListItem } from '@/services/adapters';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import type { Creator, Post } from '@/types';
import { makeStyles } from './saved.styles';

type Tab = 'creators' | 'posts';

export default function SavedScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('creators');

  const creatorsQuery = useQuery({
    queryKey: ['saved', 'creators'],
    queryFn: () => savedService.listCreators(),
    enabled: tab === 'creators',
  });

  const postsQuery = useQuery({
    queryKey: ['saved', 'posts'],
    queryFn: () => savedService.listPosts(),
    enabled: tab === 'posts',
  });

  const creatorItems = useMemo(
    () => (creatorsQuery.data ?? []).map((c) => creatorToListItem(c as Creator)),
    [creatorsQuery.data],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <Text style={styles.headerTitle}>Saved</Text>
        <View style={styles.tabsRow}>
          {(['creators', 'posts'] as Tab[]).map((t) => {
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
                  {t === 'creators' ? 'Creators' : 'Posts'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {tab === 'creators' ? (
        creatorsQuery.isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : (
          <FlatList
            data={creatorItems}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.listContent}
            refreshing={creatorsQuery.isFetching && !creatorsQuery.isLoading}
            onRefresh={() => creatorsQuery.refetch()}
            ListEmptyComponent={
              <Empty
                icon="bookmark-outline"
                message="No saved creators yet"
                sub="Bookmark creators you love so they're easy to find."
              />
            }
            renderItem={({ item }) => (
              <CreatorCard creator={item} onPress={() => router.push(`/creators/${item.id}`)} />
            )}
          />
        )
      ) : postsQuery.isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={postsQuery.data ?? []}
          keyExtractor={(p) => (p as Post).id}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          refreshing={postsQuery.isFetching && !postsQuery.isLoading}
          onRefresh={() => postsQuery.refetch()}
          ListEmptyComponent={
            <Empty
              icon="bookmark-outline"
              message="No saved posts yet"
              sub="Save posts to revisit recipes and ideas later."
            />
          }
          renderItem={({ item }) => {
            const post = item as Post;
            const uri = post.mediaUrls?.[0];
            return (
              <Pressable
                style={styles.gridTile}
                onPress={() => router.push(`/post/${post.id}`)}
              >
                <SignedImage
                  uri={uri}
                  style={styles.gridImage}
                  fallbackStyle={[styles.gridImage, styles.gridImageEmpty]}
                />
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

function Empty({
  icon,
  message,
  sub,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  message: string;
  sub: string;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={theme.primary} />
      </View>
      <Text style={styles.emptyTitle}>{message}</Text>
      <Text style={styles.emptySub}>{sub}</Text>
    </View>
  );
}
