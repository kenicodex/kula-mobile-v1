import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StepTopBar } from '@/components/auth/StepTopBar';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useStyles } from '@/hooks/useStyles';
import { authService, apiErrorMessage } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { makeStyles } from './step2.styles';

// ─── Data ─────────────────────────────────────────────────────────────────────

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
];

const ALLERGY_OPTIONS = [
  'Peanuts',
  'Tree Nuts',
  'Milk',
  'Eggs',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileStep2Screen() {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { updateUser } = useAuthStore();
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item],
    );
  };

  const toggleAllergy = (item: string) => {
    setAllergies((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      authService.updateMe({
        dietaryRestrictions: dietary,
        allergies,
      }),
    onSuccess: (u) => {
      updateUser({
        dietaryRestrictions: u.dietaryRestrictions ?? dietary,
        allergies: u.allergies ?? allergies,
      });
      router.replace('/(tabs)');
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not save preferences.'),
        type: 'danger',
      });
    },
  });

  const handleFinish = () => mutate();

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
      <StepTopBar
        totalSteps={2}
        currentStep={2}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Food preferences</Text>
          <Text style={styles.subtitle}>
            Help creators tailor meals to your needs. You can update this anytime.
          </Text>
        </View>

        {/* Dietary restrictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary restrictions</Text>
          <View style={styles.chipsRow}>
            {DIETARY_OPTIONS.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={dietary.includes(item)}
                onPress={() => toggleDietary(item)}
              />
            ))}
          </View>
        </View>

        {/* Allergies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food allergies</Text>
          <View style={styles.chipsRow}>
            {ALLERGY_OPTIONS.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={allergies.includes(item)}
                onPress={() => toggleAllergy(item)}
              />
            ))}
          </View>
        </View>

        {/* Skip note */}
        <Text style={styles.skipNote}>
          You can skip this step and update preferences later in your profile.
        </Text>

        {/* CTA */}
        <Button
          label="Finish Setup"
          size="lg"
          loading={isPending}
          onPress={handleFinish}
        />
      </View>
    </ScreenWrapper>
  );
}
