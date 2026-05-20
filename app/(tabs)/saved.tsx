import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChefCard, type ChefListItem } from '@/components/chef/ChefCard';
import type { PostItem } from '@/components/feed/PostCard';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './saved.styles';

type Tab = 'chefs' | 'posts';

// NOTE: The backend does not yet expose a /users/me/saved endpoint. When it is
// added, swap these placeholders for `useQuery` calls and remove the empty
// states.
const SAVED_CHEFS: ChefListItem[] = [];
const SAVED_POSTS: PostItem[] = [];

export default function SavedScreen() {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('chefs');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Saved
        </Text>
        <View style={styles.tabsRow}>
          {(['chefs', 'posts'] as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[
                  styles.tabPill,
                  active ? styles.tabPillActive : styles.tabPillInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabPillText,
                    active ? styles.tabPillTextActive : styles.tabPillTextInactive,
                  ]}
                >
                  {t === 'chefs' ? 'Chefs' : 'Posts'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {tab === 'chefs' ? (
        <FlatList
          data={SAVED_CHEFS}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Empty
              icon="bookmark-outline"
              message="No saved chefs yet"
              sub="Bookmark chefs you love so they're easy to find."
            />
          }
          renderItem={({ item }) => (
            <ChefCard chef={item} onPress={() => router.push(`/chefs/${item.id}`)} />
          )}
        />
      ) : (
        <FlatList
          data={SAVED_POSTS}
          keyExtractor={(p) => p.id}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          ListEmptyComponent={
            <Empty
              icon="bookmark-outline"
              message="No saved posts yet"
              sub="Save posts to revisit recipes and ideas later."
            />
          }
          renderItem={() => null}
        />
      )}
    </SafeAreaView>
  );
}

function Empty({
  icon,
  message,
  sub,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  message: string;
  sub: string;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={theme.primary} />
      </View>
      <Text style={styles.emptyTitle}>
        {message}
      </Text>
      <Text style={styles.emptySub}>
        {sub}
      </Text>
    </View>
  );
}
