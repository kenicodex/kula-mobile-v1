import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';
import { radius, spacing } from '@/constants/commonStyles';

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing[4],
    },
    label: {
      color: theme.ink,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: spacing[1.5],
    },
    fieldRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      paddingHorizontal: spacing[4],
    },
    fieldSingleLine: {
      height: 48,
    },
    fieldMultiline: {
      minHeight: 100,
      alignItems: 'flex-start',
      paddingVertical: spacing[3],
    },
    borderDefault: { borderColor: theme.hair },
    borderFocused: { borderColor: theme.primary },
    borderError: { borderColor: theme.error },
    leftIconWrap: { marginRight: spacing[2] },
    rightIconWrap: { marginLeft: spacing[2] },
    input: {
      flex: 1,
      color: theme.ink,
      fontSize: 16,
    },
    passwordToggle: {
      marginLeft: spacing[2],
      padding: spacing[1],
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      marginTop: spacing[1],
    },
  });
