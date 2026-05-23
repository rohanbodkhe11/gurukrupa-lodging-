// Shared Type Definitions for Gurukrupa Lodging

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  type: 'Single' | 'Double' | 'Family';
  ac: boolean;
  capacity: number;
  price: number;
  amenities: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  status: 'Available' | 'Maintenance';
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsCount: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled';
  paymentId?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  roomId: string;
  roomName: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  approved: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  isBlocked: boolean;
  registeredAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  aboutText: string;
  mission: string;
  vision: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'admin' | 'system';
  date: string;
  read: boolean;
}
