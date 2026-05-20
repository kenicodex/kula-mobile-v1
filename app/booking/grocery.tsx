import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './grocery.styles';

interface GroceryItem {
  id: string;
  name: string;
  qty: string;
  price: number;
}

const ITEMS: GroceryItem[] = [
  { id: '1', name: 'Long grain rice (10kg)', qty: '1 bag', price: 12000 },
  { id: '2', name: 'Chicken (whole)', qty: '2', price: 9500 },
  { id: '3', name: 'Beef cuts', qty: '2kg', price: 8400 },
  { id: '4', name: 'Tomatoes (basket)', qty: '1 basket', price: 4500 },
  { id: '5', name: 'Bell peppers, onions, scotch bonnets', qty: 'assorted', price: 3200 },
  { id: '6', name: 'Spices & seasonings', qty: 'pack', price: 2800 },
];

export default function GroceryApprovalScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [approved, setApproved] = useState<string[]>(ITEMS.map((i) => i.id));

  const toggle = (id: string) =>
    setApproved((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const total = ITEMS.filter((i) => approved.includes(i.id)).reduce(
    (s, i) => s + i.price,
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.topTitle}>Grocery Approval</Text>
        <View style={styles.topRightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.banner}>
          <Ionicons name="information-circle" size={20} color={theme.primary} />
          <Text style={styles.bannerText}>
            Tap each item to approve or remove. The chef will purchase only approved items.
          </Text>
        </View>

        <View style={styles.itemsCard}>
          {ITEMS.map((i, idx) => {
            const on = approved.includes(i.id);
            return (
              <Pressable
                key={i.id}
                onPress={() => toggle(i.id)}
                style={[
                  styles.itemRow,
                  idx < ITEMS.length - 1 ? styles.itemRowDivider : null,
                ]}
              >
                <View style={[styles.checkbox, on ? styles.checkboxOn : styles.checkboxOff]}>
                  {on && <Ionicons name="checkmark" size={14} color={theme.white} />}
                </View>
                <View style={styles.itemBody}>
                  <Text style={[styles.itemName, on ? styles.itemNameOn : styles.itemNameOff]}>
                    {i.name}
                  </Text>
                  <Text style={styles.itemQty}>{i.qty}</Text>
                </View>
                <Text
                  style={[styles.itemPrice, on ? styles.itemPriceOn : styles.itemPriceOff]}
                >
                  ₦{i.price.toLocaleString()}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Approved total</Text>
            <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
          </View>
          <Text style={styles.totalSubtext}>
            {approved.length} of {ITEMS.length} items selected
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Approve ₦${total.toLocaleString()}`}
          size="lg"
          variant="primary"
          onPress={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}
