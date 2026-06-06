/**
 * DigitalOcean Spaces uploads via backend-issued presigned URLs.
 *
 * Flow:
 *   1. Ask the backend for a short-lived presigned PUT URL (auth-gated).
 *   2. PUT the file binary straight to Spaces via expo-file-system's native
 *      uploader — file never touches our API.
 *   3. Use the returned publicUrl (CDN-aware) for display & persistence.
 */

import * as FileSystem from 'expo-file-system/legacy';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import api from './api';

export type UploadResourceType = 'image' | 'video' | 'auto';

export interface UploadResult {
  /** Public (or CDN) URL of the stored object. */
  url: string;
  /** Object key inside the Space. */
  key: string;
  /** Mime type the object was stored with. */
  contentType: string;
  /** Size in bytes (best-effort; only present if known locally). */
  bytes?: number;
}

export interface UploadOptions {
  /** Logical folder inside the Space (avatars, creators, posts, receipts, ...). */
  folder?: string;
  /** Hint for default MIME / extension when the URI has none. */
  resourceType?: UploadResourceType;
  /** Override the inferred filename / extension. */
  filename?: string;
  /** Override the inferred content type. */
  contentType?: string;
}

interface PresignResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  headers: Record<string, string>;
  expiresIn: number;
}

function guessFileMeta(uri: string, resourceType: UploadResourceType) {
  const ext = (uri.split('.').pop() ?? '').toLowerCase().replace(/\?.*$/, '');
  const mimeFor: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    heic: 'image/heic',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
  };
  const contentType =
    mimeFor[ext] ?? (resourceType === 'video' ? 'video/mp4' : 'image/jpeg');
  const filename = `upload-${Date.now()}.${ext || 'bin'}`;
  return { contentType, filename };
}

/**
 * iPhones capture photos as HEIC/HEIF by default. iOS renders those natively,
 * but web browsers can't display them in an `<img>` — so a HEIC post that looks
 * fine in the app shows up blank in the web admin. Re-encode such photos to
 * JPEG before upload so every consumer can render them. Other formats (jpg,
 * png, webp, gif) and videos already work everywhere and pass through untouched.
 *
 * Returns the converted file's metadata, or `null` when no conversion applies
 * (or when conversion fails — we fall back to uploading the original).
 */
async function toWebSafeImage(
  uri: string,
  resourceType: UploadResourceType,
): Promise<{ uri: string; contentType: string; filename: string } | null> {
  if (resourceType === 'video') return null;
  const ext = (uri.split('.').pop() ?? '').toLowerCase().replace(/\?.*$/, '');
  if (ext !== 'heic' && ext !== 'heif') return null;

  try {
    const ref = await ImageManipulator.manipulate(uri).renderAsync();
    const result = await ref.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
    return {
      uri: result.uri,
      contentType: 'image/jpeg',
      filename: `upload-${Date.now()}.jpg`,
    };
  } catch {
    // Conversion failed — upload the original rather than blocking the post.
    return null;
  }
}

async function presign(input: {
  filename: string;
  contentType: string;
  folder?: string;
}): Promise<PresignResponse> {
  const { data } = await api.post<PresignResponse>('/uploads/presign', input);
  return data;
}

/**
 * Upload a local file URI (from expo-image-picker / expo-document-picker)
 * to DigitalOcean Spaces using a backend-issued presigned PUT URL.
 */
export async function uploadToStorage(
  uri: string,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const resourceType = options.resourceType ?? 'auto';

  // Normalize HEIC/HEIF photos to JPEG so they render outside iOS (e.g. the web
  // admin). When converted, the JPEG metadata wins over caller hints, which
  // described the original HEIC file.
  const converted = await toWebSafeImage(uri, resourceType);
  const sourceUri = converted?.uri ?? uri;
  const guessed = guessFileMeta(sourceUri, resourceType);
  const filename = converted?.filename ?? options.filename ?? guessed.filename;
  const contentType =
    converted?.contentType ?? options.contentType ?? guessed.contentType;

  const presigned = await presign({
    filename,
    contentType,
    folder: options.folder,
  });

  // Stream the file natively as a raw binary PUT. RN's fetch + Blob is unreliable
  // for binary uploads (empty body / multipart re-encoding), which breaks the
  // S3 signature the presigned URL was issued for.
  const putRes = await FileSystem.uploadAsync(presigned.uploadUrl, sourceUri, {
    httpMethod: 'PUT',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: presigned.headers,
  });

  if (putRes.status < 200 || putRes.status >= 300) {
    throw new Error(
      `Spaces upload failed (${putRes.status})${putRes.body ? `: ${putRes.body}` : ''}`,
    );
  }

  const info = await FileSystem.getInfoAsync(sourceUri).catch(() => null);

  return {
    url: presigned.publicUrl,
    key: presigned.key,
    contentType,
    bytes: info && info.exists ? info.size : undefined,
  };
}

export const uploadsService = {
  upload: uploadToStorage,
};
