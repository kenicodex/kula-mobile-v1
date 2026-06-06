import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Input } from '@/components/ui/Input';
import { NavHeader } from '@/components/layout/NavHeader';
import { useAuthStore } from '@/store/auth.store';
import { authService, apiErrorMessage, uploadToStorage } from '@/services';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './edit.styles';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  city: z.string().optional(),
  street: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  // Address type doesn't declare isDefault but backend returns it; widen for read.
  const defaultAddress =
    user?.addressBook?.find(
      (a) => (a as typeof a & { isDefault?: boolean }).isDefault,
    ) ?? user?.addressBook?.[0];

  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar ?? null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.avatar ?? null);
  const [uploading, setUploading] = useState(false);

  const [coverUrl, setCoverUrl] = useState<string | null>(user?.coverImageUrl ?? null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    user?.coverImageUrl ?? null,
  );
  const [uploadingCover, setUploadingCover] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      city: defaultAddress?.city ?? '',
      street: defaultAddress?.street ?? '',
    },
  });

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || result.assets.length === 0) return;
    const localUri = result.assets[0].uri;
    setPhotoPreview(localUri);
    setUploading(true);
    try {
      const uploaded = await uploadToStorage(localUri, {
        folder: 'avatars',
        resourceType: 'image',
      });
      setAvatarUrl(uploaded.url);
      setPhotoPreview(uploaded.url);
    } catch (err) {
      setPhotoPreview(user?.avatar ?? null);
      showMessage({
        message: apiErrorMessage(err, 'Could not upload photo. Try again.'),
        type: 'danger',
      });
    } finally {
      setUploading(false);
    }
  };

  const pickCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (result.canceled || result.assets.length === 0) return;
    const localUri = result.assets[0].uri;
    setCoverPreview(localUri);
    setUploadingCover(true);
    try {
      const uploaded = await uploadToStorage(localUri, {
        folder: 'creators',
        resourceType: 'image',
      });
      setCoverUrl(uploaded.url);
      setCoverPreview(uploaded.url);
    } catch (err) {
      console.log({err})
      setCoverPreview(user?.coverImageUrl ?? null);
      showMessage({
        message: apiErrorMessage(err, 'Could not upload cover image. Try again.'),
        type: 'danger',
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const save = useMutation({
    mutationFn: async (values: FormValues) => {
      const updates: Record<string, unknown> = {
        name: values.name,
        phone: values.phone,
      };
      if (avatarUrl && avatarUrl !== user?.avatar) updates.avatar = avatarUrl;
      if (coverUrl && coverUrl !== user?.coverImageUrl)
        updates.coverImageUrl = coverUrl;
      if (values.city || values.street) {
        updates.addressBook = [
          {
            label: 'Default',
            address: values.street || values.city || '',
            city: values.city ?? '',
            country: defaultAddress?.country ?? 'NG',
            isDefault: true,
          },
        ];
      }
      return authService.updateMe(updates as never);
    },
    onSuccess: (u) => {
      updateUser({
        name: u.name,
        phone: u.phone,
        avatar: u.avatar,
        coverImageUrl: u.coverImageUrl,
        addressBook: u.addressBook,
      });
      showMessage({ message: 'Profile updated', type: 'success' });
      router.back();
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not save profile.'),
        type: 'danger',
      });
    },
  });

  const canSave =
    !uploading &&
    !uploadingCover &&
    !save.isPending &&
    (isDirty ||
      avatarUrl !== user?.avatar ||
      coverUrl !== (user?.coverImageUrl ?? null));

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader
        title="Edit profile"
        backVariant="circle"
        right={
          <Pressable
            onPress={handleSubmit((v) => save.mutate(v))}
            disabled={!canSave}
            hitSlop={10}
            style={styles.saveBtn}
          >
            <Text style={[styles.saveLabel, canSave ? styles.saveLabelActive : styles.saveLabelInactive]}>
              {save.isPending ? '…' : 'Save'}
            </Text>
          </Pressable>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Pressable
            onPress={pickCover}
            disabled={uploadingCover}
            style={styles.coverWrap}
          >
            {coverPreview ? (
              <Image
                source={{ uri: coverPreview }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="image-outline" size={24} color={theme.primary} />
                <Text style={styles.coverPlaceholderText}>Add cover image</Text>
              </View>
            )}
            {uploadingCover ? (
              <View style={styles.coverOverlay}>
                <ActivityIndicator color={theme.white} />
              </View>
            ) : (
              <View style={styles.coverEditBadge}>
                <Ionicons name="camera" size={14} color={theme.white} />
              </View>
            )}
          </Pressable>

          <View style={styles.avatarSection}>
            <Pressable onPress={pickPhoto} disabled={uploading} style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                {photoPreview ? (
                  <Image source={{ uri: photoPreview }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarInitial}>
                    {user?.name?.charAt(0).toUpperCase() ?? '?'}
                  </Text>
                )}
                {uploading ? (
                  <View style={styles.avatarOverlay}>
                    <ActivityIndicator color={theme.white} />
                  </View>
                ) : null}
              </View>
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color={theme.white} />
              </View>
            </Pressable>
            <Pressable onPress={pickPhoto} disabled={uploading}>
              <Text style={styles.uploadText}>
                {uploading ? 'Uploading…' : photoPreview ? 'Change photo' : 'Add photo'}
              </Text>
            </Pressable>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Full name"
                placeholder="Your full name"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Phone"
                placeholder="+234…"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
            )}
          />

          <Text style={styles.sectionLabel}>Default address</Text>

          <Controller
            control={control}
            name="street"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Street / area"
                placeholder="e.g. 12 Marina Road"
                value={value ?? ''}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <Input
                label="City"
                placeholder="e.g. Lagos"
                value={value ?? ''}
                onChangeText={onChange}
              />
            )}
          />

          <Pressable
            onPress={() => router.push('/profile/change-password')}
            style={styles.linkRow}
          >
            <Ionicons name="lock-closed-outline" size={18} color={theme.inkLight} />
            <Text style={styles.linkText}>Change password</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.inkFaint} />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
