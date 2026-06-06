import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Avatar } from '@/components/ui/Avatar';
import { SignedImage } from '@/components/ui/SignedImage';
import { FeedVideo } from '@/components/feed/FeedVideo';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { feedService, savedService, apiErrorMessage } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { fmtRelative } from '@/lib/format';
import { sharePost } from '@/lib/sharePost';
import { LIKE_RED } from '@/constants/colors';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import type { Post } from '@/types';
import { makeStyles } from './[id].styles';

export default function PostDetailScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuthStore();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => feedService.get(id),
    enabled: !!id,
  });

  const { data: comments } = useQuery({
    queryKey: ['post', id, 'comments'],
    queryFn: () => feedService.comments(id, { limit: 50 }),
    enabled: !!id,
  });

  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const commentInputRef = useRef<TextInput>(null);

  const postKey = ['post', id] as const;

  const savedPostsQuery = useQuery({
    queryKey: ['saved', 'posts'],
    queryFn: () => savedService.listPosts(),
  });

  const isSaved = useMemo(
    () => (savedPostsQuery.data ?? []).some((p) => p.id === id),
    [savedPostsQuery.data, id],
  );

  const toggleSave = useMutation({
    mutationFn: () => (isSaved ? savedService.unsavePost(id) : savedService.savePost(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved', 'posts'] }),
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not update saved list.'),
        type: 'danger',
      });
    },
  });

  const like = useMutation({
    // Pass `nextLiked` explicitly so the request can't race with state updates.
    mutationFn: (nextLiked: boolean) =>
      nextLiked ? feedService.like(id) : feedService.unlike(id),
    onSuccess: (res, nextLiked) => {
      setLiked(nextLiked);
      const current = qc.getQueryData<Post>(postKey);
      if (current && typeof (res as { likeCount?: number })?.likeCount === 'number') {
        qc.setQueryData<Post>(postKey, {
          ...current,
          likeCount: (res as { likeCount: number }).likeCount,
        });
      } else {
        qc.invalidateQueries({ queryKey: postKey });
      }
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not update like.'),
        type: 'danger',
      });
    },
  });

  const toggleLike = () => {
    if (like.isPending) return;
    like.mutate(!liked);
  };

  const addComment = useMutation({
    mutationFn: (text: string) => feedService.comment(id, text),
    onSuccess: () => {
      setComment('');
      qc.invalidateQueries({ queryKey: ['post', id, 'comments'] });
      qc.invalidateQueries({ queryKey: ['post', id] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not post comment.'),
        type: 'danger',
      });
    },
  });

  const focusCommentInput = () => commentInputRef.current?.focus();

  const onShare = () => {
    if (!post) return;
    return sharePost({
      id: post.id,
      authorName,
      caption: post.caption,
      mediaUrl: post.mediaUrls?.[0] ?? null,
    });
  };

  if (isLoading || !post) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const author = post.author ?? null;
  const authorName = author?.name ?? 'Author';
  const authorId = author?.id ?? (typeof post.authorId === 'string' ? post.authorId : '');
  const cuisine = '';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Media */}
          <View>
            {post.type === 'video' && post.mediaUrls?.[0] ? (
              <FeedVideo uri={post.mediaUrls[0]} style={styles.mediaImage} />
            ) : (
              <SignedImage
                uri={post.mediaUrls?.[0]}
                style={styles.mediaImage}
                fallbackStyle={styles.mediaPlaceholder}
              />
            )}
            <Pressable
              onPress={() => router.back()}
              style={[styles.mediaButton, styles.mediaButtonLeft]}
            >
              <Ionicons name="chevron-back" size={22} color={theme.white} />
            </Pressable>
            <Pressable
              onPress={() => toggleSave.mutate()}
              disabled={toggleSave.isPending}
              style={[styles.mediaButton, styles.mediaButtonRight]}
            >
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={theme.white}
              />
            </Pressable>
          </View>

          {/* Creator header */}
          <Pressable
            onPress={() => authorId && router.push(`/creators/${authorId}`)}
            style={styles.authorRow}
          >
            <Avatar uri={author?.avatar} name={authorName} size="sm" />
            <View style={styles.authorBody}>
              <View style={styles.authorTopRow}>
                <Text style={styles.authorName}>{authorName}</Text>
                <VerifiedBadge
                  role={author?.role}
                  size={13}
                  style={styles.authorBadgeSpacer}
                />
              </View>
              <Text style={styles.authorMeta}>
                {cuisine ? `${cuisine} · ` : ''}{fmtRelative(post.createdAt)}
              </Text>
            </View>
          </Pressable>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={toggleLike}
              disabled={like.isPending}
              hitSlop={8}
              style={styles.actionItem}
            >
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={22}
                color={liked ? LIKE_RED : theme.ink}
              />
              <Text style={[styles.actionLabel, liked && { color: LIKE_RED }]}>
                {post.likeCount}
              </Text>
            </Pressable>
            <View style={styles.actionDivider} />
            <Pressable onPress={focusCommentInput} hitSlop={8} style={styles.actionItem}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.ink} />
              <Text style={styles.actionLabel}>{post.commentCount}</Text>
            </Pressable>
            <View style={styles.actionDivider} />
            <Pressable onPress={onShare} hitSlop={8} style={styles.actionItem}>
              <Ionicons name="paper-plane-outline" size={20} color={theme.ink} />
              <Text style={styles.actionLabel}>Share</Text>
            </Pressable>
          </View>

          {/* Caption */}
          {(post.caption || (post.hashtags ?? []).length > 0) && (
            <View style={styles.captionWrap}>
              {post.caption && (
                <Text style={styles.captionText}>
                  <Text style={styles.captionAuthor}>{authorName} </Text>
                  {post.caption}
                </Text>
              )}
              <View style={styles.hashtagsRow}>
                {(post.hashtags ?? []).map((t) => (
                  <Pressable key={t} onPress={() => router.push(`/hashtag/${t}`)}>
                    <Text style={styles.hashtag}>#{t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Comments */}
          <View style={styles.commentsWrap}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <View style={styles.commentsList}>
              {(comments ?? []).length === 0 ? (
                <Text style={styles.commentsEmpty}>Be the first to comment.</Text>
              ) : (
                (comments ?? []).map((c) => {
                  const u = c.author ?? null;
                  return (
                    <View key={c.id} style={styles.commentRow}>
                      <Avatar uri={u?.avatar} name={u?.name ?? 'User'} size="sm" />
                      <View style={styles.commentBody}>
                        <Text style={styles.commentText}>
                          <Text style={styles.commentAuthor}>
                            {u?.name ?? 'User'}{' '}
                          </Text>
                          {c.text}
                        </Text>
                        <View style={styles.commentMetaRow}>
                          <Text style={styles.commentMeta}>{fmtRelative(c.createdAt)}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>

        {/* Comment input */}
        <View style={styles.commentBar}>
          <Avatar uri={user?.avatar} name={user?.name ?? 'You'} size="sm" />
          <View style={styles.commentInputWrap}>
            <TextInput
              ref={commentInputRef}
              value={comment}
              onChangeText={setComment}
              placeholder="Add a comment…"
              placeholderTextColor={theme.inkFaint}
              style={styles.commentInput}
              returnKeyType="send"
              onSubmitEditing={() => {
                const text = comment.trim();
                if (text && !addComment.isPending) addComment.mutate(text);
              }}
            />
          </View>
          <Pressable
            disabled={!comment.trim() || addComment.isPending}
            onPress={() => addComment.mutate(comment.trim())}
            hitSlop={8}
          >
            <Text
              style={[
                styles.postLabel,
                comment.trim() ? styles.postLabelActive : styles.postLabelInactive,
              ]}
            >
              Post
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
