import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StepTopBar } from '@/components/auth/StepTopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import {
  apiErrorMessage,
  authService,
  uploadToStorage,
} from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { useCreatorOnboardStore } from '@/store/creator-onboard.store';
import { makeStyles } from './step1.styles';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  bio: z
    .string()
    .min(20, 'Bio must be at least 20 characters')
    .max(500, 'Bio must be under 500 characters'),
  city: z.string().min(2, 'City is required'),
});

type FormValues = z.infer<typeof schema>;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreatorOnboardStep1() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { avatarUrl, bio, city, setAvatar, setStep1 } = useCreatorOnboardStore();
  const [photoUri, setPhotoUri] = useState<string | null>(
    avatarUrl ?? user?.avatar ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      bio,
      city,
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
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;

    const localUri = result.assets[0].uri;
    setPhotoUri(localUri); // optimistic preview
    setUploading(true);
    try {
      const uploaded = await uploadToStorage(localUri, {
        folder: 'avatars',
        resourceType: 'image',
      });
      setPhotoUri(uploaded.url);
      setAvatar(uploaded.url);
      // Persist on the user record so the avatar shows everywhere immediately.
      try {
        const updated = await authService.updateMe({ avatar: uploaded.url });
        updateUser({ avatar: updated.avatar ?? uploaded.url });
      } catch {
        // Non-fatal — the URL is still in the onboard store and will be used
        // when the creator profile is finalised.
        updateUser({ avatar: uploaded.url });
      }
    } catch (err) {
      console.log(err)
      setPhotoUri(null);
      showMessage({
        message: apiErrorMessage(err, 'Could not upload photo. Try again.'),
        type: 'danger',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setStep1({ bio: values.bio, city: values.city });

    // Push the (possibly edited) name onto the user record. We tolerate failure
    // here — the rest of the flow can still proceed and the name will be
    // resubmitted with the creator profile create.
    if (values.name && values.name !== user?.name) {
      setSubmitting(true);
      try {
        const updated = await authService.updateMe({ name: values.name });
        updateUser({ name: updated.name ?? values.name });
      } catch {
        updateUser({ name: values.name });
      } finally {
        setSubmitting(false);
      }
    }

    router.push('/(auth)/creator/onboard/step2');
  };

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
      <StepTopBar
        totalSteps={5}
        currentStep={1}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>
            Clients will see this on your profile.
          </Text>
        </View>

        {/* Photo picker */}
        <View style={styles.avatarSection}>
          <Pressable
            onPress={pickPhoto}
            disabled={uploading}
            style={styles.avatarWrap}
          >
            <View style={styles.avatarCircle}>
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person-outline" size={36} color={theme.primary} />
              )}
              {uploading && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    borderRadius: 9999,
                  }}
                >
                  <ActivityIndicator color={theme.white} />
                </View>
              )}
            </View>
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color={theme.white} />
            </View>
          </Pressable>
          <Pressable
            onPress={pickPhoto}
            disabled={uploading}
            style={styles.uploadLink}
          >
            <Text style={styles.uploadText}>
              {uploading
                ? 'Uploading…'
                : photoUri
                ? 'Change photo'
                : 'Upload profile photo'}
            </Text>
          </Pressable>
        </View>

        {/* Form */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Full name"
              placeholder="Your professional name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="bio"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Short bio"
              placeholder="Tell clients about your culinary background, style, and experience..."
              value={value}
              onChangeText={onChange}
              error={errors.bio?.message}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { value, onChange } }) => (
            <Input
              label="City / Location"
              placeholder="e.g. Lagos, Abuja"
              value={value}
              onChangeText={onChange}
              error={errors.city?.message}
              leftIcon={<Ionicons name="location-outline" size={18} color={theme.inkMuted} />}
            />
          )}
        />

        <View style={styles.ctaWrap}>
          <Button
            label="Continue"
            size="lg"
            loading={submitting}
            disabled={uploading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
