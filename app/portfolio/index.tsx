import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';

export default function MyPortfolioIndex() {
  const { theme } = useTheme();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);

  if (!userId) {
    // Not signed in — bounce back rather than redirect to a junk URL.
    router.back();
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return <Redirect href={`/portfolio/${userId}`} />;
}
