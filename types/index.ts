// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = 'client' | 'chef' | 'creator' | 'admin';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ServiceType =
  | 'in_home_cooking'
  | 'meal_prep'
  | 'private_dining'
  | 'event_catering'
  | 'virtual_class'
  | 'batch_cooking';

export type HireType = 'instant' | 'scheduled';

export type FulfillmentType = 'delivery' | 'pickup' | 'dine_in';

export type PostType = 'photo' | 'video' | 'recipe' | 'daily_special';

export type MessageType = 'text' | 'image' | 'system';

// ─── Core Models ─────────────────────────────────────────────────────────────

export interface Address {
  id?: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  fcmToken?: string;
  dietaryRestrictions: string[];
  allergies: string[];
  addressBook: Address[];
  createdAt?: string;
}

export interface ChefPricing {
  serviceType: ServiceType;
  basePrice: number;
  currency: string;
  unit?: string; // e.g. 'per hour', 'per event'
}

export interface ChefAvailability {
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export interface Chef {
  id: string;
  userId: string | User;
  bio: string;
  cuisineTypes: string[];
  mealCategories: string[];
  signatureDishes: string[];
  serviceTypes: ServiceType[];
  pricing: ChefPricing[];
  availability: ChefAvailability | Record<string, { start: string; end: string }[]>;
  rating: number;
  reviewCount: number;
  bookingCount?: number;
  status: 'pending' | 'approved' | 'suspended';
  location: Address;
  instantBooking: boolean;
  pinnedPosts: string[]; // Post IDs
  user?: User;
}

export interface TimeSlot {
  start: string; // "HH:mm"
  end: string;
}

export interface Booking {
  id: string;
  clientId: string;
  chefId: string;
  serviceType: ServiceType;
  hireType: HireType;
  date: string; // ISO date string
  timeSlot?: TimeSlot;
  numberOfGuests: number;
  location: Address;
  occasion?: string;
  specialInstructions?: string;
  status: BookingStatus;
  totalAmount: number;
  reference: string;
  createdAt: string;
  client?: User;
  chef?: Chef;
}

export interface Post {
  id: string;
  authorId: string;
  author?: User;
  type: PostType;
  mediaUrls: string[];
  caption?: string;
  hashtags?: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author?: User;
  text: string;
  createdAt: string;
}

export interface ReviewCategory {
  name: string;
  rating: number;
}

export interface Review {
  id: string;
  clientId: string;
  client?: User;
  chefId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  chefResponse?: string;
  categories?: ReviewCategory[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  participantUsers?: User[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  text?: string;
  mediaUrl?: string;
  type: MessageType;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type:
    | 'booking_request'
    | 'booking_confirmed'
    | 'booking_cancelled'
    | 'new_message'
    | 'new_review'
    | 'payment'
    | 'system';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  clientId: string;
  chefId: string;
  items: OrderItem[];
  fulfillmentType: FulfillmentType;
  deliveryAddress?: Address;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  reference: string;
  createdAt: string;
  client?: User;
  chef?: Chef;
}

// ─── API Utilities ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

/**
 * Backend response shape from POST /auth/login and POST /auth/register.
 * The returned `user` is minimal — call GET /users/me to hydrate the full
 * profile (avatar, phone, addressBook, dietary, etc).
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
}
