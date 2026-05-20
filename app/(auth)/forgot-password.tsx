import React, { useState } from 'react';
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
import api from '@/services/api';
import { apiErrorMessage } from '@/services';
import { makeStyles } from './forgot-password.styles';

// ─── Validation ───────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

// ─── API call ─────────────────────────────────────────────────────────────────
// NOTE: The backend does not yet expose POST /auth/forgot-password. The request
// will surface as a 404 until the endpoint is added — wire it once available.

async function forgotPasswordRequest(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email }: FormValues) => forgotPasswordRequest(email),
    onSuccess: () => {
      setSentEmail(getValues('email'));
      setSent(true);
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Something went wrong. Please try again.'),
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
        {sent ? (
          /* ── Success state ──────────────────────────────── */
          <View style={styles.successWrap}>
            {/* Mail illustration placeholder */}
            <View style={styles.envelopeBubble}>
              <Text style={{ fontSize: 64 }}>✉️</Text>
            </View>

            <View style={styles.successTextWrap}>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successBody}>
                We've sent a password reset link to{'\n'}
                <Text style={styles.successEmphasis}>{sentEmail}</Text>
              </Text>
              <Text style={styles.successHint}>
                Didn't receive the email? Check your spam folder or try again.
              </Text>
            </View>

            <Button
              label="Back to Sign In"
              variant="outline"
              size="lg"
              style={styles.fullBtn}
              onPress={() => router.replace('/(auth)/login')}
            />

            <Button
              label="Try again"
              variant="ghost"
              size="md"
              onPress={() => setSent(false)}
            />
          </View>
        ) : (
          /* ── Form state ─────────────────────────────────── */
          <>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>Forgot password?</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
            </View>

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

            <Button
              label="Send Reset Link"
              size="lg"
              loading={isPending}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitBtn}
            />
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}
