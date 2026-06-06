import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    // In reels mode the background is black so the full-screen video reads
    // edge-to-edge, including the area behind the status bar.
    reelsRoot: {
      backgroundColor: '#000',
    },
    header: {
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
    },
    // Reels: float the header over the video (so the video spans up behind the
    // status bar). No scrim — the video shows through; white text carries a soft
    // shadow for legibility.
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
    },
    onVideo: {
      color: '#fff',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    onVideoSub: {
      color: 'rgba(255,255,255,0.9)',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    headerBody: {
      marginLeft: spacing[2.5],
      flex: 1,
    },
    headerGreeting: {
      color: theme.inkMuted,
      fontSize: 11,
    },
    headerName: {
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    headerIconSpacer: {
      marginRight: spacing[3],
    },
    toggleBar: {
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[3],
    },
    reelsContainer: {
      flex: 1,
      backgroundColor: '#000',
    },
    reelsToggleOverlay: {
      position: 'absolute',
      top: spacing[3],
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    reelsEmpty: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[6],
    },
    reelsEmptyText: {
      color: '#fff',
      textAlign: 'center',
    },
    listContent: {
      padding: spacing[4],
      gap: spacing[4],
      paddingBottom: spacing[8],
    },
    emptyWrap: {
      paddingVertical: spacing[16],
      alignItems: 'center',
    },
    emptyText: {
      color: theme.inkMuted,
    },
  });
