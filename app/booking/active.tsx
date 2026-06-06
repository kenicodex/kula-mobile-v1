import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { NavHeader } from '@/components/layout/NavHeader';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './active.styles';

const STEPS = [
  { id: 'arrived', label: 'Creator arrived', time: '3:55 PM' },
  { id: 'setup', label: 'Setup in progress', time: '4:00 PM' },
  { id: 'cooking', label: 'Cooking', time: '4:30 PM' },
  { id: 'serving', label: 'Serving', time: '6:00 PM' },
];

const CURRENT = 2;

export default function ActiveBookingScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <NavHeader title="Active Booking" backVariant="circle" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusBanner}>
          <View style={styles.statusIconWrap}>
            <Ionicons name="restaurant" size={20} color={theme.white} />
          </View>
          <View style={styles.statusBody}>
            <Text style={styles.statusTitle}>In Progress</Text>
            <Text style={styles.statusSubtitle}>Creator is currently cooking</Text>
          </View>
        </View>

        <View style={styles.creatorCard}>
          <Avatar name="Amaka Obi" size="md" />
          <View style={styles.creatorBody}>
            <Text style={styles.creatorName}>Amaka Obi</Text>
            <Text style={styles.creatorMeta}>Private Dining · 8 guests</Text>
          </View>
          <Pressable
            onPress={() => router.push('/chat/1')}
            style={styles.chatButton}
          >
            <Ionicons name="chatbubble" size={16} color={theme.primary} />
          </Pressable>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progress</Text>
          {STEPS.map((s, i) => {
            const done = i <= CURRENT;
            const current = i === CURRENT;
            return (
              <View key={s.id} style={styles.stepRow}>
                <View style={styles.stepIndicatorCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      done ? styles.stepCircleDone : styles.stepCirclePending,
                    ]}
                  >
                    {done ? (
                      <Ionicons name="checkmark" size={14} color={theme.white} />
                    ) : (
                      <Text style={styles.stepNumber}>{i + 1}</Text>
                    )}
                  </View>
                  {i < STEPS.length - 1 && (
                    <View
                      style={[
                        styles.stepConnector,
                        done ? styles.stepConnectorDone : styles.stepConnectorPending,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepBody}>
                  <Text
                    style={[
                      styles.stepLabel,
                      current
                        ? styles.stepLabelCurrent
                        : done
                        ? styles.stepLabelDone
                        : styles.stepLabelPending,
                    ]}
                  >
                    {s.label}
                  </Text>
                  <Text style={styles.stepTime}>{s.time}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={() => router.push('/booking/grocery')}
          style={styles.groceryCard}
        >
          <View style={styles.groceryIconWrap}>
            <Ionicons name="basket-outline" size={20} color={theme.primary} />
          </View>
          <View style={styles.groceryBody}>
            <Text style={styles.groceryTitle}>Grocery list</Text>
            <Text style={styles.grocerySubtitle}>Review and approve receipts</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Message Creator" variant="primary" onPress={() => router.push('/chat/1')} />
      </View>
    </SafeAreaView>
  );
}
