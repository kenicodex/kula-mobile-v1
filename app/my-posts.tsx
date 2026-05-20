import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { PostCard, type PostItem } from '@/components/feed/PostCard';
import { feedService } from '@/services';
import { postToItem } from '@/services/adapters';
import { useAuthStore } from '@/store/auth.store';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';

export default function MyPostsScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['feed', 'user', userId],
    queryFn: () => feedService.byUser(userId!),
    enabled: !!userId,
  });

  const posts: PostItem[] = useMemo(
    () => (data ?? []).map((p) => postToItem(p)),
    [data],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>My Posts</Text>
        <Pressable
          onPress={() => router.push('/post/create')}
          hitSlop={10}
          style={styles.headerBtn}
        >
          <Ionicons name="add" size={22} color={theme.ink} />
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Ionicons name="images-outline" size={36} color={theme.inkFaint} />
              <Text style={styles.emptyText}>You haven&apos;t posted anything yet.</Text>
              <Pressable
                onPress={() => router.push('/post/create')}
                style={styles.emptyCta}
              >
                <Text style={styles.emptyCtaText}>Create your first post</Text>
              </Pressable>
            </View>
          )
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onOpen={() => router.push(`/post/${item.id}`)}
            onAuthor={() => router.push(`/chefs/${item.chefId}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    header: {
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    headerBtn: {
      width: 36,
      height: 36,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      padding: spacing[4],
      gap: spacing[4],
      paddingBottom: spacing[8],
    },
    emptyWrap: {
      paddingVertical: spacing[12],
      alignItems: 'center',
      gap: spacing[2],
    },
    emptyText: {
      color: theme.inkMuted,
      fontSize: 13,
    },
    emptyCta: {
      marginTop: spacing[3],
      backgroundColor: theme.primary,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2.5],
      borderRadius: 999,
    },
    emptyCtaText: {
      color: theme.white,
      fontWeight: '700',
      fontSize: 13,
    },
  });
