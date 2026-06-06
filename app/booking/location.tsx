import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { BookingStepHeader } from '@/components/booking/BookingStepHeader';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore } from '@/store/booking.store';
import { makeStyles } from './location.styles';

export default function BookingLocation() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { address, city, set } = useBookingStore();

  const canContinue = !!address?.trim() && !!city?.trim();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <BookingStepHeader title="Location" step={4} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Where should the creator come?</Text>
        <Text style={styles.sectionSubtitle}>
          Provide the address for this booking.
        </Text>

        <View style={styles.inputWrap}>
          <TextInput
            value={address ?? ''}
            onChangeText={(v) => set({ address: v })}
            placeholder="Street address"
            placeholderTextColor={theme.inkFaint}
            multiline
            textAlignVertical="top"
            style={styles.inputMultiline}
          />
        </View>

        <Text style={styles.sectionTitleSpaced}>City</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={city ?? ''}
            onChangeText={(v) => set({ city: v })}
            placeholder="e.g. Lagos"
            placeholderTextColor={theme.inkFaint}
            style={styles.input}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          size="lg"
          variant={canContinue ? 'primary' : 'ghost'}
          disabled={!canContinue}
          onPress={() => router.push('/booking/step4')}
        />
      </View>
    </SafeAreaView>
  );
}
