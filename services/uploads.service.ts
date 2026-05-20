/**
 * Cloudinary unsigned uploads.
 *
 * The clients POST directly to Cloudinary using a cloud name + unsigned upload
 * preset (no API secret is shipped in the bundle). The preset itself controls
 * what's allowed (folder, formats, max size) and is configured in the
 * Cloudinary dashboard.
 */

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export type CloudinaryResource = 'image' | 'video' | 'auto';

export interface CloudinaryUploadResult {
  url: string;          // https URL (secure_url)
  publicId: string;
  resourceType: string; // image | video | raw
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  duration?: number;    // videos only
}

export interface UploadOptions {
  /** Folder inside the Cloudinary account (e.g. 'kula/avatars'). */
  folder?: string;
  /** Default 'auto' lets Cloudinary pick image vs video. */
  resourceType?: CloudinaryResource;
  /** Optional tags. */
  tags?: string[];
}

function endpoint(resourceType: CloudinaryResource): string {
  if (!CLOUD_NAME) {
    throw new Error(
      'EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. Add it to your .env.',
    );
  }
  return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
}

function guessFileMeta(uri: string, resourceType: CloudinaryResource) {
  // Pull the extension off the local URI and synthesise a sensible filename
  // + MIME type. RN's FormData needs all three of { uri, type, name }.
  const ext = (uri.split('.').pop() ?? '').toLowerCase();
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
  const type =
    mimeFor[ext] ??
    (resourceType === 'video' ? 'video/mp4' : 'image/jpeg');
  const name = `upload-${Date.now()}.${ext || 'bin'}`;
  return { type, name };
}

/**
 * Upload a local file URI (from expo-image-picker or expo-document-picker)
 * to Cloudinary using the unsigned preset.
 */
export async function uploadToCloudinary(
  uri: string,
  options: UploadOptions = {},
): Promise<CloudinaryUploadResult> {
  if (!UPLOAD_PRESET) {
    throw new Error(
      'EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set. Add it to your .env.',
    );
  }

  const resourceType = options.resourceType ?? 'auto';
  const { type, name } = guessFileMeta(uri, resourceType);

  const form = new FormData();
  // RN's FormData accepts this shape for file uploads.
  form.append('file', { uri, type, name } as unknown as Blob);
  form.append('upload_preset', UPLOAD_PRESET);
  if (options.folder) form.append('folder', options.folder);
  if (options.tags?.length) form.append('tags', options.tags.join(','));

  const res = await fetch(endpoint(resourceType), {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    let detail = '';
    try {
      const err = await res.json();
      detail = err?.error?.message ?? '';
    } catch {
      // ignore
    }
    throw new Error(
      `Cloudinary upload failed (${res.status})${detail ? `: ${detail}` : ''}`,
    );
  }

  const json = await res.json();
  return {
    url: json.secure_url,
    publicId: json.public_id,
    resourceType: json.resource_type,
    format: json.format,
    width: json.width,
    height: json.height,
    bytes: json.bytes,
    duration: json.duration,
  };
}

export const uploadsService = {
  upload: uploadToCloudinary,
};
