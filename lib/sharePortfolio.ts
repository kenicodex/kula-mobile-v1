import { Share } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { apiErrorMessage } from '@/services';

export interface SharePortfolioInput {
  userId: string;
  name: string;
  role?: string | null;
}

// Base URL of the public web portfolio (the kula-admin app's public route).
// Set EXPO_PUBLIC_WEB_URL to the deployed admin domain; the fallback is a
// best-guess placeholder and should be overridden per environment.
const WEB_URL = (
  process.env.EXPO_PUBLIC_WEB_URL ?? 'https://kula-admin-v1.onrender.com'
).replace(/\/$/, '');

export async function sharePortfolio({
  userId,
  name,
  role,
}: SharePortfolioInput): Promise<void> {
  const url = `${WEB_URL}/portfolio/${userId}`;
  const lead =
    role === 'creator'
      ? `Check out ${name}'s creator portfolio on Kula`
      : `Check out ${name}'s portfolio on Kula`;

  try {
    await Share.share({
      message: `${lead}\n\n${url}`,
      url,
    });
  } catch (err) {
    showMessage({
      message: apiErrorMessage(err, 'Could not open share sheet.'),
      type: 'danger',
    });
  }
}
