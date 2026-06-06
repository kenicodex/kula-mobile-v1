import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookingStepHeader } from '@/components/booking/BookingStepHeader';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/store/booking.store';
import { makeStyles } from './step3.styles';

const DIETARY = [
  'None',
  'Vegetarian',
  'Vegan',
  'Halal',
  'Gluten-free',
  'Dairy-free',
  'Nut allergy',
  'Other',
];

export default function BookingStep3() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { guests, dietary, notes, set } = useBookingStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <BookingStepHeader title="Event Details" step={3} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Guest count</Text>
        <Text style={styles.sectionSubtitle}>How many people will be dining?</Text>

        <View style={styles.guestsRow}>
          <Pressable
            onPress={() => guests > 1 && set({ guests: guests - 1 })}
            style={[
              styles.guestsButton,
              guests <= 1 ? styles.guestsButtonDisabled : null,
            ]}
            disabled={guests <= 1}
          >
            <Ionicons name="remove" size={18} color={theme.ink} />
          </Pressable>
          <Text style={styles.guestsValue}>{guests}</Text>
          <Pressable
            onPress={() => guests < 50 && set({ guests: guests + 1 })}
            style={styles.guestsButtonAdd}
          >
            <Ionicons name="add" size={18} color={theme.white} />
          </Pressable>
        </View>

        <Text style={styles.sectionTitleSpaced}>Dietary requirements</Text>
        <Text style={styles.sectionSubtitle}>Select what applies.</Text>
        <View style={styles.dietaryRow}>
          {DIETARY.map((d) => {
            const selected = dietary === d;
            return (
              <Pressable
                key={d}
                onPress={() => set({ dietary: d })}
                style={[
                  styles.dietaryChip,
                  selected ? styles.dietaryChipSelected : styles.dietaryChipDefault,
                ]}
              >
                <Text
                  style={[
                    styles.dietaryText,
                    selected ? styles.dietaryTextSelected : styles.dietaryTextDefault,
                  ]}
                >
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitleSpaced}>Special requests</Text>
        <Text style={styles.sectionSubtitle}>Any other notes for the creator.</Text>
        <View style={styles.notesWrap}>
          <TextInput
            value={notes ?? ''}
            onChangeText={(v) => set({ notes: v })}
            placeholder="e.g. Allergies, occasion, theme…"
            placeholderTextColor={theme.inkFaint}
            multiline
            textAlignVertical="top"
            style={styles.notesInput}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          size="lg"
          variant="primary"
          onPress={() => router.push('/booking/location')}
        />
      </View>
    </SafeAreaView>
  );
}
