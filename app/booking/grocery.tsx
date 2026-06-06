import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SignedImage } from '@/components/ui/SignedImage';
import { NavHeader } from '@/components/layout/NavHeader';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import {
  apiErrorMessage,
  bookingsService,
  groceryService,
  uploadToStorage,
} from '@/services';
import type { GroceryList, GroceryStatus } from '@/services/grocery.service';
import { useAuthStore } from '@/store/auth.store';
import { fmtMoney } from '@/lib/format';
import { makeStyles } from './grocery.styles';

interface DraftItem {
  name: string;
  quantity: string;
  estimatedCost: string;
}

const STATUS_LABEL: Record<GroceryStatus, string> = {
  pending_approval: 'Waiting for client approval',
  approved: 'Approved — creator can purchase',
  purchased: 'Receipt uploaded',
  reimbursed: 'Reimbursed',
};

export default function GroceryScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const qc = useQueryClient();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const currentUser = useAuthStore((s) => s.user);

  const booking = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsService.get(bookingId as string),
    enabled: !!bookingId,
  });

  const list = useQuery<GroceryList | null>({
    queryKey: ['grocery', bookingId],
    queryFn: async () => {
      try {
        return await groceryService.forBooking(bookingId as string);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) return null;
        throw err;
      }
    },
    enabled: !!bookingId,
    retry: false,
  });

  const isCreator =
    currentUser?.role === 'creator' &&
    !!booking.data?.creator &&
    (booking.data.creator.userId === currentUser.id ||
      booking.data.creator.user?.id === currentUser.id);

  // ─── Creator: building a new list ────────────────────────────────────────────
  const [draftItems, setDraftItems] = useState<DraftItem[]>([
    { name: '', quantity: '', estimatedCost: '' },
  ]);

  const updateDraft = (i: number, patch: Partial<DraftItem>) =>
    setDraftItems((items) =>
      items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    );
  const addDraftRow = () =>
    setDraftItems((items) => [
      ...items,
      { name: '', quantity: '', estimatedCost: '' },
    ]);
  const removeDraftRow = (i: number) =>
    setDraftItems((items) =>
      items.length > 1 ? items.filter((_, idx) => idx !== i) : items,
    );

  const draftTotal = useMemo(
    () =>
      draftItems.reduce((sum, it) => sum + (Number(it.estimatedCost) || 0), 0),
    [draftItems],
  );

  const create = useMutation({
    mutationFn: () => {
      const items = draftItems
        .map((it) => ({
          name: it.name.trim(),
          quantity: it.quantity.trim(),
          estimatedCost: Number(it.estimatedCost) || 0,
        }))
        .filter((it) => it.name.length > 0);
      return groceryService.create({ bookingId: bookingId as string, items });
    },
    onSuccess: () => {
      showMessage({ message: 'Grocery list sent for approval', type: 'success' });
      qc.invalidateQueries({ queryKey: ['grocery', bookingId] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not submit list.'),
        type: 'danger',
      });
    },
  });

  // ─── Client: approving an existing list ───────────────────────────────────
  const approve = useMutation({
    mutationFn: () =>
      groceryService.approve((list.data as GroceryList).id),
    onSuccess: () => {
      showMessage({ message: 'List approved', type: 'success' });
      qc.invalidateQueries({ queryKey: ['grocery', bookingId] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not approve.'),
        type: 'danger',
      });
    },
  });

  // ─── Creator: uploading a receipt ────────────────────────────────────────────
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [actualTotalText, setActualTotalText] = useState<string>('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const pickReceipt = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploadingReceipt(true);
    try {
      const uploaded = await uploadToStorage(result.assets[0].uri, {
        folder: 'receipts',
        resourceType: 'image',
      });
      setReceiptUrl(uploaded.url);
    } catch (err) {
      showMessage({
        message: err instanceof Error ? err.message : 'Upload failed',
        type: 'danger',
      });
    } finally {
      setUploadingReceipt(false);
    }
  };

  const submitReceipt = useMutation({
    mutationFn: () =>
      groceryService.uploadReceipt(
        (list.data as GroceryList).id,
        receiptUrl as string,
        Number(actualTotalText) || 0,
      ),
    onSuccess: () => {
      showMessage({ message: 'Receipt submitted', type: 'success' });
      setReceiptUrl(null);
      setActualTotalText('');
      qc.invalidateQueries({ queryKey: ['grocery', bookingId] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not submit receipt.'),
        type: 'danger',
      });
    },
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  if (!bookingId) {
    return (
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <NavHeader title="Grocery" backVariant="circle" />
        <View style={styles.centeredFill}>
          <Text style={styles.emptyText}>Missing booking reference.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const loading = booking.isLoading || list.isLoading;
  const existing = list.data ?? null;

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <NavHeader title="Grocery" backVariant="circle" />

      {loading ? (
        <View style={styles.centeredFill}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : !existing ? (
        // ── No list yet ─────────────────────────────────────────────────────
        isCreator ? (
          <CreatorDraftView
            styles={styles}
            theme={theme}
            items={draftItems}
            total={draftTotal}
            onChange={updateDraft}
            onAdd={addDraftRow}
            onRemove={removeDraftRow}
            onSubmit={() => create.mutate()}
            submitting={create.isPending}
          />
        ) : (
          <View style={styles.centeredFill}>
            <Ionicons name="basket-outline" size={36} color={theme.inkMuted} />
            <Text style={styles.emptyText}>
              The creator hasn't submitted a grocery list yet.
            </Text>
          </View>
        )
      ) : (
        // ── List exists ─────────────────────────────────────────────────────
        <ExistingListView
          styles={styles}
          theme={theme}
          list={existing}
          isCreator={isCreator}
          onApprove={() => approve.mutate()}
          approving={approve.isPending}
          receiptUrl={receiptUrl}
          actualTotalText={actualTotalText}
          onPickReceipt={pickReceipt}
          onChangeActualTotal={setActualTotalText}
          uploadingReceipt={uploadingReceipt}
          onSubmitReceipt={() => submitReceipt.mutate()}
          submittingReceipt={submitReceipt.isPending}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Sub-views ───────────────────────────────────────────────────────────────

function CreatorDraftView({
  styles,
  theme,
  items,
  total,
  onChange,
  onAdd,
  onRemove,
  onSubmit,
  submitting,
}: {
  styles: ReturnType<typeof makeStyles>;
  theme: ReturnType<typeof useTheme>['theme'];
  items: DraftItem[];
  total: number;
  onChange: (i: number, patch: Partial<DraftItem>) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const canSubmit = items.some(
    (it) => it.name.trim() && Number(it.estimatedCost) > 0,
  );
  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.banner}>
          <Ionicons name="information-circle" size={20} color={theme.primary} />
          <Text style={styles.bannerText}>
            Add items you'll buy. The client must approve before you purchase.
          </Text>
        </View>

        {items.map((it, i) => (
          <View key={i} style={styles.draftCard}>
            <View style={styles.draftHeader}>
              <Text style={styles.draftTitle}>Item {i + 1}</Text>
              {items.length > 1 ? (
                <Pressable onPress={() => onRemove(i)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={theme.inkMuted} />
                </Pressable>
              ) : null}
            </View>
            <Input
              label="Name"
              placeholder="e.g. Long grain rice"
              value={it.name}
              onChangeText={(t) => onChange(i, { name: t })}
            />
            <Input
              label="Quantity"
              placeholder="e.g. 2kg, 1 bag"
              value={it.quantity}
              onChangeText={(t) => onChange(i, { quantity: t })}
            />
            <Input
              label="Estimated cost (₦)"
              placeholder="0"
              keyboardType="numeric"
              value={it.estimatedCost}
              onChangeText={(t) => onChange(i, { estimatedCost: t.replace(/[^0-9.]/g, '') })}
            />
          </View>
        ))}

        <Pressable onPress={onAdd} style={styles.addRow}>
          <Ionicons name="add-circle-outline" size={20} color={theme.primary} />
          <Text style={styles.addRowText}>Add another item</Text>
        </Pressable>

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated total</Text>
            <Text style={styles.totalValue}>{fmtMoney(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Send to client for approval"
          size="lg"
          variant="primary"
          disabled={!canSubmit}
          loading={submitting}
          onPress={onSubmit}
        />
      </View>
    </>
  );
}

function ExistingListView({
  styles,
  theme,
  list,
  isCreator,
  onApprove,
  approving,
  receiptUrl,
  actualTotalText,
  onPickReceipt,
  onChangeActualTotal,
  uploadingReceipt,
  onSubmitReceipt,
  submittingReceipt,
}: {
  styles: ReturnType<typeof makeStyles>;
  theme: ReturnType<typeof useTheme>['theme'];
  list: GroceryList;
  isCreator: boolean;
  onApprove: () => void;
  approving: boolean;
  receiptUrl: string | null;
  actualTotalText: string;
  onPickReceipt: () => void;
  onChangeActualTotal: (t: string) => void;
  uploadingReceipt: boolean;
  onSubmitReceipt: () => void;
  submittingReceipt: boolean;
}) {
  const canClientApprove = !isCreator && list.status === 'pending_approval';
  const canCreatorUploadReceipt = isCreator && list.status === 'approved';
  const canSubmitReceipt = !!receiptUrl && Number(actualTotalText) > 0;

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.banner}>
          <Ionicons name="information-circle" size={20} color={theme.primary} />
          <Text style={styles.bannerText}>{STATUS_LABEL[list.status]}</Text>
        </View>

        <View style={styles.itemsCard}>
          {list.items.map((it, idx) => (
            <View
              key={it.id ?? idx}
              style={[
                styles.itemRow,
                idx < list.items.length - 1 ? styles.itemRowDivider : null,
              ]}
            >
              <View style={styles.itemBody}>
                <Text style={styles.itemName}>{it.name}</Text>
                <Text style={styles.itemQty}>{it.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{fmtMoney(it.estimatedCost)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated total</Text>
            <Text style={styles.totalValue}>{fmtMoney(list.estimatedTotal)}</Text>
          </View>
          {list.actualTotal != null ? (
            <View style={[styles.totalRow, styles.totalRowSpaced]}>
              <Text style={styles.totalLabel}>Actual total</Text>
              <Text style={styles.totalValue}>{fmtMoney(list.actualTotal)}</Text>
            </View>
          ) : null}
        </View>

        {list.receiptUrl ? (
          <View style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>Receipt</Text>
            <SignedImage uri={list.receiptUrl} style={styles.receiptImage} />
          </View>
        ) : null}

        {canCreatorUploadReceipt ? (
          <View style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>Upload receipt</Text>
            <Pressable onPress={onPickReceipt} style={styles.uploadBox}>
              {receiptUrl ? (
                <SignedImage uri={receiptUrl} style={styles.uploadPreview} />
              ) : uploadingReceipt ? (
                <ActivityIndicator color={theme.primary} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={28} color={theme.inkMuted} />
                  <Text style={styles.uploadHint}>Tap to pick a photo</Text>
                </>
              )}
            </Pressable>
            <Input
              label="Actual total (₦)"
              placeholder="0"
              keyboardType="numeric"
              value={actualTotalText}
              onChangeText={(t) => onChangeActualTotal(t.replace(/[^0-9.]/g, ''))}
            />
          </View>
        ) : null}
      </ScrollView>

      {canClientApprove ? (
        <View style={styles.footer}>
          <Button
            label={`Approve ${fmtMoney(list.estimatedTotal)}`}
            size="lg"
            variant="primary"
            loading={approving}
            onPress={onApprove}
          />
        </View>
      ) : null}

      {canCreatorUploadReceipt ? (
        <View style={styles.footer}>
          <Button
            label="Submit receipt"
            size="lg"
            variant="primary"
            disabled={!canSubmitReceipt}
            loading={submittingReceipt}
            onPress={onSubmitReceipt}
          />
        </View>
      ) : null}
    </>
  );
}
