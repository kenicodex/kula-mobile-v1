import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@/components/ui/Avatar";
import { FeedVideo } from "@/components/feed/FeedVideo";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { LIKE_RED } from "@/constants/colors";
import { useTheme } from "@/hooks/useTheme";
import type { PostItem } from "@/components/feed/PostCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ReelItemProps {
  post: PostItem;
  /** Height of one full-screen page (the reels viewport). */
  height: number;
  /** Whether this is the currently visible reel (drives playback). */
  active: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAuthor?: () => void;
  onSave?: () => void;
  saved?: boolean;
}

interface ReelActionProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label?: string | number;
  color?: string;
  onPress?: () => void;
}

/** A horizontal pill action — replaces the IG-style vertical icon rail. */
function ReelAction({ icon, label, color = "#fff", onPress }: ReelActionProps) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={styles.actionPill}>
      <Ionicons name={icon} size={20} color={color} />
      {label != null ? (
        <Text style={[styles.actionLabel, { color }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

/**
 * One full-screen reel. The video fills the page, but instead of the
 * Instagram-style right-hand action rail + floating caption, the metadata and
 * controls live in a single docked "dish card" with a horizontal action bar.
 * Tap the video surface to pause/resume.
 */
export function ReelItem({
  post,
  height,
  active,
  onLike,
  onComment,
  onShare,
  onAuthor,
  onSave,
  saved,
}: ReelItemProps) {
  const { theme } = useTheme();
  const [paused, setPaused] = useState(false);

  return (
    <View style={[styles.page, { height, width: SCREEN_WIDTH }]}>
      {post.imageUrl ? (
        <FeedVideo
          uri={post.imageUrl}
          style={StyleSheet.absoluteFill}
          active={active && !paused}
          onPress={() => setPaused((p) => !p)}
        />
      ) : (
        <View style={StyleSheet.absoluteFill} />
      )}

      {paused && (
        <View style={styles.pausedOverlay} pointerEvents="none">
          <View style={styles.playBubble}>
            <Ionicons name="play" size={42} color="#fff" />
          </View>
        </View>
      )}

      {/* Docked dish card — author, caption, and a horizontal action bar */}
      <View style={styles.card} pointerEvents="box-none">
        <View style={styles.authorRow}>
          <Pressable onPress={onAuthor} style={styles.authorLeft} hitSlop={6}>
            <Avatar name={post.creatorName} size="sm" />
            <Text style={styles.authorName} numberOfLines={1}>
              {post.creatorName}
            </Text>
            <VerifiedBadge role={post.authorRole} size={14} />
          </Pressable>
        </View>

        {post.caption ? (
          <Text style={styles.caption} numberOfLines={2}>
            {post.caption}
          </Text>
        ) : null}
        {post.hashtags.length > 0 ? (
          <Text
            style={[styles.hashtags, { color: theme.primaryLight }]}
            numberOfLines={1}
          >
            {post.hashtags.map((t) => `#${t}`).join(" ")}
          </Text>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.actionsRow}>
          <ReelAction
            icon={post.liked ? "heart" : "heart-outline"}
            color={post.liked ? LIKE_RED : "#fff"}
            label={post.likes}
            onPress={onLike}
          />
          <ReelAction
            icon="chatbubble-outline"
            label={post.comments}
            onPress={onComment}
          />
          <ReelAction icon="arrow-redo-outline" label="Share" onPress={onShare} />
          <ReelAction
            icon={saved ? "bookmark" : "bookmark-outline"}
            label="Save"
            color={saved ? theme.primaryLight : "#fff"}
            onPress={onSave}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#000",
  },
  pausedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playBubble: {
    height: 84,
    width: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  card: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 28,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "rgba(20,18,24,0.62)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.14)",
    gap: 8,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  authorLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  authorName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
  },
  caption: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 19,
  },
  hashtags: {
    fontSize: 13,
    fontWeight: "700",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginTop: 2,
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
});

export default ReelItem;
