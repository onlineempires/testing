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

// Layout component for consistent design
const Layout = ({ children, title, currentPage }: { children: any, title: string, currentPage: string }) => (
  <div class="min-h-screen bg-gray-50 flex">
    {/* Dark Sidebar */}
    <div class="w-64 bg-slate-800 text-white flex flex-col">
      {/* Logo */}
      <div class="p-6 border-b border-slate-700">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <i class="fas fa-bolt text-white text-base"></i>
          </div>
          <span class="font-bold text-xl">DIGITAL ERA</span>
        </div>
      </div>

      {/* Navigation */}
      <nav class="flex-1 py-6">
        <div class="space-y-2 px-4">
          <a href="/" class={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-tachometer-alt mr-4 w-5 text-lg"></i>
            Dashboard
          </a>
          <a href="/courses" class={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${currentPage === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-graduation-cap mr-4 w-5 text-lg"></i>
            All Courses
          </a>
          <a href="/experts" class={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${currentPage === 'experts' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-users mr-4 w-5 text-lg"></i>
            Expert Directory
          </a>
          <a href="/dmo" class={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${currentPage === 'dmo' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-calendar-check mr-4 w-5 text-lg"></i>
            Daily Method (DMO)
          </a>
          <a href="/affiliate" class={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${currentPage === 'affiliate' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-handshake mr-4 w-5 text-lg"></i>
            Affiliate Portal
          </a>
          <a href="/statistics" class={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${currentPage === 'statistics' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-chart-bar mr-4 w-5 text-lg"></i>
            Statistics
          </a>
          <a href="/leads" class={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${currentPage === 'leads' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-user-plus mr-4 w-5 text-lg"></i>
            Leads
          </a>
          <a href="/profile" class={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${currentPage === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-user mr-4 w-5 text-lg"></i>
            Profile
          </a>
        </div>
      </nav>
    </div>

    {/* Main Content */}
    <div class="flex-1 flex flex-col">
      {/* Top Header */}
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">{title}</h1>
          <div class="flex items-center space-x-4">
            {/* Search Bar */}
            <div class="relative">
              <input 
                type="text" 
                id="searchInput"
                placeholder="Search courses, lessons..."
                class="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            {/* User Menu */}
            <div class="flex items-center space-x-3">
              <a href="https://www.facebook.com/groups/onlineempiresvip" target="_blank" class="p-2 text-gray-400 hover:text-blue-600">
                <i class="fab fa-facebook"></i>
              </a>
              
              {/* Feedback Button */}
              <div class="relative">
                <button id="feedbackBtn" class="p-2 text-gray-400 hover:text-gray-600">
                  <i class="fas fa-comment"></i>
                </button>
{/* Feedback Dropdown */}
                <div id="feedbackDropdown" class="hidden absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-3">Send Feedback</h3>
                    <form id="feedbackForm">
                      <textarea 
                        id="feedbackText" 
                        placeholder="Share your thoughts, suggestions, or report issues..."
                        class="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      ></textarea>
                      <div class="flex justify-end space-x-2 mt-3">
                        <button type="button" id="cancelFeedback" class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">
                          Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                          Send Feedback
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              {/* Notification Bell */}
              <div class="relative">
                <button id="notificationBtn" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200">
                  <i class="fas fa-bell text-lg"></i>
                  <span id="notificationBadge" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
{/* Notifications Dropdown */}
                <div id="notificationsDropdown" class="hidden absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-3">Notifications</h3>
                    <div id="notificationsList" class="space-y-2 max-h-64 overflow-y-auto">
                      <div class="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <p class="text-sm font-medium text-blue-900">New Lead Generated!</p>
                        <p class="text-xs text-blue-700 mt-1">John Smith signed up through your referral link</p>
                        <p class="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                      <div class="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <p class="text-sm font-medium text-green-900">Commission Earned!</p>
                        <p class="text-xs text-green-700 mt-1">$150 commission from Sarah's purchase</p>
                        <p class="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Profile Dropdown */}
              <div class="relative">
                <button id="profileBtn" class="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2">
                  <img id="headerProfileImage" src="https://ui-avatars.com/api/?name=Ashley+Kemp&background=6366f1&color=fff&size=32" alt="Profile" class="w-8 h-8 rounded-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=Ashley+Kemp&background=6366f1&color=fff&size=32'" />
                  <span class="text-sm font-medium text-gray-700">Ashley Kemp</span>
                  <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
                </button>
{/* Profile Dropdown */}
                <div id="profileDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div class="py-2">
                    <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <i class="fas fa-user mr-2"></i>
                      Profile
                    </a>
                    <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <i class="fas fa-cog mr-2"></i>
                      Settings
                    </a>
                    <hr class="my-1" />
                    <a href="/logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <i class="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main class="flex-1 p-6">
        {children}
      </main>
    </div>
  </div>
)

// Dashboard route
app.get('/', async (c) => {
  const { env } = c
  const userId = 1

  try {
    // Get user statistics with fallback
    let stats = null
    let user = null

    if (env.DB) {
      const statsResult = await safeDBQuery(env.DB, 'SELECT * FROM user_statistics WHERE user_id = ?', [userId])
      stats = statsResult.results?.[0] || null

      const userResult = await safeDBQuery(env.DB, 'SELECT id, name, email, avatar_url FROM users WHERE id = ?', [userId])
      user = userResult.results?.[0] || null
    }

    // Use fallback data if database queries fail
    const userName = user?.name || 'Ashley Kemp'
    const coursesCompleted = stats?.total_courses_completed || 8
    const streakDays = stats?.current_streak_days || 12
    const totalCommissions = stats?.total_commissions || 2847
    const newLeads = 47

    return c.render(
      <Layout title="Dashboard" currentPage="dashboard">
        {/* Welcome Banner */}
        <div class="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white mb-8">
          <div class="flex items-center">
            <img src="https://ui-avatars.com/api/?name=Ashley+Kemp&background=6366f1&color=fff&size=64" alt="Ashley" class="w-12 h-12 rounded-full mr-4" />
            <div>
              <h2 class="text-2xl font-bold mb-1">Hello, {userName}!</h2>
              <p class="text-purple-100">Welcome back {userName} to The Digital Era!</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-graduation-cap text-blue-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Courses Completed</p>
                <p class="text-2xl font-bold text-gray-900">{coursesCompleted}/15</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-fire text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Learning Streak</p>
                <p class="text-2xl font-bold text-gray-900">{streakDays} days</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-dollar-sign text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Commissions Earned</p>
                <p class="text-2xl font-bold text-gray-900">${totalCommissions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-user-plus text-purple-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">New Leads</p>
                <p class="text-2xl font-bold text-gray-900">{newLeads}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Your Journey */}
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Continue Your Journey</h3>
            <span class="text-sm text-gray-500">67% Complete</span>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center">
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=64" alt="TikTok Course" class="w-16 h-16 rounded-lg object-cover mr-4" />
              <div class="flex-grow">
                <h4 class="font-semibold text-gray-900 mb-1">TIK-TOK MASTERY</h4>
                <p class="text-sm text-gray-600 mb-3">Module 3: Advanced Strategies - Lesson 2: Viral Content Creation</p>
                <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 67%"></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/1/2'" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 ml-4">
                Continue Learning
              </button>
            </div>
          </div>
        </div>

        {/* Start Here Section */}
        <div>
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Start Here</h3>
          <div class="grid grid-cols-3 gap-6">
            <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400" alt="Business Blueprint" class="w-full h-48 object-cover" />
              <div class="p-6 flex flex-col flex-grow">
                <h4 class="font-semibold text-gray-900 mb-2">The Business Blueprint</h4>
                <p class="text-sm text-gray-600 mb-4 flex-grow">Foundation principles for building your online business</p>
                <p class="text-xs text-gray-500 mb-4">5 modules</p>
                <button onclick="window.location.href='/lesson/1/1'" class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200">
                  Start Course
                </button>
              </div>
            </div>

            <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" alt="Discovery Process" class="w-full h-48 object-cover" />
              <div class="p-6 flex flex-col flex-grow">
                <h4 class="font-semibold text-gray-900 mb-2">The Discovery Process</h4>
                <p class="text-sm text-gray-600 mb-4 flex-grow">Find your niche and identify opportunities</p>
                <p class="text-xs text-gray-500 mb-4">3 modules</p>
                <button onclick="window.location.href='/lesson/3/1'" class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200">
                  Start Course
                </button>
              </div>
            </div>

            <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400" alt="Next Steps" class="w-full h-48 object-cover" />
              <div class="p-6 flex flex-col flex-grow">
                <h4 class="font-semibold text-gray-900 mb-2">Next Steps</h4>
                <p class="text-sm text-gray-600 mb-4 flex-grow">Action plan for immediate implementation</p>
                <p class="text-xs text-gray-500 mb-4">4 modules</p>
                <button onclick="window.location.href='/lesson/3/1'" class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200">
                  Start Course
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements Section */}
        <div class="mt-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">🏆 Recent Achievements</h3>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-check text-white"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Completed "Facebook Advertising Mastery" course</p>
                  <p class="text-sm text-gray-500">Earned 500 XP points</p>
                </div>
              </div>
              
              <div class="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-fire text-white"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Achieved 10-day learning streak</p>
                  <p class="text-sm text-gray-500">Consistency is key to success!</p>
                </div>
              </div>
              
              <div class="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-dollar-sign text-white"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Earned $500 in commissions this week</p>
                  <p class="text-sm text-gray-500">Your business is growing!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>,
      { title: 'Dashboard - Digital Era' }
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return c.text('Error loading dashboard. Please try again.', 500)
  }
})

// All Courses page
app.get('/courses', (c) => {
  return c.render(
    <Layout title="All Courses" currentPage="courses">
      {/* Course Progress Overview */}
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-trophy text-2xl"></i>
            </div>
            <div>
              <p class="text-sm text-green-100">Courses Completed</p>
              <p class="text-2xl font-bold">3/12</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-fire text-2xl"></i>
            </div>
            <div>
              <p class="text-sm text-blue-100">Learning Streak</p>
              <p class="text-2xl font-bold">12 days</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-star text-2xl"></i>
            </div>
            <div>
              <p class="text-sm text-purple-100">XP Points</p>
              <p class="text-2xl font-bold">2,450</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 text-white">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-medal text-2xl"></i>
            </div>
            <div>
              <p class="text-sm text-yellow-100">Level</p>
              <p class="text-2xl font-bold">Expert</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div class="space-y-3">
          <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-check text-white text-sm"></i>
            </div>
            <div class="flex-grow">
              <p class="font-medium text-gray-900">Completed "Facebook Advertising Mastery" course</p>
              <p class="text-sm text-gray-500">Earned 500 XP points</p>
            </div>
            <span class="text-xs text-gray-400">2 days ago</span>
          </div>
          
          <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-fire text-white text-sm"></i>
            </div>
            <div class="flex-grow">
              <p class="font-medium text-gray-900">Achieved 10-day learning streak</p>
              <p class="text-sm text-gray-500">Consistency is key to success!</p>
            </div>
            <span class="text-xs text-gray-400">3 days ago</span>
          </div>
          
          <div class="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-dollar-sign text-white text-sm"></i>
            </div>
            <div class="flex-grow">
              <p class="font-medium text-gray-900">Earned $500 in commissions this week</p>
              <p class="text-sm text-gray-500">Your business is growing!</p>
            </div>
            <span class="text-xs text-gray-400">1 week ago</span>
          </div>
        </div>
      </div>

      {/* Start Here Section */}
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">🚀 Start Here</h3>
        <div class="grid grid-cols-3 gap-6">
          <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400" alt="Business Blueprint" class="w-full h-48 object-cover" />
            <div class="p-6 flex flex-col flex-grow">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">The Business Blueprint</h4>
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">8 Modules</span>
              </div>
              <p class="text-sm text-gray-600 mb-4 flex-grow">Master the fundamentals of building your online empire</p>
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500">Progress</span>
                  <span class="text-xs text-gray-700 font-medium">45 Lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/1/1'" class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200">
                Start Course
              </button>
            </div>
          </div>

          <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" alt="Discovery Process" class="w-full h-48 object-cover" />
            <div class="p-6 flex flex-col flex-grow">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">The Discovery Process</h4>
                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">3 Modules</span>
              </div>
              <p class="text-sm text-gray-600 mb-4 flex-grow">Find your niche and identify opportunities</p>
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500">Progress</span>
                  <span class="text-xs text-gray-700 font-medium">15 Lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" style="width: 30%"></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/2/1'" class="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-200">
                Continue Course
              </button>
            </div>
          </div>

          <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400" alt="Next Steps" class="w-full h-48 object-cover" />
            <div class="p-6 flex flex-col flex-grow">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">Next Steps</h4>
                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">4 Modules</span>
              </div>
              <p class="text-sm text-gray-600 mb-4 flex-grow">Action plan for immediate implementation</p>
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500">Progress</span>
                  <span class="text-xs text-gray-700 font-medium">20 Lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-purple-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/3/1'" class="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200">
                Start Course
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Sales Section */}
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">📱 Social Media & Sales</h3>
        <div class="grid grid-cols-4 gap-6">
          <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" alt="TikTok Mastery" class="w-full h-40 object-cover" />
            <div class="p-4 flex flex-col flex-grow">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900 text-sm">TIK-TOK MASTERY</h4>
                <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">6 Modules</span>
              </div>
              <p class="text-xs text-gray-600 mb-3 flex-grow">Dominate TikTok and grow exponentially</p>
              <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500">67% Complete</span>
                  <span class="text-xs text-gray-700 font-medium">25 Lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-red-600 h-2 rounded-full" style="width: 67%"></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/1/2'" class="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200">
                Continue Course
              </button>
            </div>
          </div>

          <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400" alt="Facebook Ads" class="w-full h-40 object-cover" />
            <div class="p-4 flex flex-col flex-grow">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900 text-sm">Facebook Advertising Mastery</h4>
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">8 Modules</span>
              </div>
              <p class="text-xs text-gray-600 mb-3 flex-grow">Create profitable Facebook ad campaigns</p>
              <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-green-600 font-medium">✓ Completed</span>
                  <span class="text-xs text-gray-700 font-medium">35 Lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" style="width: 100%"></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/4/1'" class="w-full bg-gray-500 text-white py-2 rounded-lg text-sm font-medium">
                Review Course
              </button>
            </div>
          </div>

          <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1580894908361-967195033215?w=400" alt="Instagram Marketing" class="w-full h-40 object-cover" />
            <div class="p-4 flex flex-col flex-grow">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900 text-sm">Instagram Marketing</h4>
                <span class="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">5 Modules</span>
              </div>
              <p class="text-xs text-gray-600 mb-3 flex-grow">Build a powerful Instagram presence</p>
              <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500">Progress</span>
                  <span class="text-xs text-gray-700 font-medium">22 Lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-pink-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/5/1'" class="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-all duration-200">
                Start Course
              </button>
            </div>
          </div>

          <div class="course-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
            <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400" alt="Sales Funnel" class="w-full h-40 object-cover" />
            <div class="p-4 flex flex-col flex-grow">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900 text-sm">Sales Funnel Mastery</h4>
                <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">7 Modules</span>
              </div>
              <p class="text-xs text-gray-600 mb-3 flex-grow">Build high-converting sales funnels</p>
              <div class="mb-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500">Progress</span>
                  <span class="text-xs text-gray-700 font-medium">30 Lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/6/1'" class="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200">
                Start Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>,
    { title: 'All Courses - Digital Era' }
  )
})

// Expert Directory page
app.get('/experts', (c) => {
  return c.render(
    <Layout title="Expert Directory" currentPage="experts">
      <div class="mb-6">
        <p class="text-gray-600">Connect with our top 6A+ Enagic leaders for personalized coaching</p>
      </div>

      <div class="grid grid-cols-3 gap-8">
        {/* Sarah Johnson */}
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=120" alt="Sarah Johnson" class="w-20 h-20 rounded-full mx-auto mb-4" />
          <h3 class="font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
          <p class="text-sm text-blue-600 mb-4">6A3 Leader</p>
          
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-1"></i>
            Los Angeles, CA
          </div>
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-users mr-1"></i>
            500+ Team Members
          </div>
          <div class="flex items-center justify-center text-sm text-blue-600 mb-4">
            <i class="fas fa-trophy mr-1"></i>
            Top Performer 2024
          </div>
          
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            Specializes in team building and leadership development. Sarah has built a massive organization using proven systems and strategies.
          </p>
          
          <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            Book Coaching Call
          </button>
        </div>

        {/* Michael Chen */}
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120" alt="Michael Chen" class="w-20 h-20 rounded-full mx-auto mb-4" />
          <h3 class="font-semibold text-gray-900 mb-1">Michael Chen</h3>
          <p class="text-sm text-blue-600 mb-4">6A2 Leader</p>
          
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-1"></i>
            New York, NY
          </div>
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-users mr-1"></i>
            750+ Team Members
          </div>
          <div class="flex items-center justify-center text-sm text-green-600 mb-4">
            <i class="fas fa-chart-line mr-1"></i>
            Social Media Expert
          </div>
          
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            Digital marketing specialist with expertise in social media strategies and online lead generation for Enagic business.
          </p>
          
          <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            Book Coaching Call
          </button>
        </div>

        {/* Lisa Rodriguez */}
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120" alt="Lisa Rodriguez" class="w-20 h-20 rounded-full mx-auto mb-4" />
          <h3 class="font-semibold text-gray-900 mb-1">Lisa Rodriguez</h3>
          <p class="text-sm text-blue-600 mb-4">6A4 Leader</p>
          
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-1"></i>
            Miami, FL
          </div>
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-users mr-1"></i>
            300+ Team Members
          </div>
          <div class="flex items-center justify-center text-sm text-purple-600 mb-4">
            <i class="fas fa-medal mr-1"></i>
            Sales Champion
          </div>
          
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            Sales and conversation specialist, focusing on helping new distributors overcome sales anxiety.
          </p>
          
          <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            Book Coaching Call
          </button>
        </div>

        {/* Additional experts can be added here */}
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" alt="Jennifer Walsh" class="w-20 h-20 rounded-full mx-auto mb-4" />
          <h3 class="font-semibold text-gray-900 mb-1">Jennifer</h3>
          <p class="text-sm text-blue-600 mb-4">Walsh</p>
          
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-1"></i>
            Dallas, TX
          </div>
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-users mr-1"></i>
            400+ Team Members
          </div>
          <div class="flex items-center justify-center text-sm text-orange-600 mb-4">
            <i class="fas fa-star mr-1"></i>
            Mentor Specialist
          </div>
          
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            Mentoring expert helping distributors develop leadership skills and create sustainable income.
          </p>
          
          <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            Book Coaching Call
          </button>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120" alt="David Kim" class="w-20 h-20 rounded-full mx-auto mb-4" />
          <h3 class="font-semibold text-gray-900 mb-1">David Kim</h3>
          <p class="text-sm text-blue-600 mb-4">6A3 Leader</p>
          
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-map-marker-alt mr-1"></i>
            Seattle, WA
          </div>
          <div class="flex items-center justify-center text-sm text-gray-600 mb-2">
            <i class="fas fa-users mr-1"></i>
            600+ Team Members
          </div>
          <div class="flex items-center justify-center text-sm text-indigo-600 mb-4">
            <i class="fas fa-lightbulb mr-1"></i>
            Innovation Leader
          </div>
          
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            Innovation specialist focusing on cutting-edge marketing strategies and technology integration.
          </p>
          
          <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            Book Coaching Call
          </button>
        </div>
      </div>
    </Layout>,
    { title: 'Expert Directory - Digital Era' }
  )
})

// Course lesson page (example)
app.get('/lesson/:courseId/:lessonId', (c) => {
  const courseId = c.req.param('courseId')
  const lessonId = c.req.param('lessonId')
  
  return c.render(
    <Layout title="ONLINE EMPIRES" currentPage="courses">
      <div class="grid grid-cols-4 gap-6">
        {/* Left Sidebar - Course Progress */}
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="font-semibold text-gray-900 mb-4">Course Progress</h3>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <span class="text-sm font-medium text-gray-900">Module 1</span>
              <span class="text-xs text-green-600 font-medium">Complete</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <span class="text-sm font-medium text-gray-900">Module 2</span>
              <span class="text-xs text-green-600 font-medium">Complete</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
              <span class="text-sm font-medium text-gray-900">Module 3</span>
              <span class="text-xs text-blue-600 font-medium">In Progress</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div class="col-span-3">
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Lesson 2: Viral Content Creation</h2>
            <p class="text-gray-600 mb-6">Learn the secrets to creating TikTok content that goes viral</p>
            
            {/* Video Player */}
            <div class="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-6">
              <div class="text-center text-white">
                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-exclamation text-2xl"></i>
                </div>
                <p class="text-lg font-medium mb-2">Video unavailable</p>
                <p class="text-sm text-gray-300">Watch on YouTube</p>
              </div>
            </div>

            {/* Video Controls */}
            <div class="flex items-center space-x-4 mb-6">
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <i class="fas fa-play mr-2"></i>
                Play
              </button>
              <span class="text-sm text-gray-600">12:45 / 18:30</span>
              <div class="flex-1"></div>
              <button class="text-gray-600 hover:text-gray-900">1x</button>
            </div>
          </div>

          {/* Lesson Notes */}
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 class="font-semibold text-gray-900 mb-4">Lesson Notes</h3>
            
            <div class="space-y-4 text-sm">
              <div>
                <strong class="text-blue-600">Key Takeaway 1:</strong> Hook your audience in the first 3 seconds with a compelling question or visual
              </div>
              <div>
                <strong class="text-blue-600">Key Takeaway 2:</strong> Use trending sounds and hashtags to increase discoverability
              </div>
              <div>
                <strong class="text-blue-600">Key Takeaway 3:</strong> Create content that encourages engagement (comments, shares, saves)
              </div>
              <div>
                <strong class="text-blue-600">Action Item:</strong> Create 3 different hooks for your next TikTok video
              </div>
            </div>

            {/* Navigation */}
            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button class="flex items-center text-gray-600 hover:text-gray-900">
                <i class="fas fa-arrow-left mr-2"></i>
                Previous Lesson
              </button>
              
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input type="checkbox" class="mr-2" />
                  <span class="text-sm text-gray-600">Mark as Complete</span>
                </label>
                <button class="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700">
                  Next Lesson
                  <i class="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>,
    { title: 'Lesson - Digital Era' }
  )
})

// Simple placeholder pages for other routes
app.get('/dmo', (c) => {
  return c.render(
    <Layout title="Daily Method (DMO)" currentPage="dmo">
      <div class="text-center py-20">
        <i class="fas fa-calendar-check text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Daily Method Operations</h2>
        <p class="text-gray-600">Track your daily activities and goals</p>
      </div>
    </Layout>,
    { title: 'Daily Method (DMO) - Digital Era' }
  )
})

app.get('/affiliate', (c) => {
  return c.render(
    <Layout title="Affiliate Portal" currentPage="affiliate">
      <div class="text-center py-20">
        <i class="fas fa-handshake text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Affiliate Portal</h2>
        <p class="text-gray-600">Track your commissions and earnings</p>
      </div>
    </Layout>,
    { title: 'Affiliate Portal - Digital Era' }
  )
})

app.get('/statistics', (c) => {
  return c.render(
    <Layout title="Statistics" currentPage="statistics">
      <div class="text-center py-20">
        <i class="fas fa-chart-bar text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Statistics</h2>
        <p class="text-gray-600">View your performance analytics</p>
      </div>
    </Layout>,
    { title: 'Statistics - Digital Era' }
  )
})

app.get('/leads', (c) => {
  return c.render(
    <Layout title="Leads" currentPage="leads">
      <div class="text-center py-20">
        <i class="fas fa-user-plus text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Leads</h2>
        <p class="text-gray-600">Manage your leads and prospects</p>
      </div>
    </Layout>,
    { title: 'Leads - Digital Era' }
  )
})

app.get('/profile', async (c) => {
  const { env } = c
  const userId = 1

  // Get user data
  let user = null
  if (env.DB) {
    const userResult = await safeDBQuery(env.DB, 'SELECT * FROM users WHERE id = ?', [userId])
    user = userResult.results?.[0] || null
  }

  // Fallback user data
  const userData = user || {
    id: 1,
    name: 'Ashley Kemp',
    email: 'ashley@digitalera.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=150',
    phone: '+1 (555) 123-4567',
    location: 'Los Angeles, CA',
    bio: 'Digital entrepreneur passionate about building online empires and helping others succeed.',
    website: 'https://ashleykemp.com',
    created_at: '2024-01-15',
    notifications_email: true,
    notifications_push: true,
    privacy_profile: 'public'
  }

  return c.render(
    <Layout title="Profile" currentPage="profile">
      <div class="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Profile Settings</h2>
            <button id="saveProfileBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <i class="fas fa-save mr-2"></i>
              Save Changes
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div class="text-center">
              <div class="relative inline-block">
                <img 
                  id="profileImage" 
                  src={userData.avatar_url} 
                  alt="Profile" 
                  class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  onerror="this.src='https://ui-avatars.com/api/?name=Ashley+Kemp&background=6366f1&color=fff&size=150'"
                />
                <button 
                  id="changeProfilePicBtn"
                  class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <i class="fas fa-camera text-sm"></i>
                </button>
                <input 
                  type="file" 
                  id="profilePicInput" 
                  accept="image/*" 
                  class="hidden"
                />
              </div>
              <h3 class="mt-4 text-xl font-semibold text-gray-900">{userData.name}</h3>
              <p class="text-gray-600">{userData.email}</p>
              <p class="text-sm text-gray-500 mt-2">Member since {new Date(userData.created_at).toLocaleDateString()}</p>
            </div>

            {/* Profile Form */}
            <div class="lg:col-span-2">
              <form id="profileForm" class="space-y-6">
                {/* Basic Information */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="fullName"
                      value={userData.name}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      value={userData.email}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone"
                      value={userData.phone}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      id="location"
                      value={userData.location}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input 
                    type="url" 
                    id="website"
                    value={userData.website}
                    placeholder="https://yourwebsite.com"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea 
                    id="bio"
                    rows="4"
                    placeholder="Tell us about yourself..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  >{userData.bio}</textarea>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input 
                type="password" 
                id="currentPassword"
                placeholder="Enter your current password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input 
                  type="password" 
                  id="newPassword"
                  placeholder="Enter new password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button 
              id="changePasswordBtn"
              type="button"
              class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <i class="fas fa-key mr-2"></i>
              Change Password
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p class="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="emailNotifications" class="sr-only peer" checked={userData.notifications_email} />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Push Notifications</h4>
                <p class="text-sm text-gray-600">Receive browser push notifications</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="pushNotifications" class="sr-only peer" checked={userData.notifications_push} />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
              <select 
                id="profileVisibility"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public" selected={userData.privacy_profile === 'public'}>Public - Anyone can see your profile</option>
                <option value="members" selected={userData.privacy_profile === 'members'}>Members Only - Only logged-in members can see your profile</option>
                <option value="private" selected={userData.privacy_profile === 'private'}>Private - Only you can see your profile</option>
              </select>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <button 
                id="deleteAccountBtn"
                type="button"
                class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <i class="fas fa-trash mr-2"></i>
                Delete Account
              </button>
              <p class="text-sm text-gray-500 mt-2">This action cannot be undone. All your data will be permanently deleted.</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        <div id="profileMessages" class="mt-6"></div>
      </div>
    </Layout>,
    { title: 'Profile - Digital Era' }
  )
})

// API Routes (keep existing ones for compatibility)
app.get('/api/courses', async (c) => {
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
})

app.get('/api/user/:id/stats', async (c) => {
  return c.json({
    id: 1,
    user_id: 1,
    total_courses_completed: 8,
    total_learning_hours: 45.5,
    current_streak_days: 12,
    longest_streak_days: 15,
    total_commissions: 2847.00,
    last_activity_date: '2024-08-14'
  })
})

// Profile API endpoints
app.get('/api/user/:id/profile', async (c) => {
  const { env } = c
  const userId = c.req.param('id')

  try {
    let user = null
    if (env.DB) {
      const userResult = await safeDBQuery(env.DB, 'SELECT * FROM users WHERE id = ?', [userId])
      user = userResult.results?.[0] || null
    }

    // Fallback user data
    const userData = user || {
      id: 1,
      name: 'Ashley Kemp',
      email: 'ashley@digitalera.com',
      avatar_url: 'https://ui-avatars.com/api/?name=Ashley+Kemp&background=6366f1&color=fff&size=150',
      phone: '+1 (555) 123-4567',
      location: 'Los Angeles, CA',
      bio: 'Digital entrepreneur passionate about building digital success.',
      website: 'https://ashleykemp.com',
      created_at: '2024-01-15',
      notifications_email: true,
      notifications_push: true,
      privacy_profile: 'public'
    }

    return c.json(userData)
  } catch (error) {
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

app.put('/api/user/:id/profile', async (c) => {
  const { env } = c
  const userId = c.req.param('id')
  
  try {
    const profileData = await c.req.json()
    
    // In a real app, you would update the database here
    if (env.DB) {
      // Update user profile in database
      await safeDBQuery(env.DB, `
        UPDATE users SET 
          name = ?, email = ?, phone = ?, location = ?, bio = ?, website = ?,
          notifications_email = ?, notifications_push = ?, privacy_profile = ?
        WHERE id = ?
      `, [
        profileData.name, profileData.email, profileData.phone, 
        profileData.location, profileData.bio, profileData.website,
        profileData.notifications_email, profileData.notifications_push, 
        profileData.privacy_profile, userId
      ])
    }

    return c.json({ success: true, message: 'Profile updated successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

app.post('/api/user/:id/upload-avatar', async (c) => {
  const userId = c.req.param('id')
  
  try {
    // In a real app, you would handle file upload here
    // For demo purposes, we'll simulate a successful upload
    const mockAvatarUrl = `https://ui-avatars.com/api/?name=Ashley+Kemp&background=6366f1&color=fff&size=150&t=${Date.now()}`
    
    return c.json({ 
      success: true, 
      avatar_url: mockAvatarUrl,
      message: 'Avatar uploaded successfully' 
    })
  } catch (error) {
    return c.json({ error: 'Failed to upload avatar' }, 500)
  }
})

app.post('/api/user/:id/change-password', async (c) => {
  const userId = c.req.param('id')
  
  try {
    const { currentPassword, newPassword, confirmPassword } = await c.req.json()
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return c.json({ error: 'All password fields are required' }, 400)
    }
    
    if (newPassword !== confirmPassword) {
      return c.json({ error: 'New passwords do not match' }, 400)
    }
    
    if (newPassword.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters long' }, 400)
    }
    
    // In a real app, you would verify current password and update it in database
    return c.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to change password' }, 500)
  }
})

app.delete('/api/user/:id/account', async (c) => {
  const userId = c.req.param('id')
  
  try {
    // In a real app, you would delete user account and all associated data
    return c.json({ success: true, message: 'Account deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Failed to delete account' }, 500)
  }
})

// Lesson routes
app.get('/lesson/:courseId/:lessonId', async (c) => {
  const courseId = c.req.param('courseId')
  const lessonId = c.req.param('lessonId')
  
  // Course data mapping
  const courses = {
    '1': {
      title: 'TIK-TOK MASTERY',
      description: 'Dominate TikTok and grow your following exponentially',
      progress: 67,
      modules: [
        { id: 1, title: 'Module 1', status: 'Complete', lessons: [
          { id: 1, title: 'Getting Started with TikTok', duration: '15 min' },
          { id: 2, title: 'Profile Optimization', duration: '12 min' }
        ]},
        { id: 2, title: 'Module 2', status: 'Complete', lessons: [
          { id: 1, title: 'Content Strategy Basics', duration: '18 min' },
          { id: 2, title: 'Understanding the Algorithm', duration: '20 min' }
        ]},
        { id: 3, title: 'Module 3', status: 'In Progress', lessons: [
          { id: 1, title: 'Advanced Content Creation', duration: '25 min' },
          { id: 2, title: 'Viral Content Creation', duration: '22 min', current: true },
          { id: 3, title: 'Engagement Strategies', duration: '18 min' }
        ]}
      ]
    },
    '2': {
      title: 'The Discovery Process',
      description: 'Find your niche and identify opportunities',
      progress: 30,
      modules: [
        { id: 1, title: 'Module 1', status: 'In Progress', lessons: [
          { id: 1, title: 'Self-Assessment', duration: '20 min', current: true },
          { id: 2, title: 'Market Research', duration: '25 min' }
        ]}
      ]
    },
    '3': {
      title: 'Next Steps',
      description: 'Action plan for immediate implementation',
      progress: 0,
      modules: [
        { id: 1, title: 'Module 1', status: 'Not Started', lessons: [
          { id: 1, title: 'Creating Your Action Plan', duration: '30 min', current: true }
        ]}
      ]
    }
  }

  const course = courses[courseId]
  if (!course) {
    return c.notFound()
  }

  // Find current lesson
  let currentLesson = null
  let currentModule = null
  
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (lesson.id.toString() === lessonId) {
        currentLesson = lesson
        currentModule = module
        break
      }
    }
    if (currentLesson) break
  }

  if (!currentLesson) {
    currentLesson = course.modules[0].lessons[0]
    currentModule = course.modules[0]
  }

  return c.render(
    <Layout title={`${course.title} - ${currentLesson.title}`} currentPage="courses">
      <div class="flex gap-6">
        {/* Course Progress Sidebar */}
        <div class="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Course Progress</h3>
          
          <div class="space-y-4">
            {course.modules.map((module) => (
              <div class="border-b border-gray-100 pb-4 last:border-b-0">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-900">{module.title}</h4>
                  <span class={`text-xs px-2 py-1 rounded-full ${
                    module.status === 'Complete' ? 'bg-green-100 text-green-800' :
                    module.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {module.status}
                  </span>
                </div>
                
                <div class="space-y-2">
                  {module.lessons.map((lesson) => (
                    <a 
                      href={`/lesson/${courseId}/${lesson.id}`}
                      class={`block px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                        lesson.id.toString() === lessonId 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div class="flex items-center justify-between">
                        <span>Lesson {lesson.id}: {lesson.title}</span>
                        <span class="text-xs text-gray-500">{lesson.duration}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div class="flex-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Lesson {lessonId}: {currentLesson.title}</h1>
                <p class="text-gray-600 mt-1">{course.description}</p>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-500">Progress</div>
                <div class="text-2xl font-bold text-blue-600">{course.progress}%</div>
              </div>
            </div>

            {/* Video Player */}
            <div class="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
              <div class="text-center text-white">
                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <i class="fas fa-play text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium mb-2">Video Player</h3>
                <p class="text-sm text-gray-300">Learn the secrets to creating {course.title.toLowerCase()} content that goes viral</p>
                <button class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <i class="fas fa-play mr-2"></i>
                  Play Video
                </button>
              </div>
            </div>

            {/* Lesson Navigation */}
            <div class="flex items-center justify-between">
              <button 
                onclick="history.back()" 
                class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                Back to Course
              </button>
              
              <div class="flex items-center space-x-4">
                <button class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <i class="fas fa-check mr-2"></i>
                  Mark Complete
                </button>
                
                <button 
                  onclick={`window.location.href='/lesson/${courseId}/${parseInt(lessonId) + 1}'`}
                  class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Lesson
                  <i class="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Resources */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Lesson Resources</h3>
            <div class="space-y-3">
              <a href="#" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <i class="fas fa-file-pdf text-red-500 mr-3"></i>
                <div>
                  <div class="font-medium text-gray-900">{currentLesson.title} - Study Guide</div>
                  <div class="text-sm text-gray-500">PDF Download</div>
                </div>
              </a>
              
              <a href="#" class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <i class="fas fa-download text-blue-500 mr-3"></i>
                <div>
                  <div class="font-medium text-gray-900">Templates & Worksheets</div>
                  <div class="text-sm text-gray-500">ZIP Archive</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>,
    { title: `${course.title} - ${currentLesson.title} - Digital Era` }
  )
})

export default app