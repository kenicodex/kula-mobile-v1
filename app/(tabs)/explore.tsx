import React, { useState } from 'react';
import { FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { chefsService, feedService, hashtagsService } from '@/services';
import { chefToListItem, postToItem } from '@/services/adapters';
import { makeStyles } from './explore.styles';

export default function ExploreScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const [query, setQuery] = useState('');

  const { data: tags } = useQuery({
    queryKey: ['hashtags', 'trending'],
    queryFn: () => hashtagsService.trending(10),
  });

  const { data: chefs } = useQuery({
    queryKey: ['chefs', 'popular'],
    queryFn: () => chefsService.search({ limit: 10 }),
  });

  const { data: posts } = useQuery({
    queryKey: ['feed', 'trending'],
    queryFn: () => feedService.trending(30),
  });

  const tagList = (tags ?? []).map((t) => t.name);
  const chefList = (chefs ?? []).map(chefToListItem);
  const postGrid = (posts ?? []).map(postToItem);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Explore
        </Text>
        <Pressable
          onPress={() => router.push('/chefs')}
          style={styles.searchBar}
        >
          <Ionicons name="search" size={18} color={theme.inkMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search chefs, posts, cuisines…"
            placeholderTextColor={theme.inkFaint}
            style={styles.searchInput}
          />
        </Pressable>
      </View>

      <FlatList
        data={postGrid}
        keyExtractor={(p, i) => `${p.id}-${i}`}
        numColumns={3}
        ListHeaderComponent={
          <View>
            <FlatList
              horizontal
              data={tagList.length > 0 ? tagList : ['Trending']}
              keyExtractor={(t) => t}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hashtagListContent}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => router.push(`/hashtag/${item}`)}
                  style={styles.hashtagPill}
                >
                  <Text style={styles.hashtagText}>
                    #{item}
                  </Text>
                </Pressable>
              )}
            />
            <Text style={styles.sectionHeader}>
              Popular Chefs
            </Text>
            <FlatList
              horizontal
              data={chefList}
              keyExtractor={(c) => c.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chefsListContent}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => router.push(`/chefs/${item.id}`)}
                  style={styles.chefCard}
                >
                  {item.coverImageUrl ? (
                    <Image
                      source={{ uri: item.coverImageUrl }}
                      style={styles.chefCover}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.chefCoverFallback} />
                  )}
                  <View style={styles.chefBody}>
                    <Text
                      numberOfLines={1}
                      style={styles.chefName}
                    >
                      {item.name}
                    </Text>
                    <View style={styles.chefMetaRow}>
                      <Ionicons name="star" size={11} color="#FFB020" />
                      <Text style={styles.chefRating}>
                        {item.rating || '—'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.chefsEmpty}>
                  No chefs yet.
                </Text>
              }
            />
            <Text style={styles.sectionHeaderWithTopGap}>
              Latest Posts
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/post/${item.id}`)}
            style={styles.postCell}
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.postImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.postFallback} />
            )}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
