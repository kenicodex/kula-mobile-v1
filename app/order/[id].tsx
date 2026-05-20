import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { ordersService } from '@/services';
import { asChef, asUser, idOf } from '@/services/adapters';
import { fmtMoney } from '@/lib/format';
import { makeStyles } from './[id].styles';

const STEPS = ['placed', 'confirmed', 'preparing', 'ready', 'delivered'] as const;
const STEP_LABELS: Record<string, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
};

export default function OrderDetailScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.get(id),
    enabled: !!id,
  });

  const chef = asChef(order?.chefId);
  const chefUser = asUser(chef?.user) ?? asUser(chef?.userId);
  const stepIdx = order
    ? STEPS.indexOf(order.status as (typeof STEPS)[number])
    : -1;

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
        <Text style={styles.topTitle}>Order Details</Text>
        <View style={styles.topRightSpacer} />
      </View>

      {isLoading || !order ? (
        <View style={styles.centeredFill}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressOrderId}>
                Order #{order.reference ?? order.id.slice(-6)}
              </Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>
                  {STEP_LABELS[order.status] ?? order.status}
                </Text>
              </View>
            </View>

            <View style={styles.stepsList}>
              {STEPS.map((s, i) => {
                const done = i <= stepIdx;
                const current = i === stepIdx;
                return (
                  <View key={s} style={styles.stepRow}>
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
                      {STEP_LABELS[s]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Chef */}
          <Pressable
            onPress={() => router.push(`/chefs/${idOf(order.chefId)}`)}
            style={styles.chefCard}
          >
            <Avatar uri={chefUser?.avatar} name={chefUser?.name ?? 'Chef'} size="md" />
            <View style={styles.chefBody}>
              <Text style={styles.chefName}>{chefUser?.name ?? 'Chef'}</Text>
              {(chef?.cuisineTypes ?? []).length > 0 && (
                <Text style={styles.chefCuisine}>
                  {(chef?.cuisineTypes ?? []).join(' · ')}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.inkMuted} />
          </Pressable>

          {/* Items */}
          <View style={styles.itemsCard}>
            <Text style={styles.itemsTitle}>Items</Text>
            {order.items.map((it, i) => (
              <ItemRow
                key={i}
                name={it.name}
                qty={it.quantity}
                price={fmtMoney(it.unitPrice * it.quantity)}
              />
            ))}
            <View style={styles.divider} />
            <Row label="Subtotal" value={fmtMoney(order.subtotal)} />
            <Row label="Delivery fee" value={fmtMoney(order.deliveryFee)} />
            <Row label="Total" value={fmtMoney(order.total)} bold />
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View style={styles.footerCol}>
            <Button
              label="Message"
              variant="ghost"
              onPress={() => order && router.push(`/chat/${idOf(order.chefId)}`)}
            />
          </View>
          <View style={styles.footerCol}>
            <Button label="Track" variant="primary" onPress={() => {}} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ItemRow({ name, qty, price }: { name: string; qty: number; price: string }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.itemRow}>
      <Text style={styles.itemName}>
        {qty}x {name}
      </Text>
      <Text style={styles.itemPrice}>{price}</Text>
    </View>
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
