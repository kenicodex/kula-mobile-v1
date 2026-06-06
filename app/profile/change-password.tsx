import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NavHeader } from '@/components/layout/NavHeader';
import { authService, apiErrorMessage } from '@/services';
import { useStyles } from '@/hooks/useStyles';
import { makeStyles } from './change-password.styles';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(8, 'Please confirm your new password'),
  })
  .refine((v) => v.newPassword === v.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordScreen() {
  const styles = useStyles(makeStyles);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirm: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ currentPassword, newPassword }: FormValues) =>
      authService.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      showMessage({ message: 'Password updated', type: 'success' });
      reset();
      router.back();
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not change password.'),
        type: 'danger',
      });
    },
  });

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader title="Change password" backVariant="circle" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.intro}>
            Pick a new password that's at least 8 characters and different from your current one.
          </Text>

          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Current password"
                placeholder="Enter current password"
                value={value}
                onChangeText={onChange}
                error={errors.currentPassword?.message}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange } }) => (
              <Input
                label="New password"
                placeholder="At least 8 characters"
                value={value}
                onChangeText={onChange}
                error={errors.newPassword?.message}
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
                placeholder="Re-enter new password"
                value={value}
                onChangeText={onChange}
                error={errors.confirm?.message}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          <Button
            label="Update password"
            size="lg"
            loading={isPending}
            onPress={handleSubmit((v) => mutate(v))}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
