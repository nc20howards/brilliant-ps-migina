export enum PostCategory {
  ANNOUNCEMENT = 'Announcement',
  EVENT = 'Event',
  REUNION = 'Reunion',
  NEWS = 'News'
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  category: PostCategory;
  author: string;
  imageUrl?: string;
}

export interface StudentPerformance {
  id: string;
  year: number;
  studentName: string;
  grade: string; // e.g., "12th Grade"
  agg: number;
  achievements: string; // "Best in Math", "Valedictorian"
  photoUrl?: string;
}

export interface SiteSettings {
  schoolName: string;
  logoUrl: string | null;
  marqueeText: string;
  heroImages: string[];
}

export interface User {
  username: string;
  role: 'admin' | 'guest';
}

export interface Testimonial {
  id: string;
  userName: string;
  userClass: string; // e.g., "Class of 2015"
  userPhoto?: string;
  content: string;
  rating: number; // 1-5
  date: string;
}