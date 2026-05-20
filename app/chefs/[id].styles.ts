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
    cover: {
      height: 220,
      position: 'relative',
      backgroundColor: theme.surface,
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
    coverFallback: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.primaryMuted,
    },
    coverButton: {
      position: 'absolute',
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    coverButtonLeft: {
      top: spacing[3],
      left: spacing[3],
    },
    coverButtonRight: {
      top: spacing[3],
      right: spacing[3],
    },

    headerBlock: {
      paddingHorizontal: spacing[4],
      marginTop: -spacing[8],
      backgroundColor: 'transparent',
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    avatarRing: {
      borderRadius: 999,
      borderWidth: 3,
      borderColor: theme.card,
    },
    headerActions: {
      flexDirection: 'row',
      gap: spacing[2],
      marginBottom: spacing[2],
    },
    messageBtn: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: 999,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    messageBtnLabel: {
      color: theme.ink,
      fontSize: 13,
      fontWeight: '600',
    },
    followBtn: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: theme.primary,
    },
    followBtnActive: {
      backgroundColor: theme.primaryMuted,
    },
    followBtnInactive: {
      backgroundColor: theme.primary,
    },
    followLabel: {
      fontSize: 13,
      fontWeight: '600',
    },
    followLabelActive: {
      color: theme.primary,
    },
    followLabelInactive: {
      color: theme.white,
    },

    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[2.5],
    },
    chefName: {
      color: theme.ink,
      fontSize: 20,
      fontWeight: '700',
    },
    bio: {
      color: theme.inkLight,
      fontSize: 13,
      marginTop: spacing[2],
      lineHeight: 20,
    },

    statsRow: {
      flexDirection: 'row',
      gap: spacing[6],
      marginTop: spacing[3],
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[3],
      gap: spacing[3],
      flexWrap: 'wrap',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      marginLeft: spacing[1],
      color: theme.inkMuted,
      fontSize: 12,
    },
    cuisineRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[1.5],
      marginTop: spacing[3],
    },
    cuisinePill: {
      paddingHorizontal: spacing[2.5],
      paddingVertical: spacing[1],
      borderRadius: 999,
      backgroundColor: theme.primaryMuted,
    },
    cuisineText: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '600',
    },

    tabBar: {
      flexDirection: 'row',
      marginTop: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
      backgroundColor: theme.card,
    },
    tabButton: {
      flex: 1,
      paddingVertical: spacing[3],
      alignItems: 'center',
    },
    tabLabel: {
      fontSize: 12,
    },
    tabLabelActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    tabLabelInactive: {
      color: theme.inkMuted,
    },
    tabIndicator: {
      height: 2,
      width: 40,
      backgroundColor: theme.primary,
      position: 'absolute',
      bottom: 0,
      borderRadius: 999,
    },

    bottomBar: {
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.hair,
      flexDirection: 'row',
      gap: spacing[3],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      paddingBottom: 16,
    },
    bottomBarSlot: {
      flex: 1,
    },

    // Stat
    statWrap: {
      alignItems: 'center',
    },
    statValue: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    statLabel: {
      color: theme.inkMuted,
      fontSize: 11,
    },

    // PostsGrid
    loadingPad: {
      paddingVertical: spacing[8],
      alignItems: 'center',
    },
    emptyPadLg: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.inkMuted,
      fontSize: 12,
    },
    gridWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 2,
    },
    gridCell: {
      width: '33.333%',
      aspectRatio: 1,
      padding: 2,
    },
    gridImage: {
      width: '100%',
      height: '100%',
      borderRadius: radius.md,
    },
    gridPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.hair,
      borderRadius: radius.md,
    },

    // MenuList
    sectionPad: {
      padding: spacing[4],
      gap: 10,
    },
    menuRow: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuThumb: {
      width: 52,
      height: 52,
      borderRadius: radius.xl,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuEmoji: {
      fontSize: 24,
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

    // Reviews
    reviewsPad: {
      padding: spacing[4],
      gap: spacing[3],
    },
    reviewSummary: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
      flexDirection: 'row',
    },
    reviewSummaryLeft: {
      alignItems: 'center',
      paddingRight: spacing[5],
    },
    reviewAvg: {
      color: theme.ink,
      fontSize: 36,
      fontWeight: '700',
    },
    reviewStars: {
      flexDirection: 'row',
      marginTop: 2,
    },
    reviewCount: {
      color: theme.inkMuted,
      fontSize: 11,
      marginTop: spacing[1],
    },
    reviewEmptyWrap: {
      paddingVertical: spacing[6],
      alignItems: 'center',
    },
    reviewCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: 14,
    },
    reviewRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewName: {
      marginLeft: spacing[2],
      flex: 1,
      color: theme.ink,
      fontSize: 13,
      fontWeight: '600',
    },
    reviewRowRight: {
      flexDirection: 'row',
    },
    reviewComment: {
      color: theme.inkLight,
      fontSize: 13,
      marginTop: spacing[2],
      lineHeight: 20,
    },
    reviewDate: {
      color: theme.inkMuted,
      fontSize: 11,
      marginTop: spacing[1],
    },

    // About
    aboutPad: {
      padding: spacing[4],
      gap: spacing[3],
    },
    aboutCard: {
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      padding: spacing[4],
    },
    aboutTitle: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 10,
    },
    serviceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing[1.5],
    },
    serviceDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: theme.primary,
    },
    serviceText: {
      marginLeft: spacing[2.5],
      color: theme.inkLight,
      fontSize: 13,
    },
    availabilityRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    dayPill: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
      borderRadius: 999,
      borderWidth: 1,
    },
    dayPillOpen: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    dayPillClosed: {
      backgroundColor: theme.surface,
      borderColor: theme.hair,
    },
    dayText: {
      fontSize: 12,
      fontWeight: '600',
    },
    dayTextOpen: {
      color: theme.primary,
    },
    dayTextClosed: {
      color: theme.inkMuted,
    },
    pricingRow: {
      flexDirection: 'row',
      paddingVertical: spacing[1.5],
    },
    pricingLabel: {
      flex: 1,
      color: theme.inkLight,
      fontSize: 13,
    },
    pricingValue: {
      color: theme.ink,
      fontSize: 13,
      fontWeight: '700',
    },
    cuisineCaption: {
      color: theme.inkMuted,
      fontSize: 12,
      textAlign: 'center',
      marginTop: spacing[2],
    },
  });
