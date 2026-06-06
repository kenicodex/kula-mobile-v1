import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NavHeader } from '@/components/layout/NavHeader';
import { notificationsService } from '@/services';
import { fmtRelative } from '@/lib/format';
import type { Notification } from '@/types';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './notifications.styles';

const ICON_MAP: Record<
  Notification['type'],
  { icon: React.ComponentProps<typeof Ionicons>['name']; color: string; bg: string }
> = {
  booking_request: { icon: 'calendar-outline', color: '#E8681A', bg: '#FDE8D8' },
  booking_confirmed: { icon: 'checkmark-circle-outline', color: '#2E8056', bg: '#E4F3EB' },
  booking_cancelled: { icon: 'close-circle-outline', color: '#C84A3A', bg: '#F8DCD7' },
  new_message: { icon: 'chatbubble-outline', color: '#4A4A6A', bg: '#EAEAF2' },
  new_review: { icon: 'star-outline', color: '#D9962A', bg: '#FBF1DA' },
  payment: { icon: 'cash-outline', color: '#2E8056', bg: '#E4F3EB' },
  system: { icon: 'megaphone-outline', color: '#E8681A', bg: '#FDE8D8' },
};

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const qc = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.list({ limit: 50 }),
  });

  const markAll = useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markOne = useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const items = data?.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader
        title="Notifications"
        backVariant="circle"
        right={
          <Pressable
            onPress={() => markAll.mutate()}
            hitSlop={10}
            style={styles.readAllBtn}
          >
            <Text style={styles.readAllText}>Read</Text>
          </Pressable>
        }
      />

      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const meta = ICON_MAP[item.type] ?? ICON_MAP.system;
          return (
            <Pressable
              onPress={() => {
                if (!item.isRead) markOne.mutate(item.id);
              }}
              style={({ pressed }) => [
                styles.card,
                item.isRead ? styles.cardRead : styles.cardUnread,
                pressed ? { opacity: 0.9 } : null,
              ]}
            >
              <View
                style={[styles.cardIcon, { backgroundColor: meta.bg }]}
              >
                <Ionicons name={meta.icon} size={20} color={meta.color} />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardTime}>{fmtRelative(item.createdAt)}</Text>
                </View>
                <Text style={styles.cardText}>{item.body}</Text>
              </View>
              {!item.isRead && <View style={styles.unreadDot} />}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
