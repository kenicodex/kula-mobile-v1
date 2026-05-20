import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './analytics.styles';

const STATS = [
  { label: 'Reach', value: '12,420', delta: '+18%', up: true },
  { label: 'Likes', value: '489', delta: '+12%', up: true },
  { label: 'Comments', value: '72', delta: '-3%', up: false },
  { label: 'Saves', value: '156', delta: '+24%', up: true },
];

export default function ContentAnalyticsScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Content Analytics</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <View style={styles.statDeltaRow}>
                <Ionicons
                  name={s.up ? 'arrow-up' : 'arrow-down'}
                  size={12}
                  color={s.up ? theme.success : theme.error}
                />
                <Text
                  style={[
                    styles.statDelta,
                    { color: s.up ? theme.success : theme.error },
                  ]}
                >
                  {s.delta}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top performing post</Text>
          <Text style={styles.cardBody}>
            Your most engaging post this week reached 12,420 accounts and drove 47 chef profile visits.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Audience</Text>
          {[
            { label: 'Lagos', val: 0.62 },
            { label: 'Abuja', val: 0.21 },
            { label: 'Port Harcourt', val: 0.1 },
            { label: 'Other', val: 0.07 },
          ].map((r) => (
            <View key={r.label} style={styles.audienceRow}>
              <Text style={styles.audienceLabel}>{r.label}</Text>
              <View style={styles.audienceTrack}>
                <View style={[styles.audienceFill, { width: `${r.val * 100}%` }]} />
              </View>
              <Text style={styles.audienceValue}>{Math.round(r.val * 100)}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
