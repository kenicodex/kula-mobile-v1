import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './ChefCard.styles';

export interface ChefListItem {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  bookingCount: number;
  basePrice: number;
  location: string;
  coverImageUrl: string;
  tags: string[];
  avatarUri?: string;
}

interface ChefCardProps {
  chef: ChefListItem;
  onPress?: () => void;
}

export function ChefCard({ chef, onPress }: ChefCardProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? { opacity: 0.9 } : null]}
    >
      <View style={styles.cover}>
        <Image
          source={{ uri: chef.coverImageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.bookmarkBadge}>
          <Ionicons name="bookmark-outline" size={15} color={theme.white} />
        </View>
        <View style={styles.tagsRow}>
          {chef.tags.slice(0, 2).map((t) => (
            <View key={t} style={styles.tagPill}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.body}>
        <Avatar uri={chef.avatarUri} name={chef.name} size="md" />
        <View style={styles.bodyRight}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{chef.name}</Text>
            <Ionicons name="checkmark-circle" size={14} color={theme.primary} />
          </View>
          <Text style={styles.cuisine}>{chef.cuisine}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={13} color="#FFB020" />
            <Text style={styles.rating}>{chef.rating.toFixed(1)}</Text>
            <Ionicons
              name="people-outline"
              size={13}
              color={theme.inkMuted}
              style={styles.bookingsIconSpacer}
            />
            <Text style={styles.bookings}>{chef.bookingCount} bookings</Text>
            <View style={styles.flexSpacer} />
            <Text style={styles.price}>
              from ₦{Math.floor(chef.basePrice / 1000)}k
            </Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={theme.inkMuted} />
            <Text style={styles.locationText}>{chef.location}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default ChefCard;
