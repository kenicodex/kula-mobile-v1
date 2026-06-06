import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PortfolioView } from '@/components/portfolio/PortfolioView';

export default function PortfolioScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  return <PortfolioView userId={userId} showBack />;
}
