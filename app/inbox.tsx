import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from '@/components/ui/Avatar';
import { NavHeader } from '@/components/layout/NavHeader';
import { messagingService } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { fmtRelative } from '@/lib/format';
import type { Conversation } from '@/types';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './inbox.styles';

interface Row {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timeAgo: string;
  unread: number;
}

function toRow(c: Conversation, selfId?: string): Row {
  const other = (c.participants ?? [])
    .map((p) => p.user)
    .find((u) => u && u.id !== selfId);
  return {
    id: c.id,
    name: other?.name ?? 'Conversation',
    avatar: other?.avatar ?? undefined,
    lastMessage: c.lastMessage?.text ?? '—',
    timeAgo: fmtRelative(c.updatedAt),
    unread:
      (c as { unreadCount?: number }).unreadCount !== undefined
        ? (c as { unreadCount?: number }).unreadCount ?? 0
        : 0,
  };
}

export default function InboxScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingService.conversations(),
  });

  const rows = useMemo(() => {
    const list = (data ?? []).map((c) => toRow(c, user?.id));
    if (!query) return list;
    return list.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  }, [data, user?.id, query]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader
        title="Messages"
        titleSize="lg"
        rightAction={{
          icon: 'create-outline',
          onPress: () => {},
          accessibilityLabel: 'New message',
        }}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={theme.inkMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search messages…"
            placeholderTextColor={theme.inkFaint}
            style={styles.searchInput}
          />
        </View>
      </NavHeader>

      <FlatList
        data={rows}
        keyExtractor={(c) => c.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No conversations yet</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/chat/[id]',
                params: { id: item.id, name: item.name, avatar: item.avatar ?? '' },
              })
            }
            style={({ pressed }) => [
              styles.row,
              pressed ? styles.rowPressed : null,
            ]}
          >
            <View style={styles.avatarWrap}>
              <Avatar uri={item.avatar} name={item.name} size="md" />
            </View>
            <View style={styles.rowBody}>
              <View style={styles.rowTopLine}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text
                  style={[
                    styles.rowTime,
                    item.unread > 0 ? styles.rowTimeUnread : styles.rowTimeRead,
                  ]}
                >
                  {item.timeAgo}
                </Text>
              </View>
              <View style={styles.rowBottomLine}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.rowMessage,
                    item.unread > 0 ? styles.rowMessageUnread : styles.rowMessageRead,
                  ]}
                >
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
