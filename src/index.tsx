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

// Get user profile
app.get('/api/user/:id/profile', async (c) => {
  const { env } = c
  const userId = c.req.param('id')

  try {
    const user = await env.DB.prepare(`
      SELECT id, email, name, avatar_url, role, created_at, last_login, is_active
      FROM users WHERE id = ?
    `).bind(userId).first()

    return c.json(user)
  } catch (error) {
    return c.json({ error: 'Failed to fetch user profile' }, 500)
  }
})

// Get DMO activities
app.get('/api/user/:id/dmo', async (c) => {
  const { env } = c
  const userId = c.req.param('id')
  const date = c.req.query('date') || new Date().toISOString().split('T')[0]

  try {
    const activities = await env.DB.prepare(`
      SELECT * FROM dmo_activities 
      WHERE user_id = ? AND activity_date = ?
      ORDER BY activity_type
    `).bind(userId, date).all()

    return c.json(activities)
  } catch (error) {
    return c.json({ error: 'Failed to fetch DMO activities' }, 500)
  }
})

// Update DMO activity
app.post('/api/user/:id/dmo', async (c) => {
  const { env } = c
  const userId = c.req.param('id')
  const { activity_type, target_count, completed_count, notes, activity_date } = await c.req.json()

  try {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO dmo_activities 
      (user_id, activity_date, activity_type, target_count, completed_count, notes, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(userId, activity_date, activity_type, target_count, completed_count, notes || '').run()

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update DMO activity' }, 500)
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

app.get('/dmo', async (c) => {
  const { env } = c
  const userId = 1 // Demo user
  const today = new Date().toISOString().split('T')[0]

  try {
    // Get today's DMO activities
    const activities = await env.DB.prepare(`
      SELECT * FROM dmo_activities 
      WHERE user_id = ? AND activity_date = ?
      ORDER BY activity_type
    `).bind(userId, today).all()

    const activityTypes = [
      { type: 'prospecting', label: 'Prospecting', icon: 'fa-search', color: 'blue' },
      { type: 'follow_up', label: 'Follow Up', icon: 'fa-phone', color: 'green' },
      { type: 'presentation', label: 'Presentations', icon: 'fa-presentation', color: 'purple' },
      { type: 'content_creation', label: 'Content Creation', icon: 'fa-edit', color: 'orange' }
    ]

    return c.render(
      <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Daily Method Operations (DMO)</h1>
              <p class="text-gray-600 mt-2">Track your daily business-building activities</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-indigo-600">{new Date().toLocaleDateString()}</div>
              <div class="text-sm text-gray-500">Today's Date</div>
            </div>
          </div>

          {/* DMO Progress Cards */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {activityTypes.map(actType => {
              const activity = activities.results?.find((a: any) => a.activity_type === actType.type)
              const completed = activity?.completed_count || 0
              const target = activity?.target_count || 0
              const percentage = target > 0 ? Math.round((completed / target) * 100) : 0
              const isCompleted = completed >= target && target > 0

              return (
                <div class={`bg-white rounded-lg shadow-lg p-6 border-l-4 border-${actType.color}-500`}>
                  <div class="flex items-center justify-between mb-4">
                    <div class={`p-3 rounded-lg bg-${actType.color}-100`}>
                      <i class={`fas ${actType.icon} text-${actType.color}-600 text-xl`}></i>
                    </div>
                    <div class={`dmo-circle ${isCompleted ? 'completed' : target > 0 ? 'partial' : 'pending'}`}>
                      {percentage}%
                    </div>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{actType.label}</h3>
                  <div class="flex justify-between text-sm text-gray-600 mb-3">
                    <span>Completed: {completed}</span>
                    <span>Target: {target}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div class={`bg-${actType.color}-500 h-2 rounded-full transition-all duration-300`} 
                         style={`width: ${Math.min(percentage, 100)}%`}></div>
                  </div>
                  <div class="flex gap-2">
                    <button onclick={`updateDMOActivity('${actType.type}', 'increment')`}
                            class={`flex-1 bg-${actType.color}-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-${actType.color}-700`}>
                      + Add
                    </button>
                    <button onclick={`editDMOActivity('${actType.type}')`}
                            class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Daily Summary */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Today's Summary</h2>
              <div class="space-y-4">
                {activities.results?.map((activity: any) => (
                  <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div class="font-medium text-gray-900 capitalize">
                        {activity.activity_type.replace('_', ' ')}
                      </div>
                      {activity.notes && (
                        <div class="text-sm text-gray-600 mt-1">{activity.notes}</div>
                      )}
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-gray-900">
                        {activity.completed_count}/{activity.target_count}
                      </div>
                      <div class="text-xs text-gray-500">
                        {Math.round((activity.completed_count / activity.target_count) * 100)}%
                      </div>
                    </div>
                  </div>
                )) || (
                  <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-calendar-plus text-2xl mb-2"></i>
                    <p>No activities set for today. Click "Set Goals" to get started!</p>
                  </div>
                )}
              </div>
              <button class="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700">
                Set Daily Goals
              </button>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">This Week's Completion</span>
                  <span class="text-2xl font-bold text-green-600">78%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-green-500 h-3 rounded-full" style="width: 78%"></div>
                </div>
                <div class="mt-4 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Monday</span>
                    <span class="text-green-600">✓ 100%</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tuesday</span>
                    <span class="text-green-600">✓ 95%</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Wednesday</span>
                    <span class="text-green-600">✓ 88%</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Thursday</span>
                    <span class="text-orange-600">○ 65%</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Friday</span>
                    <span class="text-blue-600">→ In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      { title: 'Daily Method (DMO) - Online Empires' }
    )
  } catch (error) {
    return c.text('Failed to load DMO data', 500)
  }
})

app.get('/profile', async (c) => {
  const { env } = c
  const userId = 1 // Demo user

  try {
    // Get user profile
    const user = await env.DB.prepare(`
      SELECT id, email, name, avatar_url, role, created_at, last_login, is_active
      FROM users WHERE id = ?
    `).bind(userId).first() as User | null

    // Get user statistics
    const stats = await env.DB.prepare(`
      SELECT * FROM user_statistics WHERE user_id = ?
    `).bind(userId).first() as UserStatistics | null

    return c.render(
      <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div class="lg:col-span-2">
              <div class="bg-white rounded-lg shadow p-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <img src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=100'} 
                         alt="Profile" class="w-16 h-16 rounded-full mr-4" />
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">{user?.name || 'Ashley Kemp'}</h3>
                      <p class="text-gray-600">{user?.email || 'ashley.kemp@example.com'}</p>
                      <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mt-1">
                        {user?.role || 'user'}
                      </span>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={user?.name || 'Ashley Kemp'} 
                             class="w-full p-3 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={user?.email || 'ashley.kemp@example.com'} 
                             class="w-full p-3 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <button class="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700">
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Account Activity */}
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Account Activity</h2>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600">Member Since</span>
                    <span class="text-gray-900">{new Date(user?.created_at || '2024-01-01').toLocaleDateString()}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600">Last Login</span>
                    <span class="text-gray-900">{user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Today'}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-600">Account Status</span>
                    <span class={`px-2 py-1 text-xs font-semibold rounded-full ${user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div class="space-y-6">
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
                <div class="space-y-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-indigo-600">{stats?.total_courses_completed || 8}</div>
                    <div class="text-sm text-gray-500">Courses Completed</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">${(stats?.total_commissions || 2847).toFixed(2)}</div>
                    <div class="text-sm text-gray-500">Total Earnings</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-orange-600">{stats?.current_streak_days || 12}</div>
                    <div class="text-sm text-gray-500">Day Streak</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">{(stats?.total_learning_hours || 45.5).toFixed(1)}h</div>
                    <div class="text-sm text-gray-500">Learning Time</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div class="space-y-2">
                  <button class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    <i class="fas fa-key mr-2"></i>
                    Change Password
                  </button>
                  <button class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    <i class="fas fa-bell mr-2"></i>
                    Notification Settings
                  </button>
                  <button class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    <i class="fas fa-download mr-2"></i>
                    Download Data
                  </button>
                  <button class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                    <i class="fas fa-trash mr-2"></i>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      { title: 'Profile - Online Empires' }
    )
  } catch (error) {
    return c.text('Failed to load profile', 500)
  }
})

export default app
