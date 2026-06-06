import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';
import { PortfolioView } from '@/components/portfolio/PortfolioView';

/**
 * The Profile tab shows the signed-in user's own portfolio. Account settings
 * (bookings, saved, sign out, etc.) live behind the "My Account" button inside
 * the portfolio, which routes to /account.
 */
export default function ProfileScreen() {
  const { theme } = useTheme();
  const userId = useAuthStore((s) => s.user?.id);

  if (!userId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return <PortfolioView userId={userId} showBack={false} />;
}
