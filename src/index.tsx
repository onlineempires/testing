import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { Bindings, User, UserStatistics, Course, Lead, AffiliateCommission, UserAchievement, Expert } from './types'

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Use JSX renderer
app.use(renderer)

// Dashboard route
app.get('/', async (c) => {
  const { env } = c

  // Get user data (hardcoded for demo - Ashley Kemp)
  const userId = 1
  
  try {
    // Get user statistics
    const stats = await env.DB.prepare(`
      SELECT * FROM user_statistics WHERE user_id = ?
    `).bind(userId).first() as UserStatistics | null

    // Get user info
    const user = await env.DB.prepare(`
      SELECT id, name, email, avatar_url FROM users WHERE id = ?
    `).bind(userId).first() as User | null

    // Get course progress
    const enrollments = await env.DB.prepare(`
      SELECT ue.*, c.title, c.thumbnail_url 
      FROM user_enrollments ue 
      JOIN courses c ON ue.course_id = c.id 
      WHERE ue.user_id = ?
      ORDER BY ue.enrolled_at DESC
    `).bind(userId).all()

    // Get recent achievements
    const achievements = await env.DB.prepare(`
      SELECT * FROM user_achievements 
      WHERE user_id = ? 
      ORDER BY earned_at DESC 
      LIMIT 3
    `).bind(userId).all()

    // Get lead count
    const leadCount = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM leads WHERE user_id = ?
    `).bind(userId).first() as { count: number }

    return c.render(
      <div class="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav class="bg-white shadow-sm border-b">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex items-center">
                <h1 class="text-2xl font-bold text-indigo-600">Online Empires</h1>
              </div>
              <div class="flex items-center space-x-4">
                <img src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=40'} 
                     alt="Profile" class="w-8 h-8 rounded-full" />
                <span class="text-gray-700">{user?.name || 'Ashley Kemp'}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Navigation */}
        <div class="flex">
          <div class="w-64 bg-white shadow-sm h-screen sticky top-0">
            <div class="p-6">
              <nav class="space-y-2">
                <a href="/" class="bg-indigo-50 text-indigo-700 flex items-center px-4 py-2 text-sm font-medium rounded-md">
                  <i class="fas fa-tachometer-alt mr-3"></i>
                  Dashboard
                </a>
                <a href="/courses" class="text-gray-600 hover:bg-gray-50 flex items-center px-4 py-2 text-sm font-medium rounded-md">
                  <i class="fas fa-graduation-cap mr-3"></i>
                  All Courses
                </a>
                <a href="/experts" class="text-gray-600 hover:bg-gray-50 flex items-center px-4 py-2 text-sm font-medium rounded-md">
                  <i class="fas fa-users mr-3"></i>
                  Expert Directory
                </a>
                <a href="/dmo" class="text-gray-600 hover:bg-gray-50 flex items-center px-4 py-2 text-sm font-medium rounded-md">
                  <i class="fas fa-calendar-check mr-3"></i>
                  Daily Method (DMO)
                </a>
                <a href="/affiliate" class="text-gray-600 hover:bg-gray-50 flex items-center px-4 py-2 text-sm font-medium rounded-md">
                  <i class="fas fa-handshake mr-3"></i>
                  Affiliate Portal
                </a>
                <a href="/statistics" class="text-gray-600 hover:bg-gray-50 flex items-center px-4 py-2 text-sm font-medium rounded-md">
                  <i class="fas fa-chart-bar mr-3"></i>
                  Statistics
                </a>
                <a href="/leads" class="text-gray-600 hover:bg-gray-50 flex items-center px-4 py-2 text-sm font-medium rounded-md">
                  <i class="fas fa-user-plus mr-3"></i>
                  Leads
                </a>
                <a href="/profile" class="text-gray-600 hover:bg-gray-50 flex items-center px-4 py-2 text-sm font-medium rounded-md">
                  <i class="fas fa-user mr-3"></i>
                  Profile
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div class="flex-1 p-8">
            {/* Welcome Section */}
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Hello, {user?.name || 'Ashley Kemp'}!</h2>
              <p class="text-gray-600">Welcome back to Online Empires! Ready to build your empire?</p>
            </div>

            {/* Stats Cards */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <i class="fas fa-graduation-cap text-indigo-600 text-2xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Courses Completed</p>
                    <p class="text-2xl font-bold text-gray-900">{stats?.total_courses_completed || 8}/15</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <i class="fas fa-fire text-orange-500 text-2xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Learning Streak</p>
                    <p class="text-2xl font-bold text-gray-900">{stats?.current_streak_days || 12} days</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <i class="fas fa-dollar-sign text-green-500 text-2xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500">Commissions Earned</p>
                    <p class="text-2xl font-bold text-gray-900">${stats?.total_commissions?.toFixed(2) || '2,847.00'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Your Journey */}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Continue Your Journey</h3>
                <div class="space-y-4">
                  <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=80" alt="TikTok" class="w-16 h-16 rounded-lg object-cover" />
                    <div class="ml-4 flex-grow">
                      <h4 class="font-semibold text-gray-900">TikTok Mastery</h4>
                      <p class="text-sm text-gray-600 mb-2">Module 3: Advanced Strategies - Lesson 2: Viral Content Creation</p>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style="width: 67%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Start Here</h3>
                <div class="space-y-4">
                  <div class="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 class="font-semibold text-indigo-900 mb-2">The Business Blueprint</h4>
                    <p class="text-sm text-indigo-700 mb-3">Master the fundamentals of building an online empire from scratch.</p>
                    <button class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                      Start Course
                    </button>
                  </div>
                  <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 class="font-semibold text-green-900 mb-2">The Discovery Process</h4>
                    <p class="text-sm text-green-700 mb-3">Discover your unique strengths and market opportunities.</p>
                    <button class="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                      Start Course
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements & Quick Stats */}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div class="space-y-3">
                  <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                    <i class="fas fa-trophy text-yellow-500 mr-3"></i>
                    <div>
                      <p class="font-medium text-gray-900">Completed "Facebook Advertising Mastery" course</p>
                      <p class="text-sm text-gray-600">Earned 100 points</p>
                    </div>
                  </div>
                  <div class="flex items-center p-3 bg-orange-50 rounded-lg">
                    <i class="fas fa-fire text-orange-500 mr-3"></i>
                    <div>
                      <p class="font-medium text-gray-900">Achieved 7-day learning streak</p>
                      <p class="text-sm text-gray-600">Keep up the momentum!</p>
                    </div>
                  </div>
                  <div class="flex items-center p-3 bg-green-50 rounded-lg">
                    <i class="fas fa-star text-green-500 mr-3"></i>
                    <div>
                      <p class="font-medium text-gray-900">Earned $500+ in commissions this week</p>
                      <p class="text-sm text-gray-600">You're on fire!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">New Leads</span>
                    <span class="text-2xl font-bold text-indigo-600">{leadCount?.count || 47}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Course Progress</span>
                    <span class="text-lg font-semibold text-gray-900">67% Complete</span>
                  </div>
                  <div class="pt-4">
                    <button class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700">
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      { title: 'Dashboard - Online Empires' }
    )
  } catch (error) {
    console.error('Database error:', error)
    return c.text('Database not ready. Please run migrations first.', 500)
  }
})

// API Routes

// Get user statistics
app.get('/api/user/:id/stats', async (c) => {
  const { env } = c
  const userId = c.req.param('id')

  try {
    const stats = await env.DB.prepare(`
      SELECT * FROM user_statistics WHERE user_id = ?
    `).bind(userId).first()

    return c.json(stats)
  } catch (error) {
    return c.json({ error: 'Failed to fetch user statistics' }, 500)
  }
})

// Get user courses
app.get('/api/user/:id/courses', async (c) => {
  const { env } = c
  const userId = c.req.param('id')

  try {
    const courses = await env.DB.prepare(`
      SELECT ue.*, c.title, c.description, c.thumbnail_url, c.category, c.level
      FROM user_enrollments ue 
      JOIN courses c ON ue.course_id = c.id 
      WHERE ue.user_id = ?
      ORDER BY ue.enrolled_at DESC
    `).bind(userId).all()

    return c.json(courses)
  } catch (error) {
    return c.json({ error: 'Failed to fetch user courses' }, 500)
  }
})

// Get user leads
app.get('/api/user/:id/leads', async (c) => {
  const { env } = c
  const userId = c.req.param('id')

  try {
    const leads = await env.DB.prepare(`
      SELECT * FROM leads WHERE user_id = ? ORDER BY created_at DESC
    `).bind(userId).all()

    return c.json(leads)
  } catch (error) {
    return c.json({ error: 'Failed to fetch leads' }, 500)
  }
})

// Get user commissions
app.get('/api/user/:id/commissions', async (c) => {
  const { env } = c
  const userId = c.req.param('id')

  try {
    const commissions = await env.DB.prepare(`
      SELECT * FROM affiliate_commissions WHERE user_id = ? ORDER BY earned_at DESC
    `).bind(userId).all()

    return c.json(commissions)
  } catch (error) {
    return c.json({ error: 'Failed to fetch commissions' }, 500)
  }
})

// Get all courses
app.get('/api/courses', async (c) => {
  const { env } = c

  try {
    const courses = await env.DB.prepare(`
      SELECT c.*, u.name as instructor_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.is_published = 1
      ORDER BY c.created_at DESC
    `).all()

    return c.json(courses)
  } catch (error) {
    return c.json({ error: 'Failed to fetch courses' }, 500)
  }
})

// Get experts
app.get('/api/experts', async (c) => {
  const { env } = c

  try {
    const experts = await env.DB.prepare(`
      SELECT e.*, u.name, u.avatar_url
      FROM experts e
      JOIN users u ON e.user_id = u.id
      ORDER BY e.rating DESC, e.total_reviews DESC
    `).all()

    return c.json(experts)
  } catch (error) {
    return c.json({ error: 'Failed to fetch experts' }, 500)
  }
})

// Simple route pages (will expand these later)
app.get('/courses', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">All Courses</h1>
        <div id="courses-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">Loading courses...</p>
          </div>
        </div>
      </div>
    </div>,
    { title: 'All Courses - Online Empires' }
  )
})

app.get('/experts', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Expert Directory</h1>
        <div id="experts-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">Loading experts...</p>
          </div>
        </div>
      </div>
    </div>,
    { title: 'Expert Directory - Online Empires' }
  )
})

app.get('/leads', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Leads Management</h1>
        <div id="leads-container">
          <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">Loading leads...</p>
          </div>
        </div>
      </div>
    </div>,
    { title: 'Leads - Online Empires' }
  )
})

app.get('/affiliate', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Affiliate Portal</h1>
        <div id="affiliate-container">
          <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">Loading affiliate data...</p>
          </div>
        </div>
      </div>
    </div>,
    { title: 'Affiliate Portal - Online Empires' }
  )
})

app.get('/statistics', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Statistics</h1>
        <div id="statistics-container">
          <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">Loading statistics...</p>
          </div>
        </div>
      </div>
    </div>,
    { title: 'Statistics - Online Empires' }
  )
})

app.get('/dmo', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Daily Method Operations (DMO)</h1>
        <div id="dmo-container">
          <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">Loading DMO data...</p>
          </div>
        </div>
      </div>
    </div>,
    { title: 'Daily Method (DMO) - Online Empires' }
  )
})

app.get('/profile', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        <div id="profile-container">
          <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">Loading profile...</p>
          </div>
        </div>
      </div>
    </div>,
    { title: 'Profile - Online Empires' }
  )
})

export default app
