import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { authService, apiErrorMessage } from '@/services';
import type { User } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { makeStyles } from './sign-up.styles';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

// ─── API ──────────────────────────────────────────────────────────────────────

async function creatorSignUpAndHydrate(
  data: Omit<FormValues, 'confirmPassword'>,
): Promise<{ user: User; token: string }> {
  const auth = await authService.register({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    role: 'creator',
  });
  let full: User;
  try {
    full = await authService.me();
  } catch {
    full = {
      id: auth.user.id,
      name: auth.user.name,
      email: auth.user.email,
      phone: data.phone ?? '',
      role: auth.user.role,
      isVerified: false,
      dietaryRestrictions: [],
      allergies: [],
      addressBook: [],
    };
  }
  return { user: full, token: auth.accessToken };
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreatorSignUpScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name, email, phone, password }: FormValues) =>
      creatorSignUpAndHydrate({ name, email, phone, password }),
    onSuccess: async ({ user, token }) => {
      await setAuth(user, token);
      router.replace('/(tabs)');
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Registration failed. Try again.'),
        type: 'danger',
      });
    },
  });

  const onSubmit = (values: FormValues) => mutate(values);

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
      {/* Back */}
      <View style={styles.backRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color={theme.ink} />
        </Pressable>
      </View>

      <View style={styles.body}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <View style={styles.iconBubble}>
            <Text style={{ fontSize: 28 }}>👨‍🍳</Text>
          </View>
          <Text style={styles.title}>Create creator account</Text>
          <Text style={styles.subtitle}>
            Start your journey as a professional creator on Kula.
          </Text>
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
              autoComplete="name"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Email address"
              placeholder="creator@example.com"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Phone number (optional)"
              placeholder="+234 800 000 0000"
              value={value ?? ''}
              onChangeText={onChange}
              error={errors.phone?.message}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Password"
              placeholder="Min. 8 characters"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Confirm password"
              placeholder="Repeat your password"
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
              secureTextEntry
            />
          )}
        />

        {/* CTA */}
        <Button
          label="Continue"
          size="lg"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
          style={styles.submitBtn}
        />

        {/* Sign in link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}
