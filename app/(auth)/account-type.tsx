import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './account-type.styles';

type AccountType = 'client' | 'chef' | null;

// ─── Option card ──────────────────────────────────────────────────────────────

interface OptionCardProps {
  emoji: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function OptionCard({ emoji, title, description, selected, onPress }: OptionCardProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : styles.cardUnselected,
        pressed ? { opacity: 0.9 } : null,
      ]}
    >
      <View style={styles.cardTopRow}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View
          style={[
            styles.radio,
            selected ? styles.radioSelected : styles.radioUnselected,
          ]}
        >
          {selected && <Ionicons name="checkmark" size={14} color={theme.white} />}
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
    </Pressable>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function AccountTypeScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [selected, setSelected] = useState<AccountType>(null);

  const handleContinue = () => {
    if (selected === 'client') {
      router.push('/(auth)/login');
    } else if (selected === 'chef') {
      router.push('/(auth)/chef/sign-up');
    }
  };

  return (
    <ScreenWrapper scrollable>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color={theme.ink} />
        </Pressable>
      </View>

      {/* Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>How will you use Kula?</Text>
        <Text style={styles.subtitle}>
          Choose your account type to get started.
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsWrap}>
        <OptionCard
          emoji="🍽️"
          title="I'm a Client"
          description="I'm looking to hire a professional chef for cooking at home, events, or meal prep."
          selected={selected === 'client'}
          onPress={() => setSelected('client')}
        />

        <OptionCard
          emoji="👨‍🍳"
          title="I'm a Chef"
          description="I'm a professional chef looking to offer my culinary services to clients."
          selected={selected === 'chef'}
          onPress={() => setSelected('chef')}
        />
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <Button
          label="Continue"
          size="lg"
          disabled={!selected}
          onPress={handleContinue}
        />
      </View>
    </ScreenWrapper>
  );
}
