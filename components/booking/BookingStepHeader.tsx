import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './BookingStepHeader.styles';

interface BookingStepHeaderProps {
  title: string;
  step: number;
  totalSteps?: number;
  onBack?: () => void;
}

const STEP_LABELS = ['Service', 'Date', 'Details', 'Pay'];

export function BookingStepHeader({
  title,
  step,
  totalSteps = 4,
  onBack,
}: BookingStepHeaderProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightSpacer} />
      </View>

      <View style={styles.barsRow}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const filled = i + 1 <= step;
          return (
            <View
              key={i}
              style={[styles.bar, filled ? styles.barFilled : styles.barEmpty]}
            />
          );
        })}
      </View>

      <View style={styles.labelsRow}>
        {STEP_LABELS.slice(0, totalSteps).map((label, i) => (
          <Text
            key={label}
            style={[
              styles.label,
              i + 1 === step ? styles.labelActive : styles.labelInactive,
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default BookingStepHeader;
