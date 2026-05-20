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
    searchInput: {
      flex: 1,
      marginLeft: spacing[2],
      color: theme.ink,
      fontSize: 14,
    },

    // ── Hashtag chips ─────────────────────────────────────────────────────────
    hashtagListContent: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
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

    // ── Section header ────────────────────────────────────────────────────────
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
      marginTop: spacing[2],
    },

    // ── Popular chefs ─────────────────────────────────────────────────────────
    chefsListContent: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[4],
      gap: spacing[2.5],
    },
    chefCard: {
      width: 140,
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: theme.hair,
      overflow: 'hidden',
    },
    chefCover: {
      width: '100%',
      height: 84,
    },
    chefCoverFallback: {
      width: '100%',
      height: 84,
      backgroundColor: theme.primaryMuted,
    },
    chefBody: {
      padding: spacing[2],
    },
    chefName: {
      color: theme.ink,
      fontSize: 13,
      fontWeight: '700',
    },
    chefMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    chefRating: {
      marginLeft: 2,
      color: theme.inkLight,
      fontSize: 11,
    },
    chefsEmpty: {
      paddingHorizontal: spacing[4],
      color: theme.inkMuted,
      fontSize: 12,
    },

    // ── Posts grid ────────────────────────────────────────────────────────────
    postCell: {
      width: '33.333%',
      aspectRatio: 1,
      padding: 2,
    },
    postImage: {
      width: '100%',
      height: '100%',
    },
    postFallback: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.hair,
    },
  });
