import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StepTopBar } from '@/components/auth/StepTopBar';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useStyles } from '@/hooks/useStyles';
import { useCreatorOnboardStore } from '@/store/creator-onboard.store';
import { makeStyles } from './step2.styles';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CUISINE_TYPES = [
  'Nigerian',
  'Italian',
  'Asian Fusion',
  'Continental',
  'French',
  'Mexican',
  'Mediterranean',
  'Indian',
  'American',
  'Chinese',
];

const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Pastry',
  'Vegan',
  'Keto',
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreatorOnboardStep2() {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { cuisineTypes, mealCategories, setStep2 } = useCreatorOnboardStore();
  const [cuisines, setCuisines] = useState<string[]>(cuisineTypes);
  const [meals, setMeals] = useState<string[]>(mealCategories);

  const toggleCuisine = (item: string) => {
    setCuisines((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item],
    );
  };

  const toggleMeal = (item: string) => {
    setMeals((prev) =>
      prev.includes(item) ? prev.filter((m) => m !== item) : [...prev, item],
    );
  };

  const canContinue = cuisines.length > 0 && meals.length > 0;

  const handleContinue = () => {
    setStep2({ cuisineTypes: cuisines, mealCategories: meals });
    router.push('/(auth)/creator/onboard/step3');
  };

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
      <StepTopBar
        totalSteps={5}
        currentStep={2}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>What's your specialty?</Text>
          <Text style={styles.subtitle}>
            Select all that apply. This helps us match you with the right clients.
          </Text>
        </View>

        {/* Cuisine types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuisine types</Text>
          <View style={styles.chipsRow}>
            {CUISINE_TYPES.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={cuisines.includes(item)}
                onPress={() => toggleCuisine(item)}
              />
            ))}
          </View>
        </View>

        {/* Meal categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal categories</Text>
          <View style={styles.chipsRow}>
            {MEAL_TYPES.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={meals.includes(item)}
                onPress={() => toggleMeal(item)}
              />
            ))}
          </View>
        </View>

        {!canContinue && (
          <Text style={styles.hint}>
            Select at least one cuisine and one meal category to continue.
          </Text>
        )}

        <Button
          label="Continue"
          size="lg"
          disabled={!canContinue}
          onPress={handleContinue}
        />
      </View>
    </ScreenWrapper>
  );
}
