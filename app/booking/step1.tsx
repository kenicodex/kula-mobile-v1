import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookingStepHeader } from '@/components/booking/BookingStepHeader';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { useBookingStore, Service } from '@/store/booking.store';
import { makeStyles } from './step1.styles';

type ServiceItem = {
  id: Service;
  name: string;
  description: string;
  price: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const SERVICES: ServiceItem[] = [
  { id: 'private_dining', name: 'Private Dining', description: 'In-home dinner for up to 10 guests', price: '₦25,000', icon: 'restaurant-outline' },
  { id: 'catering', name: 'Event Catering', description: 'Full catering for events & parties', price: '₦80,000', icon: 'sparkles-outline' },
  { id: 'meal_prep', name: 'Meal Prep', description: 'Weekly meal preparation & delivery', price: '₦18,000', icon: 'fast-food-outline' },
  { id: 'cooking_class', name: 'Cooking Class', description: 'Hands-on cooking lesson (2–3 hours)', price: '₦15,000', icon: 'school-outline' },
];

export default function BookingStep1() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { chefId } = useLocalSearchParams<{ chefId?: string }>();
  const { service, set } = useBookingStore();

  React.useEffect(() => {
    if (chefId) set({ chefId });
  }, [chefId]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <BookingStepHeader title="Book a Chef" step={1} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.chefCard}>
          <Avatar name="Amaka Obi" size="md" />
          <View style={styles.chefBody}>
            <View style={styles.chefNameRow}>
              <Text style={styles.chefName}>Amaka Obi</Text>
              <Ionicons
                name="checkmark-circle"
                size={13}
                color={theme.primary}
                style={styles.chefIconSpacer}
              />
            </View>
            <Text style={styles.chefCuisine}>Nigerian · Continental</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color="#FFB020" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select a service</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the type of service you need.
        </Text>

        <View style={styles.servicesList}>
          {SERVICES.map((s) => {
            const selected = service === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => set({ service: s.id, serviceLabel: s.name })}
                style={[
                  styles.serviceCard,
                  selected ? styles.serviceCardSelected : styles.serviceCardDefault,
                ]}
              >
                <View
                  style={[
                    styles.serviceIconWrap,
                    selected ? styles.serviceIconWrapSelected : styles.serviceIconWrapDefault,
                  ]}
                >
                  <Ionicons
                    name={s.icon}
                    size={22}
                    color={selected ? theme.white : theme.inkMuted}
                  />
                </View>
                <View style={styles.serviceBody}>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.serviceDescription}>{s.description}</Text>
                </View>
                <View style={styles.servicePriceWrap}>
                  <Text style={styles.servicePrice}>from {s.price}</Text>
                  {selected && (
                    <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          size="lg"
          variant={service ? 'primary' : 'ghost'}
          disabled={!service}
          onPress={() => router.push('/booking/step2')}
        />
      </View>
    </SafeAreaView>
  );
}
