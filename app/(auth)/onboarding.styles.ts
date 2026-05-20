import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.card,
    },

    // Top skip row
    skipRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: spacing[6],
      paddingTop: spacing[2],
      height: 40,
    },
    skipText: {
      color: theme.inkMuted,
      fontSize: 14,
      fontWeight: '600',
    },

    // Slides
    slidesContainer: {
      flex: 1,
      overflow: 'hidden',
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing[6],
    },
    imageWrap: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: radius['3xl'],
      overflow: 'hidden',
      backgroundColor: theme.surface,
      marginTop: spacing[4],
    },
    image: {
      width: '100%',
      height: '100%',
    },
    slideTextWrap: {
      paddingTop: spacing[8],
      paddingHorizontal: spacing[2],
      alignItems: 'center',
    },
    slideTitle: {
      color: theme.ink,
      fontSize: 26,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: spacing[3],
    },
    slideSubtitle: {
      color: theme.inkLight,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
    },

    // Dots
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing[2],
      marginVertical: spacing[5],
      zIndex: 2,
      elevation: 2,
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      width: 24,
      backgroundColor: theme.primary,
    },
    dotInactive: {
      width: 8,
      backgroundColor: theme.hair,
    },

    // CTA
    ctaWrap: {
      paddingHorizontal: spacing[6],
      paddingBottom: spacing[6],
      gap: spacing[3],
      zIndex: 2,
      elevation: 2,
    },
    ctaButton: {
      width: '100%',

    },
  });
