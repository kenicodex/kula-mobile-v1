import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { makeStyles } from './forgot-password.styles';

const schema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(8, 'Please confirm your password'),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const [done, setDone] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: typeof params.token === 'string' ? params.token : '',
      password: '',
      confirm: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ token, password }: FormValues) =>
      authService.resetPassword(token, password),
    onSuccess: () => setDone(true),
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not reset password. Try again.'),
        type: 'danger',
      });
    },
  });

  const onSubmit = (values: FormValues) => mutate(values);

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
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
        {done ? (
          <View style={styles.successWrap}>
            <View style={styles.envelopeBubble}>
              <Text style={{ fontSize: 64 }}>✅</Text>
            </View>
            <View style={styles.successTextWrap}>
              <Text style={styles.successTitle}>Password updated</Text>
              <Text style={styles.successBody}>
                You can now sign in with your new password.
              </Text>
            </View>
            <Button
              label="Back to Sign In"
              size="lg"
              style={styles.fullBtn}
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        ) : (
          <>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>Set a new password</Text>
              <Text style={styles.subtitle}>
                {params.email
                  ? `Resetting password for ${params.email}.`
                  : 'Paste the reset token from your email and choose a new password.'}
              </Text>
            </View>

            <Controller
              control={control}
              name="token"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Reset token"
                  placeholder="From your email"
                  value={value}
                  onChangeText={onChange}
                  error={errors.token?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="New password"
                  placeholder="At least 8 characters"
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  secureTextEntry
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="confirm"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Confirm new password"
                  placeholder="Re-enter password"
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirm?.message}
                  secureTextEntry
                  autoCapitalize="none"
                />
              )}
            />

            <Button
              label="Reset password"
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
