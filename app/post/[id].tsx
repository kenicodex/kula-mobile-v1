import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { feedService, apiErrorMessage } from '@/services';
import { asUser, idOf } from '@/services/adapters';
import { useAuthStore } from '@/store/auth.store';
import { fmtRelative } from '@/lib/format';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
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
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState('');

  const like = useMutation({
    mutationFn: () => (liked ? feedService.unlike(id) : feedService.like(id)),
    onMutate: () => setLiked((p) => !p),
    onError: () => setLiked((p) => !p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['post', id] }),
  });

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

  const author = asUser(post.authorId);
  const authorName = author?.name ?? 'Author';
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
            {post.mediaUrls?.[0] ? (
              <Image
                source={{ uri: post.mediaUrls[0] }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.mediaPlaceholder} />
            )}
            <Pressable
              onPress={() => router.back()}
              style={[styles.mediaButton, styles.mediaButtonLeft]}
            >
              <Ionicons name="chevron-back" size={22} color={theme.white} />
            </Pressable>
            <Pressable style={[styles.mediaButton, styles.mediaButtonRight]}>
              <Ionicons name="ellipsis-horizontal" size={20} color={theme.white} />
            </Pressable>
          </View>

          {/* Chef header */}
          <Pressable
            onPress={() => router.push(`/chefs/${idOf(post.authorId)}`)}
            style={styles.authorRow}
          >
            <Avatar uri={author?.avatar} name={authorName} size="sm" />
            <View style={styles.authorBody}>
              <View style={styles.authorTopRow}>
                <Text style={styles.authorName}>{authorName}</Text>
                <Ionicons
                  name="checkmark-circle"
                  size={13}
                  color={theme.primary}
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
            <Pressable onPress={() => like.mutate()} hitSlop={8} style={styles.actionLeft}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={24}
                color={liked ? theme.error : theme.ink}
              />
              <Text style={styles.actionCount}>{post.likeCount}</Text>
            </Pressable>
            <View style={styles.actionLeft}>
              <Ionicons name="chatbubble-outline" size={22} color={theme.ink} />
              <Text style={styles.actionCount}>{post.commentCount}</Text>
            </View>
            <View style={styles.flexSpacer} />
            <Pressable hitSlop={8} onPress={() => setBookmarked((p) => !p)}>
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={bookmarked ? theme.primary : theme.ink}
              />
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
                  const u = asUser(c.authorId);
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
              value={comment}
              onChangeText={setComment}
              placeholder="Add a comment…"
              placeholderTextColor={theme.inkFaint}
              style={styles.commentInput}
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
