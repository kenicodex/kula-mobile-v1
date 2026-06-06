import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './BookingCard.styles';

export type BookingStatus =
  | 'Confirmed'
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface BookingItem {
  id: string;
  creatorName: string;
  service: string;
  date: string;
  status: BookingStatus;
}

const STATUS_STYLES: Record<BookingStatus, { bg: string; fg: string }> = {
  Confirmed: { bg: '#E4F3EB', fg: '#2E8056' },
  Pending: { bg: '#FBF1DA', fg: '#D9962A' },
  'In Progress': { bg: '#FDE8D8', fg: '#E8681A' },
  Completed: { bg: '#EAEAF2', fg: '#4A4A6A' },
  Cancelled: { bg: '#F8DCD7', fg: '#C84A3A' },
};

interface BookingCardProps {
  booking: BookingItem;
  onPress?: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function BookingCard({
  booking,
  onPress,
  onAction,
  actionLabel,
}: BookingCardProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const statusStyle = STATUS_STYLES[booking.status];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? { opacity: 0.9 } : null]}
    >
      <Avatar name={booking.creatorName} size="md" />
      <View style={styles.body}>
        <Text style={styles.creatorName}>{booking.creatorName}</Text>
        <Text style={styles.service}>{booking.service}</Text>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={11} color={theme.inkMuted} />
          <Text style={styles.dateText}>{booking.date}</Text>
        </View>
      </View>
      <View style={styles.rightCol}>
        <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.fg }]}>
            {booking.status}
          </Text>
        </View>
        {actionLabel ? (
          <Pressable onPress={onAction} hitSlop={10}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export default BookingCard;
