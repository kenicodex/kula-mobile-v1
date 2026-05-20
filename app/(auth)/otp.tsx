import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth.store';
import api from '@/services/api';
import { authService, apiErrorMessage } from '@/services';
import { makeStyles } from './otp.styles';

const OTP_LENGTH = 6;
const RESEND_TIMER = 60;

// ─── API ──────────────────────────────────────────────────────────────────────
// /auth/verify-otp returns { verified: true } only. The user is already
// authenticated from /auth/register; we refresh the profile after verifying.
// NOTE: /auth/resend-otp is not implemented on the backend yet — the call will
// 404 until the endpoint is added.

async function verifyOtpRequest(code: string, email: string) {
  return authService.verifyOtp({ code, email });
}

async function resendOtp(email: string): Promise<void> {
  await api.post('/auth/resend-otp', { email });
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OtpScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { user, setAuth, token } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Verify mutation
  const { mutate: verify, isPending: verifying } = useMutation({
    mutationFn: () => verifyOtpRequest(digits.join(''), email ?? ''),
    onSuccess: async () => {
      // Refresh user to pick up the new isVerified flag, then route by role.
      try {
        const refreshed = await authService.me();
        if (token) await setAuth(refreshed, token);
      } catch {
        // proceed even if refresh fails
      }
      const role = user?.role;
      if (role === 'client') {
        router.replace('/(auth)/profile/step1');
      } else if (role === 'chef') {
        router.replace('/(tabs)');
      } else {
        router.replace('/(tabs)');
      }
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Invalid code. Please try again.'),
        type: 'danger',
      });
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    },
  });

  // Resend mutation
  const { mutate: resend, isPending: resending } = useMutation({
    mutationFn: () => resendOtp(email ?? ''),
    onSuccess: () => {
      showMessage({ message: 'A new code has been sent.', type: 'success' });
      setCountdown(RESEND_TIMER);
      setCanResend(false);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not resend code.'),
        type: 'danger',
      });
    },
  });

  // Input handlers
  const handleChange = (text: string, index: number) => {
    const char = text.slice(-1); // only last character
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const codeComplete = digits.every((d) => d !== '');

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBubble}>
            <Ionicons name="lock-closed-outline" size={28} color={theme.primary} />
          </View>
          <Text style={styles.title}>
            Verify your {email ? 'email' : 'number'}
          </Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.subtitleEmphasis}>
              {email ?? 'your address'}
            </Text>
          </Text>
        </View>

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              maxLength={1}
              keyboardType="number-pad"
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : styles.otpInputEmpty,
              ]}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Resend */}
        <View style={styles.resendRow}>
          {canResend ? (
            <Pressable onPress={() => resend()} disabled={resending}>
              <Text style={styles.resendActive}>
                {resending ? 'Sending...' : 'Resend Code'}
              </Text>
            </Pressable>
          ) : (
            <Text style={styles.resendInactive}>
              Resend code in{' '}
              <Text style={styles.resendCount}>{countdown}s</Text>
            </Text>
          )}
        </View>

        {/* Verify button */}
        <Button
          label="Verify"
          size="lg"
          disabled={!codeComplete}
          loading={verifying}
          onPress={() => verify()}
        />
      </View>
    </ScreenWrapper>
  );
}
