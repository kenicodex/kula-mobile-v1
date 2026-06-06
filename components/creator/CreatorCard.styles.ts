import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      overflow: 'hidden',
    },
    cover: {
      height: 100,
      position: 'relative',
    },
    coverImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    bookmarkBadge: {
      position: 'absolute',
      top: spacing[2],
      left: spacing[2.5],
      width: 28,
      height: 28,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagsRow: {
      position: 'absolute',
      top: spacing[2.5],
      right: spacing[2.5],
      flexDirection: 'row',
      gap: spacing[1.5],
    },
    tagPill: {
      backgroundColor: 'rgba(0,0,0,0.45)',
      borderRadius: 10,
      paddingHorizontal: spacing[2],
      paddingVertical: 2,
    },
    tagText: {
      color: theme.white,
      fontSize: 10,
      fontWeight: '600',
    },
    body: {
      padding: spacing[3],
      flexDirection: 'row',
    },
    bodyRight: {
      marginLeft: spacing[2.5],
      flex: 1,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      flex: 1,
      color: theme.ink,
      fontSize: 15,
      fontWeight: '700',
    },
    cuisine: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[1.5],
    },
    rating: {
      marginLeft: 2,
      color: theme.inkLight,
      fontSize: 12,
      fontWeight: '600',
    },
    bookings: {
      marginLeft: 2,
      color: theme.inkMuted,
      fontSize: 12,
    },
    bookingsIconSpacer: { marginLeft: 6 },
    flexSpacer: { flex: 1 },
    price: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[1],
    },
    locationText: {
      marginLeft: 2,
      color: theme.inkMuted,
      fontSize: 11,
    },
  });
