import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ChefCard } from '@/components/chef/ChefCard';
import { chefsService } from '@/services';
import { chefToListItem } from '@/services/adapters';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './index.styles';

type Sort = 'rating' | 'bookings' | 'price_low';

const CUISINES = ['Nigerian', 'Continental', 'Pastry', 'Grills', 'Chinese', 'Vegan'];
const SERVICES = ['Private Dining', 'Catering', 'Meal Prep', 'Cooking Class'];

export default function ChefListScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<Sort>('rating');
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['chefs', 'search', query],
    queryFn: () => chefsService.search(query ? { q: query, limit: 50 } : { limit: 50 }),
  });

  const chefs = useMemo(() => {
    const list = (data ?? []).map(chefToListItem);
    if (sortBy === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'bookings')
      return [...list].sort((a, b) => b.bookingCount - a.bookingCount);
    return [...list].sort((a, b) => a.basePrice - b.basePrice);
  }, [data, sortBy]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color={theme.ink} />
          </Pressable>
          <Text style={styles.topTitle}>Find a Chef</Text>
          <Pressable onPress={() => setFilterOpen(true)} hitSlop={10}>
            <Ionicons name="options-outline" size={22} color={theme.ink} />
          </Pressable>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={theme.inkMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search cuisine, chef name…"
            placeholderTextColor={theme.inkFaint}
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.sortBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortScrollContent}
        >
          <SortChip label="Top rated" active={sortBy === 'rating'} onPress={() => setSortBy('rating')} />
          <SortChip
            label="Most booked"
            active={sortBy === 'bookings'}
            onPress={() => setSortBy('bookings')}
          />
          <SortChip
            label="Price (low)"
            active={sortBy === 'price_low'}
            onPress={() => setSortBy('price_low')}
          />
        </ScrollView>
      </View>

      <FlatList
        data={chefs}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyLoading}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No chefs found</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ChefCard chef={item} onPress={() => router.push(`/chefs/${item.id}`)} />
        )}
      />

      <FilterSheet visible={filterOpen} onClose={() => setFilterOpen(false)} />
    </SafeAreaView>
  );
}

function SortChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.sortChip, active ? styles.sortChipActive : styles.sortChipInactive]}
    >
      <Text
        style={[
          styles.sortChipText,
          active ? styles.sortChipTextActive : styles.sortChipTextInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FilterSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const styles = useStyles(makeStyles);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandleWrap}>
            <View style={styles.sheetHandle} />
          </View>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filters</Text>
            <Pressable
              onPress={() => {
                setCuisines([]);
                setServices([]);
                setMinRating(0);
              }}
              hitSlop={10}
            >
              <Text style={styles.sheetReset}>Reset</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.sheetScroll}>
            <Text style={styles.sheetSectionTitle}>Minimum rating</Text>
            <View style={styles.ratingsRow}>
              {[0, 3, 3.5, 4, 4.5].map((r) => {
                const active = minRating === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => setMinRating(r)}
                    style={[
                      styles.ratingPill,
                      active ? styles.ratingPillActive : styles.ratingPillInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.ratingPillText,
                        active ? styles.ratingPillTextActive : styles.ratingPillTextInactive,
                      ]}
                    >
                      {r === 0 ? 'Any' : `${r} ★`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sheetSectionTitleSpaced}>Cuisine</Text>
            <View style={styles.chipsRow}>
              {CUISINES.map((c) => {
                const sel = cuisines.includes(c);
                return (
                  <Pressable
                    key={c}
                    onPress={() => toggle(cuisines, setCuisines, c)}
                    style={[styles.chip, sel ? styles.chipActive : styles.chipInactive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        sel ? styles.chipTextActive : styles.chipTextInactive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sheetSectionTitleSpaced}>Service type</Text>
            <View style={styles.chipsRow}>
              {SERVICES.map((s) => {
                const sel = services.includes(s);
                return (
                  <Pressable
                    key={s}
                    onPress={() => toggle(services, setServices, s)}
                    style={[styles.chip, sel ? styles.chipActive : styles.chipInactive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        sel ? styles.chipTextActive : styles.chipTextInactive,
                      ]}
                    >
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.applyWrap}>
            <Pressable onPress={onClose} style={styles.applyButton}>
              <Text style={styles.applyLabel}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
