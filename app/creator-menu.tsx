import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { NavHeader } from '@/components/layout/NavHeader';
import { SignedImage } from '@/components/ui/SignedImage';
import {
  apiErrorMessage,
  menuService,
  type MenuItem,
  type UpsertMenuItemPayload,
} from '@/services';
import { uploadToStorage } from '@/services/uploads.service';
import * as ImagePicker from 'expo-image-picker';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { fmtMoney } from '@/lib/format';
import { makeStyles } from './creator-menu.styles';

interface DraftForm {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  availability: 'available' | 'unavailable';
}

const emptyDraft = (): DraftForm => ({
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  availability: 'available',
});

export default function CreatorMenuScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const qc = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<DraftForm>(emptyDraft());
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ['menu', 'mine'],
    queryFn: () => menuService.listMine(),
  });

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setDraft({
      name: item.name,
      description: item.description ?? '',
      price: String(item.price),
      category: item.category ?? '',
      imageUrl: item.imageUrl ?? '',
      availability: item.availability === 'unavailable' ? 'unavailable' : 'available',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setDraft(emptyDraft());
  };

  const buildPayload = (): UpsertMenuItemPayload | null => {
    const name = draft.name.trim();
    const price = Number(draft.price);
    if (!name) {
      showMessage({ message: 'Name is required', type: 'warning' });
      return null;
    }
    if (!Number.isFinite(price) || price < 0) {
      showMessage({ message: 'Enter a valid price', type: 'warning' });
      return null;
    }
    return {
      name,
      description: draft.description.trim() || undefined,
      price,
      category: draft.category.trim() || undefined,
      imageUrl: draft.imageUrl.trim() || undefined,
      availability: draft.availability,
    };
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = buildPayload();
      if (!payload) throw new Error('Invalid payload');
      return editingId
        ? menuService.update(editingId, payload)
        : menuService.create(payload);
    },
    onSuccess: () => {
      showMessage({
        message: editingId ? 'Menu item updated' : 'Menu item added',
        type: 'success',
      });
      qc.invalidateQueries({ queryKey: ['menu', 'mine'] });
      closeModal();
    },
    onError: (err) => {
      const msg = err instanceof Error && err.message === 'Invalid payload'
        ? undefined
        : apiErrorMessage(err, 'Could not save menu item.');
      if (msg) showMessage({ message: msg, type: 'danger' });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => menuService.delete(id),
    onSuccess: () => {
      showMessage({ message: 'Menu item removed', type: 'success' });
      qc.invalidateQueries({ queryKey: ['menu', 'mine'] });
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not delete menu item.'),
        type: 'danger',
      });
    },
  });

  const toggleAvailability = useMutation({
    mutationFn: ({ id, availability }: { id: string; availability: 'available' | 'unavailable' }) =>
      menuService.setAvailability(id, availability),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu', 'mine'] }),
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not update availability.'),
        type: 'danger',
      });
    },
  });

  const confirmDelete = (item: MenuItem) =>
    Alert.alert('Remove menu item', `Remove "${item.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => remove.mutate(item.id) },
    ]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploadingImage(true);
    try {
      const uploaded = await uploadToStorage(result.assets[0].uri, {
        folder: 'menu',
        resourceType: 'image',
      });
      setDraft((d) => ({ ...d, imageUrl: uploaded.url }));
    } catch (err) {
      showMessage({
        message: err instanceof Error ? err.message : 'Upload failed',
        type: 'danger',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader
        title="Menu Manager"
        backVariant="circle"
        right={
          <Pressable hitSlop={10} onPress={openCreate}>
            <Ionicons name="add" size={22} color={theme.primary} />
          </Pressable>
        }
      />

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={items ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                No menu items yet. Tap + to add your first dish.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => openEdit(item)} style={styles.dishRow}>
              {item.imageUrl ? (
                <SignedImage uri={item.imageUrl} style={styles.dishThumb} />
              ) : (
                <View style={styles.dishThumb}>
                  <Text style={styles.dishThumbEmoji}>🍽️</Text>
                </View>
              )}
              <View style={styles.dishBody}>
                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.dishCaption}>
                  {fmtMoney(item.price, item.currency ?? 'NGN')}
                  {item.category ? ` · ${item.category}` : ''}
                </Text>
              </View>
              <View style={styles.dishActions}>
                <Switch
                  value={item.availability === 'available'}
                  onValueChange={(v) =>
                    toggleAvailability.mutate({
                      id: item.id,
                      availability: v ? 'available' : 'unavailable',
                    })
                  }
                  trackColor={{ true: theme.primary, false: theme.hair }}
                />
                <Pressable
                  hitSlop={8}
                  onPress={() => confirmDelete(item)}
                  style={styles.dishDeleteBtn}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.error} />
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}

      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalRoot}
        >
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit menu item' : 'New menu item'}
            </Text>

            <Pressable
              onPress={pickImage}
              disabled={uploadingImage}
              style={styles.modalImageTile}
            >
              {uploadingImage ? (
                <ActivityIndicator color={theme.primary} />
              ) : draft.imageUrl ? (
                <SignedImage uri={draft.imageUrl} style={styles.modalImage} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={26} color={theme.inkMuted} />
                  <Text style={styles.modalImageLabel}>Add photo</Text>
                </>
              )}
            </Pressable>

            <Text style={styles.modalFieldLabel}>Name</Text>
            <TextInput
              value={draft.name}
              onChangeText={(v) => setDraft((d) => ({ ...d, name: v }))}
              placeholder="Jollof Rice"
              placeholderTextColor={theme.inkFaint}
              style={styles.modalInput}
            />

            <Text style={styles.modalFieldLabel}>Price (NGN)</Text>
            <TextInput
              value={draft.price}
              onChangeText={(v) => setDraft((d) => ({ ...d, price: v.replace(/[^0-9.]/g, '') }))}
              placeholder="2500"
              placeholderTextColor={theme.inkFaint}
              keyboardType="decimal-pad"
              style={styles.modalInput}
            />

            <Text style={styles.modalFieldLabel}>Category (optional)</Text>
            <TextInput
              value={draft.category}
              onChangeText={(v) => setDraft((d) => ({ ...d, category: v }))}
              placeholder="Main course"
              placeholderTextColor={theme.inkFaint}
              style={styles.modalInput}
            />

            <Text style={styles.modalFieldLabel}>Description</Text>
            <TextInput
              value={draft.description}
              onChangeText={(v) => setDraft((d) => ({ ...d, description: v }))}
              placeholder="Tell guests what makes it special…"
              placeholderTextColor={theme.inkFaint}
              multiline
              style={[styles.modalInput, styles.modalTextarea]}
            />

            <View style={styles.modalAvailabilityRow}>
              <Text style={styles.modalFieldLabel}>Available now</Text>
              <Switch
                value={draft.availability === 'available'}
                onValueChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    availability: v ? 'available' : 'unavailable',
                  }))
                }
                trackColor={{ true: theme.primary, false: theme.hair }}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={closeModal}
                style={[styles.modalBtn, styles.modalBtnGhost]}
              >
                <Text style={styles.modalBtnLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => save.mutate()}
                disabled={save.isPending || uploadingImage}
                style={[styles.modalBtn, styles.modalBtnPrimary]}
              >
                {save.isPending ? (
                  <ActivityIndicator color={theme.white} />
                ) : (
                  <Text style={[styles.modalBtnLabel, styles.modalBtnLabelPrimary]}>
                    {editingId ? 'Save' : 'Add'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
