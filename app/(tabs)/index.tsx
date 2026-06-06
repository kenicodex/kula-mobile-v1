import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  Pressable,
  RefreshControl,
  Text,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { spacing } from "@/constants/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { Avatar } from "@/components/ui/Avatar";
import { type PostItem } from "@/components/feed/PostCard";
import { TweetCard } from "@/components/feed/TweetCard";
import { ReelItem } from "@/components/feed/ReelItem";
import { CreatorHomeDropdown, type CreatorHomeMode } from "@/components/home/CreatorHomeDropdown";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/hooks/useTheme";
import { feedService } from "@/services";
import { postToItem } from "@/services/adapters";
import { timeOfDayGreeting } from "@/lib/format";
import { sharePost } from "@/lib/sharePost";
import CreatorDashboardScreen from "@/app/creator-dashboard";
import { makeStyles } from "./index.styles";

type FeedMode = "reels" | "posts";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [creatorMode, setCreatorMode] = useState<CreatorHomeMode>("dashboard");

  if (user?.role === "creator") {
    return creatorMode === "dashboard" ? (
      <CreatorDashboardScreen creatorMode={creatorMode} onCreatorModeChange={setCreatorMode} />
    ) : (
      <ClientFeed creatorMode={creatorMode} onCreatorModeChange={setCreatorMode} />
    );
  }
  return <ClientFeed />;
}

interface ClientFeedProps {
  creatorMode?: CreatorHomeMode;
  onCreatorModeChange?: (mode: CreatorHomeMode) => void;
}

function ClientFeed({ creatorMode, onCreatorModeChange }: ClientFeedProps = {}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { user } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const [likedLocal, setLikedLocal] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<FeedMode>("reels");
  const reels = mode === "reels";
  const isFocused = useIsFocused();

  // In reels mode the header floats over the video; we measure its height so the
  // mode toggle can sit just below it.
  const [headerH, setHeaderH] = useState(0);

  // Full-screen reels: page height is the measured viewport; only the visible
  // reel plays.
  const [reelHeight, setReelHeight] = useState(0);
  const [activeReel, setActiveReel] = useState(0);
  const onReelsLayout = (e: LayoutChangeEvent) =>
    setReelHeight(e.nativeEvent.layout.height);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveReel(viewableItems[0].index);
      }
    },
  ).current;

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

  const buildHandlers = (item: PostItem) => ({
    onOpen: () => router.push(`/post/${item.id}`),
    onAuthor: () => router.push(`/creators/${item.creatorId}`),
    onLike: () => toggleLike(item.id),
    onComment: () => router.push(`/post/${item.id}`),
    onShare: () =>
      sharePost({
        id: item.id,
        authorName: item.creatorName,
        caption: item.caption,
        mediaUrl: item.imageUrl || null,
      }),
  });

  return (
    <SafeAreaView style={[styles.safeArea, reels && styles.reelsRoot]} edges={[]}>
      {reels && <StatusBar style="light" />}
      <View
        onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
        style={[
          styles.header,
          { paddingTop: insets.top + spacing[3] },
          reels && styles.headerOverlay,
        ]}
      >
        <Pressable onPress={() => router.push("/(tabs)/profile")}>
          <Avatar uri={user?.avatar} name={user?.name} size="sm" />
        </Pressable>
        {creatorMode && onCreatorModeChange ? (
          <CreatorHomeDropdown
            style={styles.headerBody}
            greeting={`${timeOfDayGreeting()} 👋`}
            mode={creatorMode}
            onChange={onCreatorModeChange}
          />
        ) : (
          <View style={styles.headerBody}>
            <Text style={[styles.headerGreeting, reels && styles.onVideoSub]}>
              {timeOfDayGreeting()} 👋
            </Text>
            <Text style={[styles.headerName, reels && styles.onVideo]}>
              {user?.name?.split(" ")[0] ?? "Guest"}
            </Text>
          </View>
        )}
        <Pressable
          onPress={() => router.push("/inbox")}
          hitSlop={10}
          style={styles.headerIconSpacer}
        >
          <Ionicons
            name="paper-plane-outline"
            size={22}
            color={reels ? "#fff" : theme.ink}
          />
        </Pressable>
        <Pressable onPress={() => router.push("/notifications")} hitSlop={10}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={reels ? "#fff" : theme.ink}
          />
        </Pressable>
      </View>

      {mode === "reels" ? (
        <View style={styles.reelsContainer} onLayout={onReelsLayout}>
          {reelHeight > 0 && (
            <FlatList
              data={posts}
              keyExtractor={(p) => p.id}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              getItemLayout={(_, index) => ({
                length: reelHeight,
                offset: reelHeight * index,
                index,
              })}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  tintColor="#fff"
                />
              }
              ListEmptyComponent={
                <View style={[styles.reelsEmpty, { height: reelHeight }]}>
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.reelsEmptyText}>
                      No reels yet — pull to refresh.
                    </Text>
                  )}
                </View>
              }
              renderItem={({ item, index }) => (
                <ReelItem
                  post={item}
                  height={reelHeight}
                  active={isFocused && index === activeReel}
                  {...buildHandlers(item)}
                />
              )}
            />
          )}

          {/* Reels/Posts toggle floats over the video, just below the header */}
          <View
            style={[styles.reelsToggleOverlay, { top: headerH + spacing[2] }]}
            pointerEvents="box-none"
          >
            <FeedModeToggle mode={mode} onChange={setMode} variant="overlay" />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.toggleBar}>
            <FeedModeToggle mode={mode} onChange={setMode} />
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
                <Text style={styles.emptyText}>
                  No posts yet — pull to refresh.
                </Text>
              </View>
            )
          }
            renderItem={({ item }) => (
              <TweetCard post={item} {...buildHandlers(item)} />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

function FeedModeToggle({
  mode,
  onChange,
  variant = "bar",
}: {
  mode: FeedMode;
  onChange: (m: FeedMode) => void;
  /** "overlay" floats the toggle over the reels video with dark glassy styling. */
  variant?: "bar" | "overlay";
}) {
  const { theme } = useTheme();
  const overlay = variant === "overlay";
  const inactiveColor = overlay ? "rgba(255,255,255,0.85)" : theme.inkMuted;
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: overlay ? "rgba(0,0,0,0.4)" : theme.card,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: overlay ? "rgba(255,255,255,0.25)" : theme.hair,
        padding: 4,
        marginTop: overlay ? 0 : 16,
        ...(overlay ? { width: 220 } : null),
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
              color={active ? theme.white : inactiveColor}
            />
            <Text
              style={{
                color: active ? theme.white : inactiveColor,
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
