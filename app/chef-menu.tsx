import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { chefsService } from '@/services';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './chef-menu.styles';

export default function ChefMenuScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();

  const { data: chef, isLoading } = useQuery({
    queryKey: ['chef', 'me'],
    queryFn: () => chefsService.myProfile(),
  });

  const dishes = chef?.signatureDishes ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Menu Manager</Text>
        <Pressable hitSlop={10} style={styles.headerActionBtn}>
          <Ionicons name="add" size={22} color={theme.primary} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={dishes}
          keyExtractor={(name, i) => `${name}-${i}`}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.banner}>
              <Ionicons name="information-circle-outline" size={16} color={theme.warning} />
              <Text style={styles.bannerText}>
                A dedicated menu-item endpoint is not yet exposed by the backend.
                These are your registered signature dishes — full pricing &amp; availability
                management will appear once /menu/items is added.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No signature dishes yet</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.dishRow}>
              <View style={styles.dishThumb}>
                <Text style={styles.dishThumbEmoji}>🍽️</Text>
              </View>
              <View style={styles.dishBody}>
                <Text style={styles.dishName}>{item}</Text>
                <Text style={styles.dishCaption}>Signature dish</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
