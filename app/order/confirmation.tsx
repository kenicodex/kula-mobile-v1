import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './confirmation.styles';

export default function OrderConfirmation() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={52} color={theme.success} />
        </View>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your order #ORD-2847 has been received. Bayo Ade is preparing your meal and it'll be on its way shortly.
        </Text>

        <View style={styles.detailsCard}>
          <Row icon="pricetag-outline" label="Order ID" value="#ORD-2847" />
          <Divider />
          <Row icon="person-outline" label="Creator" value="Bayo Ade" />
          <Divider />
          <Row icon="time-outline" label="Est. delivery" value="35–50 min" />
          <Divider />
          <Row icon="cash-outline" label="Total" value="₦16,000" valueColor={theme.success} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Track Order" size="lg" onPress={() => router.replace('/(tabs)/orders')} />
        <Button label="Back to Home" variant="ghost" size="lg" onPress={() => router.replace('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  valueColor?: string;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color={theme.inkMuted} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, { color: valueColor ?? theme.ink }]}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  const styles = useStyles(makeStyles);
  return <View style={styles.divider} />;
}
