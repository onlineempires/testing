import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'
import { Bindings } from './types'

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Use JSX renderer
app.use(renderer)

// Helper function to safely get database data
async function safeDBQuery(db: any, query: string, params: any[] = []) {
  try {
    if (params.length > 0) {
      return await db.prepare(query).bind(...params).all()
    } else {
      return await db.prepare(query).all()
    }
  } catch (error) {
    console.error('Database query error:', error)
    return { success: false, results: [] }
  }
}

// Dashboard route
app.get('/', async (c) => {
  const { env } = c
  const userId = 1

  try {
    // Get user statistics with fallback
    let stats = null
    let user = null
    let leadCount = { count: 5 }

    if (env.DB) {
      const statsResult = await safeDBQuery(env.DB, 'SELECT * FROM user_statistics WHERE user_id = ?', [userId])
      stats = statsResult.results?.[0] || null

      const userResult = await safeDBQuery(env.DB, 'SELECT id, name, email, avatar_url FROM users WHERE id = ?', [userId])
      user = userResult.results?.[0] || null

      const leadResult = await safeDBQuery(env.DB, 'SELECT COUNT(*) as count FROM leads WHERE user_id = ?', [userId])
      leadCount = leadResult.results?.[0] || { count: 5 }
    }

    // Use fallback data if database queries fail
    const userName = user?.name || 'Ashley Kemp'
    const userAvatar = user?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=150'
    const coursesCompleted = stats?.total_courses_completed || 8
    const streakDays = stats?.current_streak_days || 12
    const totalCommissions = stats?.total_commissions || 2847.00
    const newLeads = leadCount?.count || 47

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
                <img src={userAvatar} alt="Profile" class="w-8 h-8 rounded-full" />
                <span class="text-gray-700">{userName}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div class="flex">
          {/* Sidebar Navigation */}
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

          {/* Main Dashboard Content */}
          <div class="flex-1 p-8">
            {/* Welcome Section */}
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Hello, {userName}!</h2>
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
                    <p class="text-2xl font-bold text-gray-900">{coursesCompleted}/15</p>
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
                    <p class="text-2xl font-bold text-gray-900">{streakDays} days</p>
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
                    <p class="text-2xl font-bold text-gray-900">${totalCommissions.toFixed(2)}</p>
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
                    <span class="text-2xl font-bold text-indigo-600">{newLeads}</span>
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
    console.error('Dashboard error:', error)
    return c.text('Error loading dashboard. Please try again.', 500)
  }
})

