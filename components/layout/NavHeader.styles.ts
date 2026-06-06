import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      paddingHorizontal: spacing[4],
      paddingBottom: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.hair,
    },
    containerFlush: {
      paddingBottom: spacing[2],
      borderBottomWidth: 0,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 36,
    },
    side: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backCircle: {
      borderRadius: radius.full,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.hair,
    },
    title: {
      flex: 1,
      textAlign: 'center',
      color: theme.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    titleLarge: {
      fontSize: 20,
    },
    titleStart: {
      textAlign: 'left',
      marginLeft: spacing[2],
    },
    childrenWrap: {
      marginTop: spacing[2],
    },
  });
