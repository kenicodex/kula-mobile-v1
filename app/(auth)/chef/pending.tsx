import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth.store';
import { makeStyles } from './pending.styles';

export default function ChefPendingScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleBackToHome = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScreenWrapper statusBarStyle="dark">
      <View style={styles.container}>
        {/* Illustration placeholder */}
        <View style={styles.illustration}>
          <Ionicons name="time-outline" size={72} color={theme.primary} />
        </View>

        {/* Text */}
        <Text style={styles.title}>Application Under Review</Text>
        <Text style={styles.body}>
          Our team will verify your credentials within{' '}
          <Text style={styles.bodyEmphasis}>24–48 hours.</Text>
        </Text>
        <Text style={styles.bodyLast}>
          We'll send you a notification once your profile has been approved and you're ready to start accepting bookings.
        </Text>

        {/* Steps */}
        <View style={styles.stepsCard}>
          {[
            { icon: 'checkmark-circle-outline', label: 'Application submitted', done: true },
            { icon: 'document-text-outline', label: 'Credential verification', done: false },
            { icon: 'person-circle-outline', label: 'Profile review', done: false },
            { icon: 'rocket-outline', label: 'Go live on Kula', done: false },
          ].map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <Ionicons
                name={step.icon as any}
                size={22}
                color={step.done ? theme.primary : theme.inkFaint}
              />
              <Text style={step.done ? styles.stepLabelDone : styles.stepLabel}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <Button
          label="Back to Home"
          variant="outline"
          size="lg"
          style={styles.fullBtn}
          onPress={handleBackToHome}
        />
      </View>
    </ScreenWrapper>
  );
}
