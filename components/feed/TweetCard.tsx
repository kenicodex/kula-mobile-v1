import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import type { PostItem } from './PostCard';

interface TweetCardProps {
  post: PostItem;
  onOpen?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onAuthor?: () => void;
}

export function TweetCard({ post, onOpen, onLike, onComment, onAuthor }: TweetCardProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <Pressable onPress={onOpen} style={styles.card}>
      <View style={styles.row}>
        <Pressable onPress={onAuthor} hitSlop={6}>
          <Avatar name={post.chefName} size="sm" />
        </Pressable>
        <View style={styles.body}>
          <View style={styles.authorRow}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.chefName}
            </Text>
            <Ionicons
              name="checkmark-circle"
              size={13}
              color={theme.primary}
              style={styles.badge}
            />
            <Text style={styles.meta} numberOfLines={1}>
              {post.cuisine ? ` · ${post.cuisine}` : ''} · {post.timeAgo}
            </Text>
          </View>

          <Text style={styles.caption}>{post.caption}</Text>

          {post.hashtags.length > 0 ? (
            <Text style={styles.hashtags}>
              {post.hashtags.map((t) => `#${t}`).join(' ')}
            </Text>
          ) : null}

          {post.imageUrl ? (
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}

          <View style={styles.actionsRow}>
            <Pressable onPress={onComment} hitSlop={8} style={styles.action}>
              <Ionicons name="chatbubble-outline" size={18} color={theme.inkMuted} />
              <Text style={styles.actionCount}>{post.comments}</Text>
            </Pressable>
            <Pressable onPress={onLike} hitSlop={8} style={styles.action}>
              <Ionicons
                name={post.liked ? 'heart' : 'heart-outline'}
                size={18}
                color={post.liked ? theme.error : theme.inkMuted}
              />
              <Text style={styles.actionCount}>{post.likes}</Text>
            </Pressable>
            <View style={styles.flexSpacer} />
            <Pressable hitSlop={8}>
              <Ionicons name="bookmark-outline" size={18} color={theme.inkMuted} />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[3],
    },
    row: {
      flexDirection: 'row',
    },
    body: {
      flex: 1,
      marginLeft: spacing[2.5],
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authorName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
      maxWidth: '55%',
    },
    badge: {
      marginLeft: 4,
    },
    meta: {
      color: theme.inkMuted,
      fontSize: 12,
      flexShrink: 1,
    },
    caption: {
      color: theme.ink,
      fontSize: 14,
      lineHeight: 20,
      marginTop: spacing[1],
    },
    hashtags: {
      color: theme.primary,
      fontSize: 12,
      marginTop: spacing[1],
      fontWeight: '600',
    },
    image: {
      width: '100%',
      aspectRatio: 16 / 9,
      borderRadius: radius.xl,
      marginTop: spacing[2],
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[2],
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing[5],
    },
    actionCount: {
      marginLeft: 4,
      color: theme.inkMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    flexSpacer: { flex: 1 },
  });

export default TweetCard;
