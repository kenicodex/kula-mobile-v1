import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StepTopBar } from '@/components/auth/StepTopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth.store';
import { authService, apiErrorMessage, uploadToStorage } from '@/services';
import { makeStyles } from './step1.styles';

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  city: z.string().min(2, 'Please enter your city or area'),
});

type FormValues = z.infer<typeof schema>;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileStep1Screen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [photoUri, setPhotoUri] = useState<string | null>(user?.avatar ?? null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar ?? null);
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      city: '',
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
      setAvatarUrl(uploaded.url);
    } catch (err) {
      setPhotoUri(null);
      showMessage({
        message: apiErrorMessage(err, 'Could not upload photo. Try again.'),
        type: 'danger',
      });
    } finally {
      setUploading(false);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ name, city }: FormValues) => {
      // Backend UserAddress uses `address` (not `street`) and accepts optional
      // state/postalCode/country. We stash the city in both the address and
      // city fields so the user has a default address record.
      return authService.updateMe({
        name,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
        addressBook: [
          {
            label: 'Default',
            address: city,
            city,
            country: 'NG',
            isDefault: true,
          },
        ],
      } as never);
    },
    onSuccess: (u) => {
      updateUser({
        name: u.name,
        avatar: u.avatar,
        addressBook: u.addressBook,
      });
      router.push('/(auth)/profile/step2');
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not save profile.'),
        type: 'danger',
      });
    },
  });

  const onSubmit = (values: FormValues) => mutate(values);

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
      <StepTopBar
        totalSteps={2}
        currentStep={1}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Set up your profile</Text>
          <Text style={styles.subtitle}>
            Let's personalise your experience on Kula.
          </Text>
        </View>

        {/* Avatar picker */}
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
                <Text style={{ fontSize: 36 }}>
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </Text>
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
            {/* Camera badge */}
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
              {uploading ? 'Uploading…' : photoUri ? 'Change photo' : 'Upload photo'}
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
          name="city"
          render={({ field: { value, onChange } }) => (
            <Input
              label="City / Area"
              placeholder="e.g. Lagos, Victoria Island"
              value={value}
              onChangeText={onChange}
              error={errors.city?.message}
              leftIcon={<Ionicons name="location-outline" size={18} color={theme.inkMuted} />}
            />
          )}
        />

        {/* Continue */}
        <View style={styles.ctaWrap}>
          <Button
            label="Continue"
            size="lg"
            loading={isPending}
            disabled={uploading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
