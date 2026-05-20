import { formatDistanceToNow } from 'date-fns';
import type { PostItem } from '@/components/feed/PostCard';
import type { ChefListItem } from '@/components/chef/ChefCard';
import type { Post, User, Chef } from '@/types';

/** Map a backend `Post` to the local `PostItem` shape that PostCard expects. */
export function postToItem(p: Post): PostItem {
  const author = p.author;
  const chefName =
    author?.name ?? (typeof p.authorId === 'string' ? 'Chef' : 'Chef');
  const created = p.createdAt ? new Date(p.createdAt) : null;
  return {
    id: p.id,
    chefId: typeof p.authorId === 'string' ? p.authorId : (p.authorId as any)?._id ?? '',
    chefName,
    cuisine: undefined,
    timeAgo: created ? formatDistanceToNow(created, { addSuffix: true }) : 'recently',
    caption: p.caption ?? '',
    hashtags: p.hashtags ?? [],
    imageUrl: p.mediaUrls?.[0] ?? '',
    likes: p.likeCount ?? 0,
    comments: p.commentCount ?? 0,
    type: p.type,
  };
}

/** Resolve a user reference that may be a populated object or a raw id. */
export function asUser(ref: User | string | undefined | null): User | null {
  if (!ref || typeof ref === 'string') return null;
  return ref;
}

export function asChef(ref: Chef | string | undefined | null): Chef | null {
  if (!ref || typeof ref === 'string') return null;
  return ref;
}

export function idOf(ref: { id?: string; _id?: string } | string | undefined | null): string {
  if (!ref) return '';
  if (typeof ref === 'string') return ref;
  return ref.id ?? ref._id ?? '';
}

/** Map a backend `Chef` to the ChefCard list item shape. */
export function chefToListItem(c: Chef): ChefListItem {
  const u = asUser(c.user ?? (c as { userId: User | string }).userId);
  const baseRate = c.pricing?.[0]?.basePrice ?? 0;
  const loc = c.location;
  return {
    id: c.id ?? (c as { _id?: string })._id ?? '',
    name: u?.name ?? 'Chef',
    cuisine: (c.cuisineTypes ?? []).join(' · '),
    rating: c.rating ?? 0,
    bookingCount: (c as { bookingCount?: number }).bookingCount ?? 0,
    basePrice: baseRate,
    location: loc ? [loc.city, loc.state].filter(Boolean).join(', ') : '',
    coverImageUrl: u?.avatar ?? '',
    tags: (c.cuisineTypes ?? []).slice(0, 2),
    avatarUri: u?.avatar,
  };
}
