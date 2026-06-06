import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { StepTopBar } from '@/components/auth/StepTopBar';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useCreatorOnboardStore } from '@/store/creator-onboard.store';
import { makeStyles } from './step3.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface SelectedService {
  id: string;
  price: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'in_home_cooking',
    label: 'In-Home Cooking',
    description: "Cook at the client's home for a meal or event.",
    icon: '🏠',
  },
  {
    id: 'meal_prep',
    label: 'Meal Prep',
    description: 'Prepare weekly meals in bulk for clients.',
    icon: '🥡',
  },
  {
    id: 'private_dining',
    label: 'Private Dining',
    description: 'Exclusive multi-course dining experience.',
    icon: '🕯️',
  },
  {
    id: 'event_catering',
    label: 'Event Catering',
    description: 'Cater for weddings, birthdays, and corporate events.',
    icon: '🎉',
  },
  {
    id: 'virtual_class',
    label: 'Virtual Class',
    description: 'Teach cooking classes via video call.',
    icon: '🎥',
  },
  {
    id: 'batch_cooking',
    label: 'Batch Cooking',
    description: 'Prepare large quantities for families or meal trains.',
    icon: '🍲',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreatorOnboardStep3() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { services, setStep3 } = useCreatorOnboardStore();
  const [selected, setSelected] = useState<SelectedService[]>(() =>
    services.map((s) => ({ id: s.id, price: String(s.rate) })),
  );

  const isSelected = (id: string) => selected.some((s) => s.id === id);

  const toggleService = (id: string) => {
    if (isSelected(id)) {
      setSelected((prev) => prev.filter((s) => s.id !== id));
    } else {
      setSelected((prev) => [...prev, { id, price: '' }]);
    }
  };

  const setPrice = (id: string, price: string) => {
    setSelected((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price } : s)),
    );
  };

  const getPrice = (id: string) =>
    selected.find((s) => s.id === id)?.price ?? '';

  const canContinue =
    selected.length > 0 && selected.every((s) => s.price.trim() !== '');

  return (
    <ScreenWrapper scrollable statusBarStyle="dark">
      <StepTopBar
        totalSteps={5}
        currentStep={3}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Services & Pricing</Text>
          <Text style={styles.subtitle}>
            Select the services you offer and set your base price in ₦.
          </Text>
        </View>

        {/* Service cards */}
        <View style={styles.cardsWrap}>
          {SERVICE_OPTIONS.map((option) => {
            const active = isSelected(option.id);
            return (
              <View
                key={option.id}
                style={[
                  styles.card,
                  active ? styles.cardActive : styles.cardInactive,
                ]}
              >
                {/* Checkbox row */}
                <View style={styles.topRow}>
                  <View
                    style={[
                      styles.checkbox,
                      active ? styles.checkboxActive : styles.checkboxInactive,
                    ]}
                    onTouchEnd={() => toggleService(option.id)}
                  >
                    {active && <Ionicons name="checkmark" size={14} color={theme.white} />}
                  </View>

                  <Text style={styles.icon}>{option.icon}</Text>

                  <View style={styles.optionTextWrap}>
                    <Text
                      style={styles.optionLabel}
                      onPress={() => toggleService(option.id)}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.optionDesc}>{option.description}</Text>
                  </View>
                </View>

                {/* Price input if selected */}
                {active && (
                  <View style={styles.priceWrap}>
                    <Text style={styles.currency}>₦</Text>
                    <TextInput
                      value={getPrice(option.id)}
                      onChangeText={(text) => setPrice(option.id, text)}
                      placeholder="Base price"
                      keyboardType="numeric"
                      style={styles.priceInput}
                      placeholderTextColor={theme.inkFaint}
                    />
                    <Text style={styles.priceUnit}>/ session</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Button
          label="Continue"
          size="lg"
          disabled={!canContinue}
          onPress={() => {
            setStep3(
              selected.map((s) => ({
                id: s.id,
                rate: parseFloat(s.price) || 0,
              })),
            );
            router.push('/(auth)/creator/onboard/step4');
          }}
        />
      </View>
    </ScreenWrapper>
  );
}