// API Routes with proper error handling
app.get('/api/user/:id/stats', async (c) => {
  const { env } = c
  const userId = c.req.param('id')

  try {
    if (!env.DB) {
      return c.json({ 
        id: 1,
        user_id: parseInt(userId),
        total_courses_completed: 8,
        total_learning_hours: 45.5,
        current_streak_days: 12,
        longest_streak_days: 15,
        total_commissions: 2847.00,
        last_activity_date: '2024-08-14'
      })
    }

    const stats = await env.DB.prepare(`
      SELECT * FROM user_statistics WHERE user_id = ?
    `).bind(userId).first()

    return c.json(stats || {
      id: 1,
      user_id: parseInt(userId),
      total_courses_completed: 8,
      total_learning_hours: 45.5,
      current_streak_days: 12,
      longest_streak_days: 15,
      total_commissions: 2847.00,
      last_activity_date: '2024-08-14'
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return c.json({ error: 'Failed to fetch user statistics' }, 500)
  }
})

app.get('/api/courses', async (c) => {
  const { env } = c

  try {
    if (!env.DB) {
      return c.json([
        {
          id: 1,
          title: 'TikTok Mastery',
          description: 'Master the art of TikTok marketing and viral content creation',
          category: 'Social Media',
          level: 'intermediate',
          duration_hours: 8,
          price: 197.00,
          thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300',
          instructor_name: 'John Expert'
        },
        {
          id: 2,
          title: 'The Business Blueprint',
          description: 'Master the fundamentals of building an online empire from scratch',
          category: 'Business',
          level: 'beginner',
          duration_hours: 12,
          price: 297.00,
          thumbnail_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
          instructor_name: 'John Expert'
        }
      ])
    }

    const courses = await env.DB.prepare(`
      SELECT c.*, u.name as instructor_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.is_published = 1
      ORDER BY c.created_at DESC
    `).all()

    return c.json(courses.results || [])
  } catch (error) {
    console.error('Courses API error:', error)
    return c.json({ error: 'Failed to fetch courses' }, 500)
  }
})

// Simple route pages
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
        <div class="mt-8">
          <a href="/" class="text-indigo-600 hover:text-indigo-800">← Back to Dashboard</a>
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" alt="Expert" class="w-20 h-20 rounded-full mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">John Expert</h3>
            <div class="flex justify-center items-center mb-2">
              <div class="flex text-yellow-400 mr-2">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
              </div>
              <span class="text-sm text-gray-600">4.85 (127 reviews)</span>
            </div>
            <p class="text-gray-600 text-sm mb-4">Digital marketing expert with 10+ years experience</p>
            <div class="mb-4">
              <span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-1">Digital Marketing</span>
              <span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">TikTok Marketing</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-semibold text-gray-900">$150.00/hr</span>
              <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Available</span>
            </div>
            <button class="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700">
              Contact Expert
            </button>
          </div>
        </div>
        <div class="mt-8">
          <a href="/" class="text-indigo-600 hover:text-indigo-800">← Back to Dashboard</a>
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
        <div class="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Your Leads</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-gray-900">Sarah Johnson</h4>
                  <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Qualified</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">sarah.j@example.com</p>
                <p class="text-sm text-gray-500 mb-2">Source: Facebook</p>
                <p class="text-sm font-semibold text-gray-900">Est. Value: $500.00</p>
              </div>
              <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-gray-900">Mike Chen</h4>
                  <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">New</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">mike.chen@example.com</p>
                <p class="text-sm text-gray-500 mb-2">Source: TikTok</p>
                <p class="text-sm font-semibold text-gray-900">Est. Value: $300.00</p>
              </div>
              <div class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-gray-900">Lisa Rodriguez</h4>
                  <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Contacted</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">lisa.r@example.com</p>
                <p class="text-sm text-gray-500 mb-2">Source: Google</p>
                <p class="text-sm font-semibold text-gray-900">Est. Value: $750.00</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <a href="/" class="text-indigo-600 hover:text-indigo-800">← Back to Dashboard</a>
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
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-dollar-sign text-green-500 text-2xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Earnings</p>
                <p class="text-2xl font-bold text-gray-900">$2,847.00</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-clock text-yellow-500 text-2xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Pending</p>
                <p class="text-2xl font-bold text-gray-900">$250.00</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-chart-line text-indigo-500 text-2xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">This Month</p>
                <p class="text-2xl font-bold text-gray-900">$675.00</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <a href="/" class="text-indigo-600 hover:text-indigo-800">← Back to Dashboard</a>
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
            <div class="text-center">
              <div class="text-4xl font-bold text-indigo-600 mb-2">67%</div>
              <p class="text-gray-600">Overall Progress</p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Courses Completed</span>
                <span class="font-semibold">8</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Learning Hours</span>
                <span class="font-semibold">45.5h</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Commissions</span>
                <span class="font-semibold">$2,847</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <a href="/" class="text-indigo-600 hover:text-indigo-800">← Back to Dashboard</a>
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-lg bg-blue-100">
                <i class="fas fa-search text-blue-600 text-xl"></i>
              </div>
              <div class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                75%
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Prospecting</h3>
            <div class="flex justify-between text-sm text-gray-600 mb-3">
              <span>Completed: 15</span>
              <span>Target: 20</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full" style="width: 75%"></div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-lg bg-green-100">
                <i class="fas fa-phone text-green-600 text-xl"></i>
              </div>
              <div class="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                80%
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Follow Up</h3>
            <div class="flex justify-between text-sm text-gray-600 mb-3">
              <span>Completed: 8</span>
              <span>Target: 10</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: 80%"></div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-lg bg-purple-100">
                <i class="fas fa-presentation text-purple-600 text-xl"></i>
              </div>
              <div class="bg-gray-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                0%
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Presentations</h3>
            <div class="flex justify-between text-sm text-gray-600 mb-3">
              <span>Completed: 0</span>
              <span>Target: 2</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-purple-500 h-2 rounded-full" style="width: 0%"></div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-lg bg-orange-100">
                <i class="fas fa-edit text-orange-600 text-xl"></i>
              </div>
              <div class="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                67%
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Content Creation</h3>
            <div class="flex justify-between text-sm text-gray-600 mb-3">
              <span>Completed: 2</span>
              <span>Target: 3</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-orange-500 h-2 rounded-full" style="width: 67%"></div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <a href="/" class="text-indigo-600 hover:text-indigo-800">← Back to Dashboard</a>
        </div>
      </div>
    </div>,
    { title: 'Daily Method (DMO) - Online Empires' }
  )
})

app.get('/profile', (c) => {
  return c.render(
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div class="flex items-center mb-6">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=100" alt="Profile" class="w-16 h-16 rounded-full mr-4" />
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Ashley Kemp</h3>
                  <p class="text-gray-600">ashley.kemp@example.com</p>
                  <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mt-1">User</span>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value="Ashley Kemp" class="w-full p-3 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value="ashley.kemp@example.com" class="w-full p-3 border border-gray-300 rounded-md" />
                </div>
              </div>
              <button class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700">
                Update Profile
              </button>
            </div>
          </div>
          <div>
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
              <div class="space-y-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-indigo-600">8</div>
                  <div class="text-sm text-gray-500">Courses Completed</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">$2,847.00</div>
                  <div class="text-sm text-gray-500">Total Earnings</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">12</div>
                  <div class="text-sm text-gray-500">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <a href="/" class="text-indigo-600 hover:text-indigo-800">← Back to Dashboard</a>
        </div>
      </div>
    </div>,
    { title: 'Profile - Online Empires' }
  )
})

export default app