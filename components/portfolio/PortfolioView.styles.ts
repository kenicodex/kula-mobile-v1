import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listContent: {
      paddingBottom: spacing[8],
    },
    cover: {
      width: '100%',
      height: 150,
    },
    coverFallback: {
      backgroundColor: theme.primaryMuted,
    },
    hero: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
      alignItems: 'center',
      // Pull the avatar up so it overlaps the cover image.
      marginTop: -40,
    },
    name: {
      marginTop: spacing[3],
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
    role: {
      marginTop: spacing[0.5],
      color: theme.inkMuted,
      fontSize: 13,
      textTransform: 'capitalize',
    },
    location: {
      marginTop: spacing[0.5],
      color: theme.inkMuted,
      fontSize: 12,
    },
    bio: {
      marginTop: spacing[3],
      color: theme.ink,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: spacing[3],
      rowGap: spacing[3],
      columnGap: spacing[5],
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    statLabel: {
      marginTop: 2,
      color: theme.inkMuted,
      fontSize: 11,
    },
    actionsRow: {
      width: '66.67%',
      gap: spacing[2],
      marginTop: spacing[4],
    },
    shareBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[1.5],
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2.5],
      borderRadius: 999,
      backgroundColor: theme.primary,
    },
    shareBtnText: {
      color: theme.white,
      fontWeight: '700',
      fontSize: 14,
    },
    accountBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[1.5],
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2.5],
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.hair,
      backgroundColor: theme.card,
    },
    accountBtnText: {
      color: theme.ink,
      fontWeight: '700',
      fontSize: 14,
    },
    infoCard: {
      marginHorizontal: spacing[4],
      marginTop: spacing[3],
      padding: spacing[4],
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: theme.hair,
      backgroundColor: theme.card,
    },
    infoTitle: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: spacing[3],
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    chip: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
      borderRadius: 999,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    chipText: {
      color: theme.ink,
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    dayRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[1.5],
    },
    dayPill: {
      width: 40,
      paddingVertical: spacing[1.5],
      borderRadius: radius.md,
      alignItems: 'center',
    },
    dayPillOpen: {
      backgroundColor: theme.primary,
    },
    dayPillClosed: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    dayText: {
      fontSize: 12,
      fontWeight: '700',
    },
    dayTextOpen: {
      color: theme.white,
    },
    dayTextClosed: {
      color: theme.inkMuted,
    },
    availabilityHours: {
      marginTop: spacing[3],
      color: theme.inkMuted,
      fontSize: 12,
    },
    availabilityEmpty: {
      marginTop: spacing[3],
      color: theme.inkMuted,
      fontSize: 12,
    },

    // Contact rows
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2.5],
      paddingVertical: spacing[1.5],
    },
    contactText: {
      color: theme.inkLight,
      fontSize: 13,
    },

    // Menu rows
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[2],
    },
    menuDivider: {
      height: 1,
      backgroundColor: theme.hair,
    },
    menuThumb: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuThumbImage: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
    },
    menuEmoji: {
      fontSize: 20,
    },
    menuBody: {
      flex: 1,
      marginLeft: spacing[3],
    },
    menuName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '600',
    },
    menuSub: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: 2,
    },
    menuPrice: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
      marginLeft: spacing[2],
    },

    // Certifications
    certRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2.5],
      paddingVertical: spacing[2],
    },
    certBody: {
      flex: 1,
    },
    certName: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '600',
    },
    certSub: {
      color: theme.inkMuted,
      fontSize: 12,
      marginTop: 2,
    },
    tabBar: {
      flexDirection: 'row',
      marginTop: spacing[2],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[1.5],
      paddingVertical: spacing[3],
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: theme.primary,
    },
    tabLabel: {
      color: theme.inkMuted,
      fontSize: 13,
      fontWeight: '700',
    },
    tabLabelActive: {
      color: theme.primary,
    },
    gridRow: {
      paddingHorizontal: spacing[1],
    },
    postCell: {
      flex: 1 / 3,
      aspectRatio: 1,
      padding: spacing[0.5],
    },
    postImage: {
      width: '100%',
      height: '100%',
      borderRadius: radius.md,
    },
    postFallback: {
      width: '100%',
      height: '100%',
      borderRadius: radius.md,
      backgroundColor: theme.hair,
    },
    emptyWrap: {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[10],
      alignItems: 'center',
      gap: spacing[2],
    },
    emptyText: {
      color: theme.inkMuted,
      fontSize: 13,
      textAlign: 'center',
    },
    pressed: {
      opacity: 0.85,
    },
  });
