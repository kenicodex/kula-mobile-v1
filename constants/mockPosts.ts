import { PostItem } from '@/components/feed/PostCard';

export const MOCK_POSTS: PostItem[] = [
  {
    id: 'p1',
    chefId: '1',
    chefName: 'Amaka Obi',
    cuisine: 'Nigerian · Continental',
    timeAgo: '2h ago',
    caption:
      'Party jollof has a different aura 🔥 Made this for a 50-person gathering last weekend and they scraped the pot clean!',
    hashtags: ['NigerianFood', 'PartyJollof', 'ChefLife'],
    imageUrl:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&q=80&fit=crop',
    likes: 214,
    comments: 38,
  },
  {
    id: 'p2',
    chefId: '3',
    chefName: 'Fatima A.',
    cuisine: 'Pastry · Desserts',
    timeAgo: '4h ago',
    caption: 'Three-tier red velvet for the Bello wedding — first one of three this weekend! 🎂',
    hashtags: ['Pastry', 'WeddingCake', 'CakesByFatima'],
    imageUrl:
      'https://images.unsplash.com/photo-1578985545062-6d37f5c94a45?w=900&q=80&fit=crop',
    likes: 489,
    comments: 72,
  },
  {
    id: 'p3',
    chefId: '4',
    chefName: 'Bayo Ade',
    cuisine: 'Grills · Suya Specialist',
    timeAgo: '1d ago',
    caption: 'Fresh off the grill. Suya season is back — book early!',
    hashtags: ['Suya', 'Grills', 'BBQ'],
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-e5b0efd3f8d9?w=900&q=80&fit=crop',
    likes: 132,
    comments: 21,
  },
];
