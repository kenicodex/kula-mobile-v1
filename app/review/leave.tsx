import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { bookingsService, reviewsService, apiErrorMessage } from '@/services';
import { asChef, asUser, idOf } from '@/services/adapters';
import { fmtDate } from '@/lib/format';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './leave.styles';

const LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent!'];
const CATEGORIES = ['Food quality', 'Punctuality', 'Communication', 'Cleanliness', 'Value'];

const CATEGORY_KEY: Record<string, 'foodQuality' | 'punctuality' | 'communication' | 'cleanliness'> = {
  'Food quality': 'foodQuality',
  Punctuality: 'punctuality',
  Communication: 'communication',
  Cleanliness: 'cleanliness',
};

export default function LeaveReviewScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsService.get(bookingId!),
    enabled: !!bookingId,
  });

  const chef = asChef(booking?.chefId);
  const chefUser = asUser(chef?.user) ?? asUser(chef?.userId);
  const chefId = idOf(booking?.chefId);

  const toggle = (c: string) => {
    setCategories((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  };

  const { mutate, isPending: loading } = useMutation({
    mutationFn: () => {
      if (!chefId || !bookingId) throw new Error('Missing booking context');
      const catRatings = categories.reduce<Record<string, number>>((acc, c) => {
        const key = CATEGORY_KEY[c];
        if (key) acc[key] = rating;
        return acc;
      }, {});
      return reviewsService.create({
        chefId,
        bookingId,
        rating,
        comment: comment || undefined,
        categories: catRatings,
      });
    },
    onSuccess: () => {
      showMessage({ message: 'Review submitted — thank you!', type: 'success' });
      router.back();
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not submit review.'),
        type: 'danger',
      });
    },
  });

  const submit = () => {
    if (rating === 0) return;
    mutate();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Leave a Review</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.bookingCard}>
          <Avatar uri={chefUser?.avatar} name={chefUser?.name ?? 'Chef'} size="md" />
          <View style={styles.bookingInfo}>
            <Text style={styles.chefName}>{chefUser?.name ?? 'Chef'}</Text>
            <Text style={styles.bookingMeta}>
              {booking
                ? `${booking.serviceType.replace(/_/g, ' ')} · ${fmtDate(booking.date)}`
                : '—'}
            </Text>
          </View>
        </View>

        <View style={styles.rateSection}>
          <Text style={styles.rateTitle}>How was your experience?</Text>
          <Text
            style={[
              styles.rateLabel,
              rating === 0 ? styles.rateLabelEmpty : styles.rateLabelFilled,
            ]}
          >
            {rating === 0 ? 'Tap a star to rate' : LABELS[rating - 1]}
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable
                key={i}
                onPress={() => setRating(i)}
                hitSlop={4}
                style={styles.starButton}
              >
                <Ionicons
                  name={i <= rating ? 'star' : 'star-outline'}
                  size={44}
                  color={i <= rating ? '#FFB020' : theme.hair}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>What stood out?</Text>
        <View style={styles.chipsRow}>
          {CATEGORIES.map((c) => {
            const active = categories.includes(c);
            return (
              <Pressable
                key={c}
                onPress={() => toggle(c)}
                style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active ? styles.chipTextActive : styles.chipTextInactive,
                  ]}
                >
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitleSecondary}>Tell others about it</Text>
        <Text style={styles.sectionHelp}>
          Your review helps other clients pick the right chef.
        </Text>
        <View style={styles.commentCard}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="What did you love? Anything we can improve?"
            placeholderTextColor={theme.inkFaint}
            multiline
            textAlignVertical="top"
            style={styles.commentInput}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          label="Submit Review"
          size="lg"
          disabled={rating === 0}
          loading={loading}
          variant={rating === 0 ? 'ghost' : 'primary'}
          onPress={submit}
        />
      </View>
    </SafeAreaView>
  );
}
