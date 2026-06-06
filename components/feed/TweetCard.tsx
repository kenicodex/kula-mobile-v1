import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@/components/ui/Avatar";
import type { Theme } from "@/constants/colors";
import { radius, spacing } from "@/constants/commonStyles";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/hooks/useTheme";
import { LIKE_RED } from "@/constants/colors";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { PostItem } from "./PostCard";

interface TweetCardProps {
  post: PostItem;
  onOpen?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAuthor?: () => void;
}

export function TweetCard({
  post,
  onOpen,
  onLike,
  onComment,
  onShare,
  onAuthor,
}: TweetCardProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <Pressable onPress={onOpen} style={styles.card}>
      {/* Compact author row */}
      <Pressable onPress={onAuthor} style={styles.authorRow} hitSlop={6}>
        <Avatar name={post.creatorName} size="sm" />
        <View style={styles.authorBody}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.creatorName}
            </Text>
            <VerifiedBadge role={post.authorRole} size={13} style={styles.badge} />
          </View>
          <Text style={styles.authorMeta} numberOfLines={1}>
            {post.cuisine ? `${post.cuisine} · ${post.timeAgo}` : post.timeAgo}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={theme.inkMuted} />
      </Pressable>

      {/* Hero image — the star of the card */}
      {post.imageUrl ? (
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        <Pressable onPress={onLike} hitSlop={8} style={styles.action}>
          <Ionicons
            name={post.liked ? "heart" : "heart-outline"}
            size={22}
            color={post.liked ? LIKE_RED : theme.ink}
          />
          <Text style={[styles.actionCount, post.liked && { color: LIKE_RED }]}>
            {post.likes}
          </Text>
        </Pressable>
        <Pressable onPress={onComment} hitSlop={8} style={styles.action}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.ink} />
          <Text style={styles.actionCount}>{post.comments}</Text>
        </Pressable>
        <Pressable onPress={onShare} hitSlop={8} style={styles.action}>
          <Ionicons name="paper-plane-outline" size={20} color={theme.ink} />
        </Pressable>
        <View style={styles.flexSpacer} />
        <Pressable hitSlop={8}>
          <Ionicons name="bookmark-outline" size={20} color={theme.ink} />
        </Pressable>
      </View>

      {/* Description, at the bottom */}
      {post.caption || post.hashtags.length > 0 ? (
        <View style={styles.captionWrap}>
          {post.caption ? (
            <Text style={styles.caption}>
              <Text style={styles.captionAuthor}>{post.creatorName} </Text>
              {post.caption}
            </Text>
          ) : null}
          {post.hashtags.length > 0 ? (
            <Text style={styles.hashtags}>
              {post.hashtags.map((t) => `#${t}`).join(" ")}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: radius["2xl"],
      borderWidth: 1,
      borderColor: theme.hair,
      overflow: "hidden",
    },
    authorRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2.5],
    },
    authorBody: {
      flex: 1,
      marginLeft: spacing[2.5],
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    authorName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: "700",
      flexShrink: 1,
    },
    badge: {
      marginLeft: 4,
    },
    authorMeta: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: 1,
    },
    // Hero image: full-bleed, tall (4:5) so the photo dominates the card. The
    // wrapper owns the box; the image fills it absolutely so it never falls back
    // to the source's intrinsic size.
    imageWrap: {
      width: "100%",
      aspectRatio: 4 / 5,
      backgroundColor: theme.surface,
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },
    actionsRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing[3],
      paddingTop: spacing[2.5],
    },
    action: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: spacing[5],
    },
    actionCount: {
      marginLeft: 4,
      color: theme.inkMuted,
      fontSize: 12,
      fontWeight: "600",
    },
    flexSpacer: { flex: 1 },
    captionWrap: {
      paddingHorizontal: spacing[3],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
    },
    caption: {
      color: theme.ink,
      fontSize: 14,
      lineHeight: 20,
    },
    captionAuthor: {
      fontWeight: "700",
    },
    hashtags: {
      color: theme.primary,
      fontSize: 12,
      marginTop: spacing[1],
      fontWeight: "600",
    },
  });

export default TweetCard;
