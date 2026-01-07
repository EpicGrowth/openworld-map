// OpenWorld.Map Type Definitions
// These types match the database schema from 05_DATA_ARCHITECTURE.md

// Enums
export type UserLevel = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
export type UserType = "RIDER" | "DRIVER" | "CHAUFFEUR";
export type PostCategory = "TRAFFIC" | "SAFETY" | "DEALS" | "AMENITIES" | "GENERAL";
export type CategorySource = "AUTO" | "MANUAL";

// Core Entities
export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  points: number;
  level: UserLevel;
  currentCity: string | null;
  lastLocation: GeoPoint | null;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
  userTypes?: UserType[];
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  category: PostCategory;
  categorySource: CategorySource;
  location: GeoPoint;
  city: string;
  address: string | null;
  helpfulCount: number;
  commentCount: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  // Joined data
  author?: User;
  pin?: Pin | null;
  media?: PostMedia[];
}

export interface PostMedia {
  id: string;
  postId: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnail: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface Pin {
  id: string;
  postId: string;
  category: PostCategory;
  location: GeoPoint;
  city: string;
  isActive: boolean;
  confirmationCount: number;
  lastConfirmedAt: string | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  content: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  // Joined data
  author?: User;
  replies?: Comment[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Feed Types
export interface FeedFilters {
  city?: string;
  category?: PostCategory;
  userId?: string;
}

// Map Types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}
