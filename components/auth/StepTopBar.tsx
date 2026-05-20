import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './StepTopBar.styles';

interface StepTopBarProps {
  totalSteps: number;
  currentStep: number;
  onBack?: () => void;
}

export function StepTopBar({ totalSteps, currentStep, onBack }: StepTopBarProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        hitSlop={10}
        style={[styles.backBtn, !onBack ? styles.backBtnHidden : null]}
        disabled={!onBack}
      >
        <Ionicons name="chevron-back" size={22} color={theme.ink} />
      </Pressable>

      <View style={styles.stepsRow}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isFilled = stepNumber <= currentStep;
          return (
            <View
              key={stepNumber}
              style={[styles.stepBar, isFilled ? styles.stepBarFilled : styles.stepBarEmpty]}
            />
          );
        })}
      </View>
    </View>
  );
}

export default StepTopBar;
