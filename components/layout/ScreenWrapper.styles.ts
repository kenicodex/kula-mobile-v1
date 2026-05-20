import { StyleSheet } from 'react-native';
import type { Theme } from '@/constants/colors';

export const makeStyles = (_theme: Theme) =>
  StyleSheet.create({
    flex1: { flex: 1 },
    scrollContent: { flexGrow: 1 },
  });
