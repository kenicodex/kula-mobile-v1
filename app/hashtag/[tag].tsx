import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { NavHeader } from '@/components/layout/NavHeader';
import { SignedImage } from '@/components/ui/SignedImage';
import { feedService } from '@/services';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './[tag].styles';

export default function HashtagScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['feed', 'hashtag', tag],
    queryFn: () => feedService.byHashtag(tag, { limit: 60 }),
    enabled: !!tag,
  });

  const posts = data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader title={`#${tag}`} backVariant="circle" />

      <View style={styles.countBar}>
        <Text style={styles.countText}>{posts.length} posts</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyLoading}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No posts for #{tag} yet</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const uri = item.mediaUrls?.[0];
          return (
            <Pressable
              onPress={() => router.push(`/post/${item.id}`)}
              style={styles.cell}
            >
              <SignedImage
                uri={uri}
                style={styles.cellImage}
                fallbackStyle={styles.cellPlaceholder}
              />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
