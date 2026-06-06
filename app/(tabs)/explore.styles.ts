import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    header: {
      backgroundColor: theme.card,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    headerTitle: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: radius.xl,
      paddingHorizontal: spacing[3],
      height: 40,
      borderWidth: 1,
      borderColor: theme.hair,
      marginTop: spacing[3],
    },
    searchPlaceholder: {
      flex: 1,
      marginLeft: spacing[2],
      color: theme.inkFaint,
      fontSize: 14,
    },

    // ── Grid container ────────────────────────────────────────────────────────
    gridContent: {
      paddingBottom: spacing[6],
    },
    gridRow: {
      paddingHorizontal: spacing[1],
    },

    // ── Find-a-Creator CTA ───────────────────────────────────────────────────────
    cta: {
      marginHorizontal: spacing[4],
      marginTop: spacing[3],
      backgroundColor: theme.primary,
      borderRadius: radius['2xl'],
      padding: spacing[5],
    },
    ctaTitle: {
      color: theme.white,
      fontSize: 18,
      fontWeight: '700',
    },
    ctaSubtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
      marginTop: spacing[1],
    },
    ctaActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[3],
    },
    ctaActionText: {
      color: theme.white,
      fontSize: 14,
      fontWeight: '700',
    },
    ctaActionIcon: {
      marginLeft: 4,
    },

    // ── Hashtag chips ─────────────────────────────────────────────────────────
    hashtagSection: {
      paddingTop: spacing[3],
    },
    hashtagListContent: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[1],
      paddingBottom: spacing[3],
      gap: spacing[2],
    },
    hashtagPill: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1.5],
      borderRadius: 999,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    hashtagText: {
      color: theme.ink,
      fontSize: 12,
      fontWeight: '600',
    },

    // ── Section headers ───────────────────────────────────────────────────────
    sectionHeader: {
      paddingHorizontal: spacing[4],
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing[2],
    },
    sectionHeaderWithTopGap: {
      paddingHorizontal: spacing[4],
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: spacing[2],
      marginTop: spacing[3],
    },
    creatorsHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: spacing[4],
    },
    seeAll: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '600',
    },

    // ── Popular creators ─────────────────────────────────────────────────────────
    creatorsListContent: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[4],
      gap: spacing[2.5],
    },
    creatorCard: {
      width: 160,
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      overflow: 'hidden',
    },
    creatorCover: {
      width: '100%',
      height: 96,
    },
    creatorCoverFallback: {
      width: '100%',
      height: 96,
      backgroundColor: theme.primaryMuted,
    },
    creatorBody: {
      padding: spacing[2.5],
    },
    creatorName: {
      color: theme.ink,
      fontSize: 13,
      fontWeight: '700',
    },
    creatorSubtitle: {
      marginTop: 2,
      color: theme.inkMuted,
      fontSize: 11,
    },
    creatorMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[1],
    },
    creatorRating: {
      marginLeft: 3,
      color: theme.inkLight,
      fontSize: 11,
      fontWeight: '600',
    },
    creatorPrice: {
      marginLeft: 4,
      color: theme.inkMuted,
      fontSize: 11,
    },
    emptyInline: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[3],
      color: theme.inkMuted,
      fontSize: 12,
    },

    // ── Posts grid ────────────────────────────────────────────────────────────
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

    // ── Loading / empty ───────────────────────────────────────────────────────
    loadingWrap: {
      paddingVertical: spacing[8],
      alignItems: 'center',
    },
    emptyWrap: {
      paddingHorizontal: spacing[6],
      paddingVertical: spacing[8],
      alignItems: 'center',
    },
    emptyIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[3],
    },
    emptyTitle: {
      color: theme.ink,
      fontSize: 15,
      fontWeight: '700',
      marginBottom: spacing[1],
      textAlign: 'center',
    },
    emptySub: {
      color: theme.inkMuted,
      fontSize: 13,
      textAlign: 'center',
    },

    pressed: {
      opacity: 0.85,
    },
  });
