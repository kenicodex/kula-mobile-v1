import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    scrollContent: {
      paddingBottom: spacing[8],
    },

    // ── Header ────────────────────────────────────────────────────────────────
    headerWrap: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[4],
      paddingBottom: spacing[2],
    },
    headerTitle: {
      color: theme.ink,
      fontSize: 24,
      fontWeight: '700',
    },

    // ── User card ─────────────────────────────────────────────────────────────
    userCardWrap: {
      paddingHorizontal: spacing[5],
      marginBottom: spacing[4],
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[4],
      padding: spacing[4],
    },
    userBody: {
      flex: 1,
    },
    userName: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    userEmail: {
      color: theme.inkMuted,
      fontSize: 14,
    },
    verifiedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
      marginTop: spacing[1],
    },
    verifiedText: {
      color: theme.success,
      fontSize: 12,
      fontWeight: '600',
    },
    editBtn: {
      width: 32,
      height: 32,
      borderRadius: 999,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Menu sections ─────────────────────────────────────────────────────────
    menuSection: {
      paddingHorizontal: spacing[5],
    },
    cardSpacer: {
      marginBottom: spacing[4],
    },
    divider: {
      height: 1,
      backgroundColor: theme.hair,
    },

    // ── Version ───────────────────────────────────────────────────────────────
    version: {
      textAlign: 'center',
      color: theme.inkFaint,
      fontSize: 12,
      marginTop: spacing[6],
    },

    // ── Menu item ─────────────────────────────────────────────────────────────
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      paddingVertical: spacing[3.5],
      paddingHorizontal: spacing[1],
    },
    menuIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuIconDefault: {
      backgroundColor: theme.surface,
    },
    menuIconDestructive: {
      backgroundColor: theme.primaryMuted,
    },
    menuLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
    },
    menuLabelDefault: {
      color: theme.ink,
    },
    menuLabelDestructive: {
      color: theme.error,
    },
  });
