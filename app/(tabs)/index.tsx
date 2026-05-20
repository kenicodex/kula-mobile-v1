import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { Avatar } from "@/components/ui/Avatar";
import { PostCard, type PostItem } from "@/components/feed/PostCard";
import { TweetCard } from "@/components/feed/TweetCard";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/hooks/useTheme";
import { feedService } from "@/services";
import { postToItem } from "@/services/adapters";
import ChefDashboardScreen from "@/app/chef-dashboard";
import { makeStyles } from "./index.styles";

type FeedMode = "reels" | "posts";

export default function HomeScreen() {
  const { user } = useAuthStore();
  if (user?.role === "chef") {
    return <ChefDashboardScreen />;
  }
  return <ClientFeed />;
}

function ClientFeed() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { user } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();
  const [likedLocal, setLikedLocal] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<FeedMode>("reels");

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["feed", "list"],
    queryFn: () => feedService.list({ limit: 20 }),
  });

  const allPosts: PostItem[] = useMemo(() => {
    return (data ?? []).map((p) => ({
      ...postToItem(p),
      liked: likedLocal[p.id] ?? false,
    }));
  }, [data, likedLocal]);

  const posts = useMemo(
    () =>
      mode === "reels"
        ? allPosts.filter((p) => p.type === "video")
        : allPosts.filter((p) => p.type !== "video"),
    [allPosts, mode],
  );

  const like = useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      liked ? feedService.unlike(id) : feedService.like(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed", "list"] }),
  });

  function toggleLike(id: string) {
    const currentlyLiked = likedLocal[id] ?? false;
    setLikedLocal((s) => ({ ...s, [id]: !currentlyLiked }));
    like.mutate({ id, liked: currentlyLiked });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/(tabs)/profile")}>
          <Avatar uri={user?.avatar} name={user?.name} size="sm" />
        </Pressable>
        <View style={styles.headerBody}>
          <Text style={styles.headerGreeting}>Good morning 👋</Text>
          <Text style={styles.headerName}>
            {user?.name?.split(" ")[0] ?? "Guest"}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/inbox")}
          hitSlop={10}
          style={styles.headerIconSpacer}
        >
          <Ionicons name="paper-plane-outline" size={22} color={theme.ink} />
        </Pressable>
        <Pressable onPress={() => router.push("/notifications")} hitSlop={10}>
          <Ionicons name="notifications-outline" size={22} color={theme.ink} />
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
        ListHeaderComponent={
          <View>
            <Pressable onPress={() => router.push("/chefs")} style={styles.cta}>
              <Text style={styles.ctaTitle}>Find a Chef Today</Text>
              <Text style={styles.ctaSubtitle}>
                Browse professional chefs near you and book in minutes.
              </Text>
              <View style={styles.ctaActionRow}>
                <Text style={styles.ctaActionText}>Browse chefs</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={theme.white}
                  style={{ marginLeft: 4 }}
                />
              </View>
            </Pressable>

            <FeedModeToggle mode={mode} onChange={setMode} />
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                {mode === "reels"
                  ? "No reels yet — pull to refresh."
                  : "No posts yet — pull to refresh."}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) =>
          mode === "reels" ? (
            <PostCard
              post={item}
              onOpen={() => router.push(`/post/${item.id}`)}
              onAuthor={() => router.push(`/chefs/${item.chefId}`)}
              onLike={() => toggleLike(item.id)}
              onComment={() => router.push(`/post/${item.id}`)}
            />
          ) : (
            <TweetCard
              post={item}
              onOpen={() => router.push(`/post/${item.id}`)}
              onAuthor={() => router.push(`/chefs/${item.chefId}`)}
              onLike={() => toggleLike(item.id)}
              onComment={() => router.push(`/post/${item.id}`)}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

function FeedModeToggle({
  mode,
  onChange,
}: {
  mode: FeedMode;
  onChange: (m: FeedMode) => void;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.card,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: theme.hair,
        padding: 4,
        marginTop: 16,
      }}
    >
      {(["reels", "posts"] as const).map((m) => {
        const active = mode === m;
        return (
          <Pressable
            key={m}
            onPress={() => onChange(m)}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: active ? theme.primary : "transparent",
              gap: 6,
            }}
          >
            <Ionicons
              name={m === "reels" ? "videocam-outline" : "document-text-outline"}
              size={16}
              color={active ? theme.white : theme.inkMuted}
            />
            <Text
              style={{
                color: active ? theme.white : theme.inkMuted,
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              {m === "reels" ? "Reels" : "Posts"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
