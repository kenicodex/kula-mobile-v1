import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { feedService, apiErrorMessage } from '@/services';
import { uploadToStorage } from '@/services/uploads.service';
import { useAuthStore } from '@/store/auth.store';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './create.styles';

const TAGS = [
  '#NigerianFood',
  '#CreatorLife',
  '#FoodPhotography',
  '#WestAfrican',
  '#Catering',
  '#PartyFood',
  '#FoodContent',
  '#HomeCooking',
];

const MAX_ITEMS_POST = 10;
const MAX_ITEMS_REEL = 1;

type PostMode = 'post' | 'reel';
type MediaKind = 'image' | 'video';
type MediaStatus = 'uploading' | 'done' | 'error';

interface MediaItem {
  id: string;
  localUri: string;
  kind: MediaKind;
  remoteUrl?: string;
  status: MediaStatus;
  error?: string;
}

let _itemSeq = 0;
const nextId = () => `m_${Date.now()}_${++_itemSeq}`;

const inferKind = (asset: ImagePicker.ImagePickerAsset): MediaKind =>
  asset.type === 'video' ? 'video' : 'image';

export default function CreatePostScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const [mode, setMode] = useState<PostMode>('post');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const maxItems = mode === 'reel' ? MAX_ITEMS_REEL : MAX_ITEMS_POST;

  const switchMode = (next: PostMode) => {
    if (next === mode) return;
    if (next === 'reel' && items.length > 0) {
      const firstVideo = items.find((it) => it.kind === 'video');
      Alert.alert(
        'Switch to Reel?',
        firstVideo
          ? 'A reel uses a single video. Other items will be removed.'
          : 'A reel needs a video. Your photos will be removed — add a video next.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Switch',
            onPress: () => {
              setItems(firstVideo ? [firstVideo] : []);
              setMode('reel');
            },
          },
        ],
      );
      return;
    }
    setMode(next);
  };

  const toggle = (t: string) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  // Start (or retry) upload for a single item. Updates state in-place by id;
  // if the item has been removed by the time upload settles, the result is
  // discarded — that's our "cancel-in-progress" behavior.
  const runUpload = useCallback(
    async (item: MediaItem) => {
      try {
        const uploaded = await uploadToStorage(item.localUri, {
          folder: 'posts',
          resourceType: item.kind === 'video' ? 'video' : 'image',
        });
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, remoteUrl: uploaded.url, status: 'done' }
              : it,
          ),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'error', error: message } : it,
          ),
        );
      }
    },
    [],
  );

  const addAssets = useCallback(
    (assets: ImagePicker.ImagePickerAsset[]) => {
      if (!assets.length) return;
      const remaining = maxItems - items.length;
      let accepted = assets.slice(0, Math.max(0, remaining));
      if (mode === 'reel') {
        accepted = accepted.filter((a) => inferKind(a) === 'video').slice(0, 1);
      }
      if (accepted.length < assets.length) {
        showMessage({
          message:
            mode === 'reel'
              ? 'A reel uses a single video — extras ignored.'
              : `Only ${maxItems} items per post — extras ignored.`,
          type: 'warning',
        });
      }
      const newItems: MediaItem[] = accepted.map((a) => ({
        id: nextId(),
        localUri: a.uri,
        kind: inferKind(a),
        status: 'uploading',
      }));
      setItems((prev) => [...prev, ...newItems]);
      newItems.forEach((it) => {
        void runUpload(it);
      });
    },
    [items.length, maxItems, mode, runUpload],
  );

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library.',
      );
      return;
    }
    const remaining = maxItems - items.length;
    if (remaining <= 0) {
      showMessage({
        message:
          mode === 'reel'
            ? 'A reel uses a single video.'
            : `Maximum ${maxItems} items per post.`,
        type: 'warning',
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mode === 'reel' ? ['videos'] : ['images', 'videos'],
      allowsMultipleSelection: mode !== 'reel',
      selectionLimit: remaining,
      quality: 0.85,
    });
    if (result.canceled) return;
    addAssets(result.assets);
  };

  const captureFromCamera = async (kind: MediaKind) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow access to your camera.',
      );
      return;
    }
    if (items.length >= maxItems) {
      showMessage({
        message:
          mode === 'reel'
            ? 'A reel uses a single video.'
            : `Maximum ${maxItems} items per post.`,
        type: 'warning',
      });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: kind === 'video' ? ['videos'] : ['images'],
      allowsEditing: kind === 'image',
      aspect: kind === 'image' ? [1, 1] : undefined,
      quality: 0.85,
    });
    if (result.canceled) return;
    addAssets(result.assets);
  };

  const promptAddMedia = () => {
    const options =
      mode === 'reel'
        ? [
            { text: 'Video library', onPress: pickFromLibrary },
            { text: 'Record video', onPress: () => captureFromCamera('video') },
            { text: 'Cancel', style: 'cancel' as const },
          ]
        : [
            { text: 'Photo library', onPress: pickFromLibrary },
            { text: 'Take photo', onPress: () => captureFromCamera('image') },
            { text: 'Record video', onPress: () => captureFromCamera('video') },
            { text: 'Cancel', style: 'cancel' as const },
          ];
    Alert.alert(mode === 'reel' ? 'Add video' : 'Add media', undefined, options);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const retryItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (!target) return prev;
      void runUpload({ ...target, status: 'uploading' });
      return prev.map((it) =>
        it.id === id ? { ...it, status: 'uploading', error: undefined } : it,
      );
    });
  };

  const uploading = items.some((it) => it.status === 'uploading');
  const hasError = items.some((it) => it.status === 'error');
  const hasMedia = items.length > 0;
  const allDone = hasMedia && items.every((it) => it.status === 'done');
  const postType: 'photo' | 'video' =
    mode === 'reel' || items.some((it) => it.kind === 'video') ? 'video' : 'photo';

  const { mutate: publish, isPending: publishing } = useMutation({
    mutationFn: async () => {
      if (!allDone) throw new Error('Wait for uploads to finish.');
      return feedService.create({
        type: postType,
        mediaUrls: items.map((it) => it.remoteUrl!),
        caption: caption || undefined,
        hashtags: tags.map((t) => t.replace(/^#/, '')),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed', 'list'] });
      if (userId) qc.invalidateQueries({ queryKey: ['feed', 'user', userId] });
      showMessage({
        message: mode === 'reel' ? 'Reel published' : 'Post published',
        type: 'success',
      });
      router.replace('/(tabs)');
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(
          err,
          mode === 'reel' ? 'Could not publish reel.' : 'Could not publish post.',
        ),
        type: 'danger',
      });
    },
  });

  const canPublish = allDone && !uploading && !publishing;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
        >
          <Ionicons name="close" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>{mode === 'reel' ? 'New Reel' : 'New Post'}</Text>
        <Pressable
          onPress={() => publish()}
          disabled={!canPublish}
          style={[
            styles.publishButton,
            canPublish
              ? styles.publishButtonActive
              : styles.publishButtonInactive,
          ]}
        >
          <Text style={styles.publishLabel}>
            {publishing ? '...' : 'Publish'}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.modeRow}>
          {(['post', 'reel'] as const).map((m) => {
            const active = mode === m;
            return (
              <Pressable
                key={m}
                onPress={() => switchMode(m)}
                style={[styles.modeChip, active ? styles.modeChipActive : styles.modeChipInactive]}
              >
                <Ionicons
                  name={m === 'reel' ? 'film-outline' : 'images-outline'}
                  size={14}
                  color={active ? theme.white : theme.inkMuted}
                />
                <Text
                  style={[
                    styles.modeChipText,
                    active ? styles.modeChipTextActive : styles.modeChipTextInactive,
                  ]}
                >
                  {m === 'reel' ? 'Reel' : 'Post'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {hasMedia ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaScrollContent}
          >
            {items.map((it) => (
              <MediaThumb
                key={it.id}
                item={it}
                styles={styles}
                theme={theme}
                onRemove={() => removeItem(it.id)}
                onRetry={() => retryItem(it.id)}
              />
            ))}
            {items.length < maxItems ? (
              <Pressable style={styles.uploadTile} onPress={promptAddMedia}>
                <Ionicons name="add" size={28} color={theme.inkMuted} />
                <Text style={styles.uploadLabel}>Add</Text>
              </Pressable>
            ) : null}
          </ScrollView>
        ) : (
          <View style={styles.mediaWrap}>
            <Pressable style={styles.pickerTile} onPress={promptAddMedia}>
              <Ionicons name="add" size={32} color={theme.inkMuted} />
              <Text style={styles.uploadLabel}>
                {mode === 'reel' ? 'Add a video' : 'Add photo or video'}
              </Text>
            </Pressable>
          </View>
        )}

        {hasError ? (
          <View style={styles.body}>
            <Text style={[styles.tagsHelp, { color: theme.error }]}>
              Some uploads failed — tap the retry icon, or remove them to continue.
            </Text>
          </View>
        ) : null}

        <View style={styles.body}>
          <View style={styles.captionCard}>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Write a caption…"
              placeholderTextColor={theme.inkFaint}
              multiline
              textAlignVertical="top"
              style={styles.captionInput}
            />
          </View>

          <Text style={styles.tagsTitle}>Tags</Text>
          <Text style={styles.tagsHelp}>
            Add up to 5 hashtags to help people discover your post.
          </Text>
          <View style={styles.tagsRow}>
            {TAGS.map((t) => {
              const active = tags.includes(t);
              return (
                <Pressable
                  key={t}
                  onPress={() => toggle(t)}
                  style={[
                    styles.tagPill,
                    active ? styles.tagPillActive : styles.tagPillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      active ? styles.tagTextActive : styles.tagTextInactive,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MediaThumbProps {
  item: MediaItem;
  styles: ReturnType<typeof makeStyles>;
  theme: ReturnType<typeof useTheme>['theme'];
  onRemove: () => void;
  onRetry: () => void;
}

function MediaThumb({
  item,
  styles,
  theme,
  onRemove,
  onRetry,
}: MediaThumbProps) {
  const isVideo = item.kind === 'video';
  return (
    <View style={[styles.mediaTile, styles.mediaTileActive]}>
      {isVideo ? (
        <Ionicons name="videocam" size={32} color={theme.ink} />
      ) : (
        <Image source={{ uri: item.localUri }} style={styles.previewImage} />
      )}

      {item.status === 'uploading' ? (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator color={theme.white} />
        </View>
      ) : null}

      {item.status === 'error' ? (
        <Pressable
          onPress={onRetry}
          style={styles.uploadingOverlay}
          hitSlop={6}
        >
          <Ionicons name="refresh" size={28} color={theme.white} />
        </Pressable>
      ) : null}

      <Pressable onPress={onRemove} hitSlop={6} style={styles.mediaRemoveBtn}>
        <Ionicons name="close-circle" size={22} color={theme.white} />
      </Pressable>
    </View>
  );
}
