import { Share } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { apiErrorMessage } from '@/services';

export interface SharePostInput {
  id: string;
  authorName: string;
  caption?: string | null;
  mediaUrl?: string | null;
}

export async function sharePost({
  id,
  authorName,
  caption,
  mediaUrl,
}: SharePostInput): Promise<void> {
  const url = `kulamobile://post/${id}`;
  const lines = [caption?.trim() || null, `— ${authorName} on Kula`, url].filter(
    Boolean,
  ) as string[];

  try {
    await Share.share({
      message: lines.join('\n\n'),
      url: mediaUrl ?? url,
    });
  } catch (err) {
    showMessage({
      message: apiErrorMessage(err, 'Could not open share sheet.'),
      type: 'danger',
    });
  }
}
