import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { NavHeader } from '@/components/layout/NavHeader';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './checkout.styles';

const CART = [
  { id: '1', name: 'Suya Platter', qty: 2, price: 6000 },
  { id: '2', name: 'Jollof Rice', qty: 1, price: 4000 },
];

type Fulfillment = 'delivery' | 'pickup';

export default function CartCheckoutScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery');
  const [loading, setLoading] = useState(false);

  const subtotal = CART.reduce((s, i) => s + i.qty * i.price, 0);
  const delivery = fulfillment === 'delivery' ? 500 : 0;
  const total = subtotal + delivery;

  const place = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/order/confirmation');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <NavHeader title="Checkout" backVariant="circle" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Cart</Text>
          {CART.map((i) => (
            <View key={i.id} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {i.qty}x {i.name}
              </Text>
              <Text style={styles.itemPrice}>
                ₦{(i.qty * i.price).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.cardSpaced}>
          <Text style={styles.sectionTitle}>Fulfillment</Text>
          <View style={styles.fulfillmentRow}>
            {(['delivery', 'pickup'] as Fulfillment[]).map((f) => {
              const active = fulfillment === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFulfillment(f)}
                  style={[
                    styles.fulfillmentOption,
                    active ? styles.fulfillmentActive : styles.fulfillmentInactive,
                  ]}
                >
                  <Ionicons
                    name={f === 'delivery' ? 'bicycle-outline' : 'walk-outline'}
                    size={20}
                    color={active ? theme.primary : theme.inkMuted}
                  />
                  <Text
                    style={[
                      styles.fulfillmentLabel,
                      active ? styles.fulfillmentLabelActive : styles.fulfillmentLabelInactive,
                    ]}
                  >
                    {f === 'delivery' ? 'Delivery' : 'Pickup'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.cardSpaced}>
          <Row label="Subtotal" value={`₦${subtotal.toLocaleString()}`} />
          <Row label="Delivery fee" value={`₦${delivery.toLocaleString()}`} />
          <View style={styles.totalsDivider} />
          <Row label="Total" value={`₦${total.toLocaleString()}`} bold />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label={`Pay ₦${total.toLocaleString()}`} size="lg" loading={loading} onPress={place} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold ? styles.rowValueBold : styles.rowValueDefault]}>
        {value}
      </Text>
    </View>
  );
}
