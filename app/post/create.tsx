import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { feedService, apiErrorMessage } from '@/services';
import { uploadToCloudinary } from '@/services/uploads.service';
import { useAuthStore } from '@/store/auth.store';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './create.styles';

const TAGS = [
  '#NigerianFood',
  '#ChefLife',
  '#FoodPhotography',
  '#WestAfrican',
  '#Catering',
  '#PartyFood',
  '#FoodContent',
  '#HomeCooking',
];

export default function CreatePostScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const toggle = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || result.assets.length === 0) return;

    const localUri = result.assets[0].uri;
    setPreviewUri(localUri);
    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(localUri, {
        folder: 'kula/posts',
        resourceType: 'image',
      });
      setMediaUrl(uploaded.url);
      setPreviewUri(uploaded.url);
    } catch (err) {
      setPreviewUri(null);
      showMessage({
        message: err instanceof Error ? err.message : 'Upload failed',
        type: 'danger',
      });
    } finally {
      setUploading(false);
    }
  };

  const clearMedia = () => {
    setPreviewUri(null);
    setMediaUrl(null);
  };

  const { mutate: publish, isPending: publishing } = useMutation({
    mutationFn: async () => {
      if (!mediaUrl) throw new Error('Add a photo before publishing.');
      return feedService.create({
        type: 'photo',
        mediaUrls: [mediaUrl],
        caption: caption || undefined,
        hashtags: tags.map((t) => t.replace(/^#/, '')),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed', 'list'] });
      if (userId) qc.invalidateQueries({ queryKey: ['feed', 'user', userId] });
      showMessage({ message: 'Post published', type: 'success' });
      router.replace('/(tabs)');
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not publish post.'),
        type: 'danger',
      });
    },
  });

  const canPublish = !!mediaUrl && !uploading && !publishing;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="close" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <Pressable
          onPress={() => publish()}
          disabled={!canPublish}
          style={[
            styles.publishButton,
            canPublish ? styles.publishButtonActive : styles.publishButtonInactive,
          ]}
        >
          <Text style={styles.publishLabel}>{publishing ? '...' : 'Publish'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mediaWrap}>
          {previewUri ? (
            <View style={styles.previewTile}>
              <Image source={{ uri: previewUri }} style={styles.previewImage} />
              {uploading ? (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color={theme.white} />
                </View>
              ) : (
                <Pressable onPress={clearMedia} hitSlop={6} style={styles.mediaRemoveBtn}>
                  <Ionicons name="close-circle" size={22} color={theme.white} />
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable style={styles.pickerTile} onPress={pickMedia}>
              <Ionicons name="add" size={32} color={theme.inkMuted} />
              <Text style={styles.uploadLabel}>Add photo</Text>
            </Pressable>
          )}
        </View>

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
