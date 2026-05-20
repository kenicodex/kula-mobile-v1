import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';

export const makeStyles = (_theme: Theme) =>
  StyleSheet.create({
    shimmer: { flex: 1 },
  });
