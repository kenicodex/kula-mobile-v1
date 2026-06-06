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
import { useAuthStore } from '@/store/auth.store';
import { authService, apiErrorMessage } from '@/services';
import type { User } from '@/types';
import { makeStyles } from './login.styles';

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

// Backend returns only a minimal user; hydrate the full profile from /users/me.
async function loginAndHydrate(
  data: FormValues,
): Promise<{ user: User; token: string }> {
  const auth = await authService.login(data);
  let full: User;
  try {
    full = await authService.me();
  } catch {
    full = {
      id: auth.user.id,
      name: auth.user.name,
      email: auth.user.email,
      phone: '',
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

export default function LoginScreen() {
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
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginAndHydrate,
    onSuccess: async ({ user, token }) => {
      await setAuth(user, token);
      router.replace('/(tabs)');
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Login failed. Please try again.'),
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
        {/* Logo */}
        <View style={styles.logoBlock}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your Kula account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Email address"
                placeholder="you@example.com"
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
            name="password"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Password"
                placeholder="Your password"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />
        </View>

        {/* Forgot password */}
        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
          style={styles.forgotLink}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        {/* Sign in button */}
        <Button
          label="Sign In"
          size="lg"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google button */}
        <Button
          label="Continue with Google"
          variant="outline"
          size="lg"
          icon={<Text style={{ fontSize: 18 }}>G</Text>}
          onPress={() => {
            showMessage({ message: 'Google sign-in coming soon', type: 'info' });
          }}
        />

        {/* Sign up link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.footerLink}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}
