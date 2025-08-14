export type Bindings = {
  DB: D1Database;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'expert';
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  category?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  price: number;
  instructor_id: number;
  thumbnail_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
}

export interface CourseLesson {
  id: number;
  module_id: number;
  title: string;
  content?: string;
  video_url?: string;
  duration_minutes: number;
  order_index: number;
  created_at: string;
}

export interface UserEnrollment {
  id: number;
  user_id: number;
  course_id: number;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
}

export interface UserStatistics {
  id: number;
  user_id: number;
  total_courses_completed: number;
  total_learning_hours: number;
  current_streak_days: number;
  longest_streak_days: number;
  total_commissions: number;
  last_activity_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  source: 'facebook' | 'google' | 'tiktok' | 'referral' | 'organic';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes?: string;
  assigned_to?: number;
  estimated_value?: number;
  converted_value?: number;
  created_at: string;
  updated_at: string;
}

export interface AffiliateCommission {
  id: number;
  user_id: number;
  lead_id?: number;
  commission_type: 'course_sale' | 'referral' | 'lead_generation';
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  description?: string;
  earned_at: string;
  paid_at?: string;
}

export interface Expert {
  id: number;
  user_id: number;
  expertise_areas: string; // JSON string
  bio?: string;
  hourly_rate?: number;
  availability_status: 'available' | 'busy' | 'unavailable';
  rating: number;
  total_reviews: number;
  languages?: string; // JSON string
  timezone?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_type: 'course_completed' | 'streak_milestone' | 'commission_milestone';
  achievement_title: string;
  achievement_description?: string;
  points: number;
  earned_at: string;
}

export interface DMOActivity {
  id: number;
  user_id: number;
  activity_date: string;
  activity_type: 'prospecting' | 'follow_up' | 'presentation' | 'content_creation';
  target_count: number;
  completed_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}