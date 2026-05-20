import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import type { PostType } from '@/types';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './PostCard.styles';

export interface PostItem {
  id: string;
  chefId: string;
  chefName: string;
  cuisine?: string;
  timeAgo: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  likes: number;
  comments: number;
  liked?: boolean;
  type?: PostType;
}

interface PostCardProps {
  post: PostItem;
  onOpen?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onAuthor?: () => void;
}

export function PostCard({
  post,
  onOpen,
  onLike,
  onComment,
  onAuthor,
}: PostCardProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.card}>
      <Pressable onPress={onAuthor} style={styles.authorRow}>
        <Avatar name={post.chefName} size="sm" />
        <View style={styles.authorBody}>
          <View style={styles.authorTopRow}>
            <Text style={styles.authorName}>{post.chefName}</Text>
            <Ionicons
              name="checkmark-circle"
              size={13}
              color={theme.primary}
              style={styles.authorBadgeSpacer}
            />
          </View>
          <Text style={styles.authorMeta}>
            {post.cuisine ? `${post.cuisine} · ${post.timeAgo}` : post.timeAgo}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={theme.inkMuted} />
      </Pressable>

      <Pressable onPress={onOpen}>
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </Pressable>

      <View style={styles.actionsRow}>
        <Pressable onPress={onLike} hitSlop={8} style={styles.actionLeft}>
          <Ionicons
            name={post.liked ? 'heart' : 'heart-outline'}
            size={22}
            color={post.liked ? theme.error : theme.ink}
          />
          <Text style={styles.actionCount}>{post.likes}</Text>
        </Pressable>
        <Pressable onPress={onComment} hitSlop={8} style={styles.actionLeft}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.ink} />
          <Text style={styles.actionCount}>{post.comments}</Text>
        </Pressable>
        <View style={styles.flexSpacer} />
        <Pressable hitSlop={8}>
          <Ionicons name="bookmark-outline" size={20} color={theme.ink} />
        </Pressable>
      </View>

      <Pressable onPress={onOpen} style={styles.captionWrap}>
        <Text style={styles.captionText} numberOfLines={3}>
          <Text style={styles.captionAuthor}>{post.chefName} </Text>
          {post.caption}
        </Text>
        {post.hashtags.length > 0 ? (
          <Text style={styles.hashtags}>
            {post.hashtags.map((t) => `#${t}`).join(' ')}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

export default PostCard;
