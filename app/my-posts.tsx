import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { PostCard, type PostItem } from "@/components/feed/PostCard";
import { NavHeader } from "@/components/layout/NavHeader";
import { feedService } from "@/services";
import { postToItem } from "@/services/adapters";
import { useAuthStore } from "@/store/auth.store";
import type { Theme } from "@/constants/colors";
import { spacing } from "@/constants/commonStyles";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/hooks/useTheme";

export default function MyPostsScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["feed", "user", userId],
    queryFn: () => feedService.byUser(userId!),
    enabled: !!userId,
  });

  const posts: PostItem[] = useMemo(
    () => (data ?? []).map((p) => postToItem(p)),
    [data],
  );
  console.log(posts);
  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader
        title="My Posts"
        rightAction={{
          icon: "add",
          onPress: () => router.push("/post/create"),
          accessibilityLabel: "Create post",
        }}
      />

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
              <Ionicons
                name="images-outline"
                size={36}
                color={theme.inkFaint}
              />
              <Text style={styles.emptyText}>
                You haven&apos;t posted anything yet.
              </Text>
              <Pressable
                onPress={() => router.push("/post/create")}
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
            onAuthor={() => router.push(`/creators/${item.creatorId}`)}
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
    listContent: {
      padding: spacing[4],
      gap: spacing[4],
      paddingBottom: spacing[8],
    },
    emptyWrap: {
      paddingVertical: spacing[12],
      alignItems: "center",
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
      fontWeight: "700",
      fontSize: 13,
    },
  });
