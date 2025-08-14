-- Online Empires Seed Data

-- Insert test users
INSERT OR IGNORE INTO users (id, email, name, password_hash, role, avatar_url) VALUES 
  (1, 'ashley.kemp@example.com', 'Ashley Kemp', '$2a$10$example_hash_1', 'user', 'https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=150'),
  (2, 'john.expert@example.com', 'John Expert', '$2a$10$example_hash_2', 'expert', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
  (3, 'admin@example.com', 'Admin User', '$2a$10$example_hash_3', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');

-- Insert test courses
INSERT OR IGNORE INTO courses (id, title, description, category, level, duration_hours, price, instructor_id, thumbnail_url, is_published) VALUES 
  (1, 'TikTok Mastery', 'Master the art of TikTok marketing and viral content creation', 'Social Media', 'intermediate', 8, 197.00, 2, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300', 1),
  (2, 'The Business Blueprint', 'Master the fundamentals of building an online empire from scratch', 'Business', 'beginner', 12, 297.00, 2, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300', 1),
  (3, 'The Discovery Process', 'Discover your unique strengths and market opportunities', 'Personal Development', 'beginner', 6, 97.00, 2, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300', 1),
  (4, 'Facebook Advertising Mastery', 'Advanced Facebook advertising strategies for maximum ROI', 'Marketing', 'advanced', 10, 397.00, 2, 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300', 1),
  (5, 'Next Steps', 'Your roadmap to scaling and growing your online business', 'Business', 'intermediate', 15, 497.00, 2, 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300', 1);

-- Insert course modules
INSERT OR IGNORE INTO course_modules (id, course_id, title, description, order_index) VALUES 
  (1, 1, 'TikTok Foundations', 'Getting started with TikTok marketing', 1),
  (2, 1, 'Content Strategy', 'Developing a winning content strategy', 2),
  (3, 1, 'Advanced Strategies', 'Advanced TikTok marketing techniques', 3),
  (4, 2, 'Business Fundamentals', 'Core business building principles', 1),
  (5, 2, 'Marketing Systems', 'Building effective marketing systems', 2),
  (6, 3, 'Self Assessment', 'Understanding your strengths and weaknesses', 1),
  (7, 3, 'Market Research', 'Finding your ideal market', 2);

-- Insert course lessons
INSERT OR IGNORE INTO course_lessons (id, module_id, title, content, duration_minutes, order_index) VALUES 
  (1, 3, 'Viral Content Creation', 'Learn the secrets of creating viral TikTok content', 45, 2),
  (2, 1, 'Setting Up Your Profile', 'Optimize your TikTok profile for success', 30, 1),
  (3, 2, 'Content Planning', 'Plan your content calendar effectively', 40, 1),
  (4, 4, 'Online Business Models', 'Different ways to make money online', 60, 1),
  (5, 5, 'Lead Generation Systems', 'Build systems that generate leads automatically', 50, 1);

-- Insert user enrollments
INSERT OR IGNORE INTO user_enrollments (user_id, course_id, progress_percentage) VALUES 
  (1, 1, 67.00),
  (1, 2, 80.00),
  (1, 3, 100.00),
  (1, 4, 100.00),
  (1, 5, 25.00);

-- Insert user lesson progress
INSERT OR IGNORE INTO user_lesson_progress (user_id, lesson_id, completed, completed_at, time_spent_minutes) VALUES 
  (1, 1, 0, NULL, 15),
  (1, 2, 1, '2024-08-10 10:30:00', 30),
  (1, 3, 1, '2024-08-11 14:20:00', 40),
  (1, 4, 1, '2024-08-12 09:15:00', 60),
  (1, 5, 1, '2024-08-13 16:45:00', 50);

-- Insert user achievements
INSERT OR IGNORE INTO user_achievements (user_id, achievement_type, achievement_title, achievement_description, points, earned_at) VALUES 
  (1, 'course_completed', 'Facebook Advertising Mastery', 'Completed "Facebook Advertising Mastery" course', 100, '2024-08-13 18:00:00'),
  (1, 'streak_milestone', '7-Day Learning Streak', 'Achieved 7-day learning streak', 50, '2024-08-12 12:00:00'),
  (1, 'commission_milestone', '$500+ Commission Week', 'Earned $500+ in commissions this week', 75, '2024-08-14 09:00:00');

-- Insert user statistics
INSERT OR IGNORE INTO user_statistics (user_id, total_courses_completed, total_learning_hours, current_streak_days, longest_streak_days, total_commissions, last_activity_date) VALUES 
  (1, 8, 45.5, 12, 15, 2847.00, '2024-08-14');

-- Insert test leads
INSERT OR IGNORE INTO leads (user_id, name, email, phone, source, status, estimated_value, assigned_to) VALUES 
  (1, 'Sarah Johnson', 'sarah.j@example.com', '+1-555-0123', 'facebook', 'qualified', 500.00, 2),
  (1, 'Mike Chen', 'mike.chen@example.com', '+1-555-0124', 'tiktok', 'new', 300.00, NULL),
  (1, 'Lisa Rodriguez', 'lisa.r@example.com', '+1-555-0125', 'google', 'contacted', 750.00, 2),
  (1, 'David Kim', 'david.kim@example.com', '+1-555-0126', 'referral', 'converted', 1200.00, 2),
  (1, 'Emma Wilson', 'emma.w@example.com', '+1-555-0127', 'organic', 'new', 400.00, NULL);

-- Insert affiliate commissions
INSERT OR IGNORE INTO affiliate_commissions (user_id, commission_type, amount, status, description, earned_at) VALUES 
  (1, 'course_sale', 150.00, 'paid', 'Commission from TikTok Mastery course sale', '2024-08-10 14:30:00'),
  (1, 'referral', 75.00, 'approved', 'Referral commission from new user signup', '2024-08-11 09:15:00'),
  (1, 'lead_generation', 250.00, 'pending', 'Lead generation commission', '2024-08-12 16:45:00'),
  (1, 'course_sale', 200.00, 'paid', 'Commission from Business Blueprint sale', '2024-08-13 11:20:00');

-- Insert expert profile
INSERT OR IGNORE INTO experts (user_id, expertise_areas, bio, hourly_rate, rating, total_reviews, languages, timezone) VALUES 
  (2, '["Digital Marketing", "TikTok Marketing", "Business Strategy", "Lead Generation"]', 'Experienced digital marketing expert with over 10 years in the industry. Specialized in social media marketing and business growth strategies.', 150.00, 4.85, 127, '["English", "Spanish"]', 'America/New_York');

-- Insert DMO activities
INSERT OR IGNORE INTO dmo_activities (user_id, activity_date, activity_type, target_count, completed_count, notes) VALUES 
  (1, '2024-08-14', 'prospecting', 20, 15, 'Focused on TikTok outreach'),
  (1, '2024-08-14', 'follow_up', 10, 8, 'Called existing leads'),
  (1, '2024-08-14', 'content_creation', 3, 2, 'Created TikTok videos'),
  (1, '2024-08-13', 'prospecting', 20, 20, 'Completed daily prospecting goal'),
  (1, '2024-08-13', 'follow_up', 10, 10, 'All follow-ups completed');