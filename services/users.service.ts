import api from './api';

export interface PublicProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  coverImageUrl: string | null;
  role: 'client' | 'creator' | 'admin';
  isVerified: boolean;
  createdAt: string;
  followerCount: number;
  followingCount: number;
  creatorProfile: {
    id: string;
    bio: string | null;
    location: string | null;
    rating: number | null;
    reviewCount: number | null;
    bookingCount: number;
    serviceTypes: string[];
    availability: PortfolioAvailabilitySlot[];
    certifications: PortfolioCertification[];
  } | null;
}

export interface PortfolioCertification {
  name: string;
  issuingAuthority: string | null;
  year: number | null;
  certificateUrl: string | null;
}

export interface PortfolioAvailabilitySlot {
  dayOfWeek:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  startTime: string; // "HH:mm" 24-hr
  endTime: string;
}

export interface FollowState {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export const usersService = {
  getPortfolio(userId: string) {
    return api.get<PublicProfile>(`/users/${userId}/portfolio`).then((r) => r.data);
  },
  getFollowState(userId: string) {
    return api.get<FollowState>(`/users/${userId}/follow`).then((r) => r.data);
  },
  follow(userId: string) {
    return api.post<FollowState>(`/users/${userId}/follow`).then((r) => r.data);
  },
  unfollow(userId: string) {
    return api.delete<FollowState>(`/users/${userId}/follow`).then((r) => r.data);
  },
};
