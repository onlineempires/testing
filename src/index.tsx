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
                <button id="notificationBtn" class="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">
                  <i class="fas fa-bell text-lg"></i>
                  <span id="notificationBadge" class="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold" style="font-size: 10px;">3</span>
                </button>
                {/* Notifications Dropdown */}
                <div id="notificationsDropdown" class="hidden absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div class="p-4 border-b border-gray-100">
                    <div class="flex items-center justify-between">
                      <h3 class="font-semibold text-gray-900">Notifications</h3>
                      <button id="clearAllNotifications" class="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        Clear All
                      </button>
                    </div>
                  </div>
                  <div id="notificationsList" class="max-h-80 overflow-y-auto">
                    <div class="notification-item p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors" data-type="lead" data-id="1">
                      <div class="flex items-start">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <i class="fas fa-user-plus text-blue-600"></i>
                        </div>
                        <div class="flex-grow">
                          <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-gray-900">New Lead Generated!</p>
                            <button class="mark-read-btn text-xs text-gray-400 hover:text-gray-600">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                          <p class="text-sm text-gray-600 mt-1">John Smith signed up through your referral link</p>
                          <div class="flex items-center justify-between mt-2">
                            <p class="text-xs text-gray-500">2 hours ago</p>
                            <button class="text-xs text-blue-600 hover:text-blue-800 font-medium">View Lead</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="notification-item p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors" data-type="commission" data-id="2">
                      <div class="flex items-start">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <i class="fas fa-dollar-sign text-green-600"></i>
                        </div>
                        <div class="flex-grow">
                          <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-gray-900">Commission Earned!</p>
                            <button class="mark-read-btn text-xs text-gray-400 hover:text-gray-600">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                          <p class="text-sm text-gray-600 mt-1">$150 commission from Sarah's purchase</p>
                          <div class="flex items-center justify-between mt-2">
                            <p class="text-xs text-gray-500">1 day ago</p>
                            <button class="text-xs text-green-600 hover:text-green-800 font-medium">View Sale</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="notification-item p-4 hover:bg-gray-50 cursor-pointer transition-colors" data-type="team" data-id="3">
                      <div class="flex items-start">
                        <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <i class="fas fa-users text-purple-600"></i>
                        </div>
                        <div class="flex-grow">
                          <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-gray-900">New Team Member!</p>
                            <button class="mark-read-btn text-xs text-gray-400 hover:text-gray-600">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                          <p class="text-sm text-gray-600 mt-1">Maria Rodriguez joined your team</p>
                          <div class="flex items-center justify-between mt-2">
                            <p class="text-xs text-gray-500">3 days ago</p>
                            <button class="text-xs text-purple-600 hover:text-purple-800 font-medium">View Profile</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="p-4 border-t border-gray-100 text-center">
                    <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View All Notifications
                    </button>
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
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">
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

          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">
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

          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">
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

          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">
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
                  <div class="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
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
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">4 Modules</span>
              </div>
              <p class="text-sm text-gray-600 mb-4 flex-grow">Action plan for immediate implementation</p>
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500">Progress</span>
                  <span class="text-xs text-gray-700 font-medium">20 Lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/3/1'" class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200">
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
                  <div class="bg-pink-600 h-2 rounded-full" style={{width: '0%'}}></div>
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
                  <div class="bg-indigo-600 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
              <button onclick="window.location.href='/lesson/6/1'" class="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200">
                Start Course
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">🏆 Recent Achievements</h3>
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
    </Layout>,
    { title: 'All Courses - Digital Era' }
  )
})

// Expert Directory page
app.get('/experts', (c) => {
  return c.render(
    <Layout title="Expert Directory" currentPage="experts">
      <style dangerouslySetInnerHTML={{
        __html: `
          .booking-step {
            animation: fadeIn 0.3s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .time-slot {
            transition: all 0.2s ease-in-out;
          }
          
          .time-slot:hover {
            transform: translateY(-2px);
            shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .modal-overlay {
            backdrop-filter: blur(4px);
          }
          
          .progress-bar {
            transition: all 0.3s ease-in-out;
          }
          
          .step-indicator {
            transition: all 0.3s ease-in-out;
          }
          
          .payment-form input:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .expert-card {
            transition: all 0.2s ease-in-out;
          }
          
          .expert-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
        `
      }} />
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Expert Directory</h1>
        <p class="text-gray-600">Book 1-on-1 coaching calls with our top 6A+ Enagic leaders</p>
      </div>

      <div class="grid grid-cols-3 gap-6">
        {/* John Smith */}
        <div class="expert-card bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div class="mb-4">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="John Smith" class="w-20 h-20 rounded-full mx-auto mb-3" />
            
            <h3 class="text-lg font-semibold text-gray-900 mb-1">John Smith</h3>
            
            {/* 5-star rating */}
            <div class="flex justify-center mb-2">
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
            </div>
            
            <p class="text-sm text-blue-600 font-medium mb-3">6A Leader</p>
          </div>
          
          <p class="text-sm text-gray-600 mb-4 leading-relaxed">
            Sales expert with 10+ years experience. Specializes in high-ticket closing and team building strategies.
          </p>
          
          <div class="space-y-2 mb-6">
            <div class="text-lg font-bold text-gray-900">60 Minutes</div>
            <div class="text-2xl font-bold text-blue-600">$299</div>
          </div>
          
          <button 
            onclick="openBookingModal('john-smith', 'John Smith', '$299', 'https://calendly.com/johnsmith-digitalera')"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Call
          </button>
        </div>

        {/* Sarah Johnson */}
        <div class="expert-card bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div class="mb-4">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face" alt="Sarah Johnson" class="w-20 h-20 rounded-full mx-auto mb-3" />
            
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
            
            {/* 5-star rating */}
            <div class="flex justify-center mb-2">
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
            </div>
            
            <p class="text-sm text-blue-600 font-medium mb-3">6A3 Leader</p>
          </div>
          
          <p class="text-sm text-gray-600 mb-4 leading-relaxed">
            Marketing genius focusing on social media growth and content strategy. Built multiple 7-figure funnels.
          </p>
          
          <div class="space-y-2 mb-6">
            <div class="text-lg font-bold text-gray-900">60 Minutes</div>
            <div class="text-2xl font-bold text-blue-600">$399</div>
          </div>
          
          <button 
            onclick="openBookingModal('sarah-johnson', 'Sarah Johnson', '$399', 'https://calendly.com/sarahjohnson-digitalera')"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Call
          </button>
        </div>

        {/* Mike Davis */}
        <div class="expert-card bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div class="mb-4">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="Mike Davis" class="w-20 h-20 rounded-full mx-auto mb-3" />
            
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Mike Davis</h3>
            
            {/* 5-star rating */}
            <div class="flex justify-center mb-2">
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
            </div>
            
            <p class="text-sm text-blue-600 font-medium mb-3">6A Leader</p>
          </div>
          
          <p class="text-sm text-gray-600 mb-4 leading-relaxed">
            Lead generation specialist with expertise in paid advertising and conversion optimization.
          </p>
          
          <div class="space-y-2 mb-6">
            <div class="text-lg font-bold text-gray-900">60 Minutes</div>
            <div class="text-2xl font-bold text-blue-600">$349</div>
          </div>
          
          <button 
            onclick="openBookingModal('mike-davis', 'Mike Davis', '$349', 'https://calendly.com/mikedavis-digitalera')"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Call
          </button>
        </div>

        {/* Lisa Chen */}
        <div class="expert-card bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div class="mb-4">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" alt="Lisa Chen" class="w-20 h-20 rounded-full mx-auto mb-3" />
            
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Lisa Chen</h3>
            
            {/* 5-star rating */}
            <div class="flex justify-center mb-2">
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
            </div>
            
            <p class="text-sm text-blue-600 font-medium mb-3">6A3 Leader</p>
          </div>
          
          <p class="text-sm text-gray-600 mb-4 leading-relaxed">
            Mindset and personal development coach. Helps entrepreneurs overcome limiting beliefs and scale faster.
          </p>
          
          <div class="space-y-2 mb-6">
            <div class="text-lg font-bold text-gray-900">60 Minutes</div>
            <div class="text-2xl font-bold text-blue-600">$275</div>
          </div>
          
          <button 
            onclick="openBookingModal('lisa-chen', 'Lisa Chen', '$275', 'https://calendly.com/lisachen-digitalera')"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Call
          </button>
        </div>

        {/* Robert Wilson */}
        <div class="expert-card bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div class="mb-4">
            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face" alt="Robert Wilson" class="w-20 h-20 rounded-full mx-auto mb-3" />
            
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Robert Wilson</h3>
            
            {/* 5-star rating */}
            <div class="flex justify-center mb-2">
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
            </div>
            
            <p class="text-sm text-blue-600 font-medium mb-3">6A Leader</p>
          </div>
          
          <p class="text-sm text-gray-600 mb-4 leading-relaxed">
            Systems and automation expert. Helps businesses streamline operations and increase efficiency.
          </p>
          
          <div class="space-y-2 mb-6">
            <div class="text-lg font-bold text-gray-900">60 Minutes</div>
            <div class="text-2xl font-bold text-blue-600">$325</div>
          </div>
          
          <button 
            onclick="openBookingModal('robert-wilson', 'Robert Wilson', '$325', 'https://calendly.com/robertwilson-digitalera')"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Call
          </button>
        </div>

        {/* Emma Rodriguez */}
        <div class="expert-card bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <div class="mb-4">
            <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face" alt="Emma Rodriguez" class="w-20 h-20 rounded-full mx-auto mb-3" />
            
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Emma Rodriguez</h3>
            
            {/* 5-star rating */}
            <div class="flex justify-center mb-2">
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
              <i class="fas fa-star text-yellow-400 text-sm"></i>
            </div>
            
            <p class="text-sm text-blue-600 font-medium mb-3">6A2 Leader</p>
          </div>
          
          <p class="text-sm text-gray-600 mb-4 leading-relaxed">
            E-commerce and dropshipping specialist. Built multiple 6-figure online stores from scratch.
          </p>
          
          <div class="space-y-2 mb-6">
            <div class="text-lg font-bold text-gray-900">60 Minutes</div>
            <div class="text-2xl font-bold text-blue-600">$375</div>
          </div>
          
          <button 
            onclick="openBookingModal('emma-rodriguez', 'Emma Rodriguez', '$375', 'https://calendly.com/emmarodriguez-digitalera')"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Call
          </button>
        </div>
      </div>

      {/* Booking Modal - Multi-step Process */}
      <div id="bookingModal" class="fixed inset-0 bg-black bg-opacity-60 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl">
          {/* Modal Header */}
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img id="modalExpertImage" src="" alt="" class="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                <div>
                  <h2 class="text-2xl font-bold" id="modalExpertName"></h2>
                  <div class="flex items-center space-x-2 mt-1">
                    <div class="flex">
                      <i class="fas fa-star text-yellow-300 text-sm"></i>
                      <i class="fas fa-star text-yellow-300 text-sm"></i>
                      <i class="fas fa-star text-yellow-300 text-sm"></i>
                      <i class="fas fa-star text-yellow-300 text-sm"></i>
                      <i class="fas fa-star text-yellow-300 text-sm"></i>
                    </div>
                    <span class="text-blue-200">•</span>
                    <span class="text-blue-200 font-medium">6A Leader</span>
                  </div>
                </div>
              </div>
              <button onclick="closeBookingModal()" class="text-white hover:text-gray-200 transition-colors">
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div class="bg-gray-50 px-6 py-4 border-b">
            <div class="flex items-center justify-center space-x-8">
              <div id="step1" class="flex items-center space-x-2 text-blue-600">
                <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <span class="font-medium">Select Time</span>
              </div>
              <div class="w-16 h-1 bg-gray-300 rounded" id="progress1"></div>
              <div id="step2" class="flex items-center space-x-2 text-gray-400">
                <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <span class="font-medium">Payment</span>
              </div>
              <div class="w-16 h-1 bg-gray-300 rounded" id="progress2"></div>
              <div id="step3" class="flex items-center space-x-2 text-gray-400">
                <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <span class="font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div class="p-6 flex-1 overflow-y-auto">
            {/* Step 1: Calendar Selection */}
            <div id="bookingStep1" class="booking-step flex flex-col h-full">
              <div class="grid grid-cols-3 gap-6 flex-1">
                {/* Session Details */}
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <h3 class="text-base font-bold text-gray-900 mb-3">
                    <i class="fas fa-video text-blue-600 mr-2"></i>
                    Session Details
                  </h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Duration:</span>
                      <span class="font-semibold text-gray-900">60 minutes</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Format:</span>
                      <span class="font-semibold text-gray-900">1-on-1 Video Call</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Platform:</span>
                      <span class="font-semibold text-gray-900">Zoom/Teams</span>
                    </div>
                    <hr class="border-blue-200 my-3" />
                    <div class="flex justify-between items-center">
                      <span class="text-base font-semibold text-gray-900">Total:</span>
                      <span id="modalPrice" class="text-xl font-bold text-blue-600"></span>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div class="col-span-2">
                  <h3 class="text-base font-bold text-gray-900 mb-3">
                    <i class="fas fa-calendar-alt text-green-600 mr-2"></i>
                    Choose Your Preferred Time
                  </h3>
                  <div class="bg-white border-2 border-gray-200 rounded-xl p-4">
                    <div id="calendlyEmbed">
                      {/* Enhanced Calendar Simulation */}
                      <div class="text-center">
                        <h4 class="font-semibold text-gray-900 mb-3">Available This Week</h4>
                        <div class="grid grid-cols-2 gap-3">
                          <button onclick="selectTimeSlot(this, 'Today 2:00 PM EST')" class="time-slot p-3 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium">
                            <div class="text-sm font-bold">Today</div>
                            <div class="text-base">2:00 PM EST</div>
                          </button>
                          <button onclick="selectTimeSlot(this, 'Today 4:30 PM EST')" class="time-slot p-3 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium">
                            <div class="text-sm font-bold">Today</div>
                            <div class="text-base">4:30 PM EST</div>
                          </button>
                          <button onclick="selectTimeSlot(this, 'Tomorrow 10:00 AM EST')" class="time-slot p-3 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium">
                            <div class="text-sm font-bold">Tomorrow</div>
                            <div class="text-base">10:00 AM EST</div>
                          </button>
                          <button onclick="selectTimeSlot(this, 'Tomorrow 2:30 PM EST')" class="time-slot p-3 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium">
                            <div class="text-sm font-bold">Tomorrow</div>
                            <div class="text-base">2:30 PM EST</div>
                          </button>
                        </div>
                        <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p class="text-xs text-blue-700">
                            <i class="fas fa-info-circle mr-1"></i>
                            Production integration: <strong id="modalCalendlyUrl" class="text-xs"></strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end mt-4 pt-4 border-t border-gray-200">
                <button 
                  id="nextToPayment" 
                  onclick="goToStep2()" 
                  disabled
                  class="px-8 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed transition-all"
                >
                  Continue to Payment
                  <i class="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div id="bookingStep2" class="booking-step hidden flex flex-col h-full">
              <div class="grid grid-cols-2 gap-6 flex-1">
                {/* Order Summary */}
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-4">
                    <i class="fas fa-receipt text-purple-600 mr-2"></i>
                    Order Summary
                  </h3>

                  <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 mb-6">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <img id="summaryExpertImage" src="" alt="" class="w-12 h-12 rounded-full" />
                        <div>
                          <div class="font-semibold text-gray-900" id="summaryExpertName"></div>
                          <div class="text-sm text-gray-600">60-minute coaching session</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-2xl font-bold text-purple-600" id="summaryPrice"></div>
                      </div>
                    </div>
                    
                    <div class="border-t border-purple-200 pt-4">
                      <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Selected Time:</span>
                        <span id="selectedTimeDisplay" class="font-medium text-gray-900"></span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 class="font-semibold text-blue-900 mb-2">
                      <i class="fas fa-handshake text-blue-600 mr-2"></i>
                      Revenue Split
                    </h4>
                    <div class="text-sm text-blue-700 space-y-1">
                      <div class="flex justify-between">
                        <span>Expert receives (75%):</span>
                        <span id="expertAmount" class="font-semibold"></span>
                      </div>
                      <div class="flex justify-between">
                        <span>Platform fee (25%):</span>
                        <span id="platformFee" class="font-semibold"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-4">
                    <i class="fas fa-credit-card text-green-600 mr-2"></i>
                    Payment Information
                  </h3>

                  <div class="space-y-4">
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div class="flex items-center text-yellow-800 text-sm">
                        <i class="fas fa-info-circle mr-2"></i>
                        <span class="font-medium">Demo Mode:</span>
                        <button onclick="fillDummyCardInfo()" class="ml-2 text-blue-600 hover:text-blue-800 underline font-medium">
                          Click to auto-fill dummy card info
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                      <input 
                        id="cardNumber"
                        type="text" 
                        placeholder="4242 4242 4242 4242" 
                        class="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        maxlength="19"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                        <input 
                          id="cardExpiry"
                          type="text" 
                          placeholder="12/28" 
                          class="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          maxlength="5"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">CVC *</label>
                        <input 
                          id="cardCvc"
                          type="text" 
                          placeholder="123" 
                          class="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          maxlength="4"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name *</label>
                      <input 
                        id="cardName"
                        type="text" 
                        placeholder="Ashley Kemp" 
                        class="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div class="flex items-center text-green-700">
                      <i class="fas fa-shield-alt text-xl mr-3"></i>
                      <div>
                        <div class="font-semibold">Secure Payment</div>
                        <div class="text-sm">Your card details are encrypted and secure</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <button 
                  onclick="goToStep1()" 
                  class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <i class="fas fa-arrow-left mr-2"></i>
                  Back to Calendar
                </button>
                <button 
                  onclick="processPayment()" 
                  class="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                >
                  <i class="fas fa-lock mr-2"></i>
                  Complete Payment
                </button>
              </div>
            </div>

            {/* Step 3: Confirmation */}
            <div id="bookingStep3" class="booking-step hidden text-center">
              <div class="max-w-md mx-auto">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i class="fas fa-check text-3xl text-green-600"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
                <p class="text-gray-600 mb-6">Your coaching session has been successfully booked. You'll receive a confirmation email with the meeting details shortly.</p>
                
                <div class="bg-gray-50 p-6 rounded-xl mb-6">
                  <div class="space-y-3 text-left">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Expert:</span>
                      <span id="confirmationExpertName" class="font-semibold"></span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Date & Time:</span>
                      <span id="confirmationDateTime" class="font-semibold"></span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Amount Paid:</span>
                      <span id="confirmationAmount" class="font-semibold text-green-600"></span>
                    </div>
                  </div>
                </div>

                <button 
                  onclick="closeBookingModal()" 
                  class="w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          let currentExpert = null;
          let selectedTime = null;
          let currentStep = 1;
          
          function openBookingModal(expertId, expertName, price, calendlyUrl) {
            currentExpert = {
              id: expertId,
              name: expertName,
              price: price,
              calendlyUrl: calendlyUrl
            };
            
            // Reset to step 1
            currentStep = 1;
            selectedTime = null;
            goToStep1();
            
            // Update modal content
            document.getElementById('modalExpertName').textContent = expertName;
            document.getElementById('modalPrice').textContent = price;
            document.getElementById('summaryExpertName').textContent = expertName;
            document.getElementById('summaryPrice').textContent = price;
            document.getElementById('confirmationExpertName').textContent = expertName;
            document.getElementById('confirmationAmount').textContent = price;
            document.getElementById('modalCalendlyUrl').textContent = calendlyUrl;
            
            // Calculate payment split
            const priceNum = parseInt(price.replace('$', ''));
            const expertAmount = Math.round(priceNum * 0.75);
            const platformFee = priceNum - expertAmount;
            
            document.getElementById('expertAmount').textContent = '$' + expertAmount;
            document.getElementById('platformFee').textContent = '$' + platformFee;
            
            // Set expert image based on name - FIXED Sarah Johnson
            const imageMap = {
              'john-smith': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
              'sarah-johnson': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
              'mike-davis': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
              'lisa-chen': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
              'robert-wilson': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
              'emma-rodriguez': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face'
            };
            
            const imageUrl = imageMap[expertId] || '';
            document.getElementById('modalExpertImage').src = imageUrl;
            document.getElementById('modalExpertImage').alt = expertName;
            document.getElementById('summaryExpertImage').src = imageUrl;
            document.getElementById('summaryExpertImage').alt = expertName;
            
            // Show modal with animation
            const modal = document.getElementById('bookingModal');
            modal.classList.remove('hidden');
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.95)';
            document.body.style.overflow = 'hidden';
            
            // Animate in
            setTimeout(() => {
              modal.style.transition = 'all 0.3s ease-out';
              modal.style.opacity = '1';
              modal.style.transform = 'scale(1)';
            }, 10);
          }
          
          function closeBookingModal() {
            const modal = document.getElementById('bookingModal');
            modal.style.transition = 'all 0.2s ease-in';
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
              modal.classList.add('hidden');
              modal.style.transition = '';
              document.body.style.overflow = 'auto';
            }, 200);
            
            currentExpert = null;
            selectedTime = null;
            currentStep = 1;
          }
          
          function updateStepUI() {
            // Hide all steps
            document.querySelectorAll('.booking-step').forEach(step => {
              step.classList.add('hidden');
            });
            
            // Show current step
            document.getElementById('bookingStep' + currentStep).classList.remove('hidden');
            
            // Update progress indicators
            for (let i = 1; i <= 3; i++) {
              const stepEl = document.getElementById('step' + i);
              const progressEl = document.getElementById('progress' + i);
              
              if (i < currentStep) {
                // Completed step
                stepEl.className = 'flex items-center space-x-2 text-green-600';
                stepEl.querySelector('div').className = 'w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold';
                stepEl.querySelector('div').innerHTML = '<i class="fas fa-check"></i>';
                if (progressEl) progressEl.className = 'w-16 h-1 bg-green-500 rounded';
              } else if (i === currentStep) {
                // Current step
                stepEl.className = 'flex items-center space-x-2 text-blue-600';
                stepEl.querySelector('div').className = 'w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold';
                stepEl.querySelector('div').textContent = i;
                if (progressEl) progressEl.className = 'w-16 h-1 bg-gray-300 rounded';
              } else {
                // Future step
                stepEl.className = 'flex items-center space-x-2 text-gray-400';
                stepEl.querySelector('div').className = 'w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold';
                stepEl.querySelector('div').textContent = i;
                if (progressEl) progressEl.className = 'w-16 h-1 bg-gray-300 rounded';
              }
            }
          }
          
          function goToStep1() {
            currentStep = 1;
            updateStepUI();
          }
          
          function goToStep2() {
            if (!selectedTime) {
              alert('Please select a time slot first!');
              return;
            }
            currentStep = 2;
            document.getElementById('selectedTimeDisplay').textContent = selectedTime;
            updateStepUI();
          }
          
          function goToStep3() {
            currentStep = 3;
            document.getElementById('confirmationDateTime').textContent = selectedTime;
            updateStepUI();
          }
          
          function selectTimeSlot(button, timeText) {
            // Remove selection from all slots
            document.querySelectorAll('.time-slot').forEach(slot => {
              slot.classList.remove('bg-blue-100', 'border-blue-500', 'text-blue-900');
              slot.classList.add('bg-green-50', 'border-green-200', 'text-green-700');
            });
            
            // Highlight selected slot
            button.classList.remove('bg-green-50', 'border-green-200', 'text-green-700');
            button.classList.add('bg-blue-100', 'border-blue-500', 'text-blue-900');
            
            // Store selected time
            selectedTime = timeText;
            
            // Enable next button
            const nextBtn = document.getElementById('nextToPayment');
            nextBtn.disabled = false;
            nextBtn.className = 'px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all cursor-pointer';
            nextBtn.innerHTML = 'Continue to Payment <i class="fas fa-arrow-right ml-2"></i>';
          }
          
          function fillDummyCardInfo() {
            document.getElementById('cardNumber').value = '4242 4242 4242 4242';
            document.getElementById('cardExpiry').value = '12/28';
            document.getElementById('cardCvc').value = '123';
            document.getElementById('cardName').value = 'Ashley Kemp';
            
            // Add visual feedback
            showToast('Dummy card info filled!', 'success');
            
            // Highlight the fields briefly
            const fields = ['cardNumber', 'cardExpiry', 'cardCvc', 'cardName'];
            fields.forEach(fieldId => {
              const field = document.getElementById(fieldId);
              field.style.backgroundColor = '#dbeafe';
              field.style.borderColor = '#3b82f6';
              setTimeout(() => {
                field.style.backgroundColor = '';
                field.style.borderColor = '';
              }, 1000);
            });
          }
          
          function processPayment() {
            if (!currentExpert || !selectedTime) return;
            
            // Simulate payment processing
            const button = event.target;
            const originalText = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing Payment...';
            button.disabled = true;
            button.className = 'px-8 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed';
            
            setTimeout(() => {
              // Show success step
              goToStep3();
              
              // Show success toast
              showToast('Payment successful! Booking confirmed.', 'success');
              
              button.innerHTML = originalText;
              button.disabled = false;
              button.className = 'px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg';
            }, 2500);
          }
          
          function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = \`fixed top-4 right-4 z-[60] p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 \${
              type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }\`;
            toast.innerHTML = \`
              <div class="flex items-center space-x-2">
                <i class="fas fa-\${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>\${message}</span>
              </div>
            \`;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
              toast.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
              toast.style.transform = 'translateX(100%)';
              setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
          }
          
          // Close modal on outside click
          document.getElementById('bookingModal').addEventListener('click', function(e) {
            if (e.target === this) {
              closeBookingModal();
            }
          });
          
          // Keyboard navigation
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !document.getElementById('bookingModal').classList.contains('hidden')) {
              closeBookingModal();
            }
          });
          
          // Initialize step UI on load
          document.addEventListener('DOMContentLoaded', function() {
            updateStepUI();
          });
        `
      }} />
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

// Daily Method of Operation (DMO) - Main Selection Page
app.get('/dmo', (c) => {
  return c.render(
    <Layout title="Daily Method of Operation (DMO)" currentPage="dmo">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-3">🎯 Daily Method of Operation (DMO)</h1>
        <p class="text-lg text-gray-700 mb-2">Choose your daily commitment level and complete structured tasks to build consistent business growth.</p>
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-amber-600 mr-3"></i>
            <div>
              <p class="font-semibold text-amber-800">Important: One DMO Selection Per Day</p>
              <p class="text-sm text-amber-700">Choose wisely! You can only select and complete one commitment level per day to ensure fair leaderboard competition.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Stats Section */}
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl">
          <div class="flex items-center">
            <i class="fas fa-fire text-2xl text-orange-200 mr-3"></i>
            <div>
              <p class="text-orange-100 text-sm font-medium">Current Streak</p>
              <p class="text-2xl font-bold" id="currentStreak">7</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-2xl text-green-200 mr-3"></i>
            <div>
              <p class="text-green-100 text-sm font-medium">Tasks Today</p>
              <p class="text-2xl font-bold" id="todayCompleted">12</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-xl">
          <div class="flex items-center">
            <i class="fas fa-star text-2xl text-blue-200 mr-3"></i>
            <div>
              <p class="text-blue-100 text-sm font-medium">Total XP</p>
              <p class="text-2xl font-bold" id="totalXP">2,450</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Rank</p>
              <p class="text-3xl font-bold">#3</p>
              <p class="text-purple-100 text-xs">leaderboard</p>
            </div>
            <i class="fas fa-trophy text-4xl text-purple-200"></i>
          </div>
        </div>
      </div>

      {/* DMO Level Selection */}
      <div class="grid grid-cols-2 gap-8">
        {/* Express - 1 Hour */}
        <div class="bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer" onclick="selectDMO('express')">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-bolt text-2xl text-blue-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Express</h3>
            <p class="text-gray-600 mb-4">Perfect for busy beginners getting started</p>
            <div class="text-4xl font-bold text-blue-600 mb-4">1 Hour Per Day</div>
            <button class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Choose Success Path
            </button>
          </div>
        </div>

        {/* Pocket Builder - 2 Hours */}
        <div class="bg-white rounded-xl p-8 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer" onclick="selectDMO('pocket-builder')">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-rocket text-2xl text-green-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Pocket Builder</h3>
            <p class="text-gray-600 mb-4">For those building their business steadily</p>
            <div class="text-4xl font-bold text-green-600 mb-4">2 Hours Per Day</div>
            <button class="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Choose Success Path
            </button>
          </div>
        </div>

        {/* Steady Climber - 4 Hours */}
        <div class="bg-white rounded-xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer" onclick="selectDMO('steady-climber')">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-mountain text-2xl text-orange-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Steady Climber</h3>
            <p class="text-gray-600 mb-4">For serious business builders</p>
            <div class="text-4xl font-bold text-orange-600 mb-4">4 Hours Per Day</div>
            <button class="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Choose Success Path
            </button>
          </div>
        </div>

        {/* Full Throttle - 6+ Hours */}
        <div class="bg-white rounded-xl p-8 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer" onclick="selectDMO('full-throttle')">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-fire text-2xl text-red-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Full Throttle</h3>
            <p class="text-gray-600 mb-4">Maximum acceleration for rapid growth</p>
            <div class="text-4xl font-bold text-red-600 mb-4">6+ Hours Per Day</div>
            <button class="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Choose Success Path
            </button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div class="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
        <h2 class="text-3xl font-bold mb-4">🎯 Which DMO Will You Choose Today?</h2>
        <p class="text-xl text-blue-100 mb-2">Select your daily commitment level and start building your success!</p>
        <p class="text-blue-200 text-sm">⚡ Remember: You can only choose ONE level per day to maintain leaderboard integrity</p>
        <div class="mt-4 flex items-center justify-center">
          <div class="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-sm">
            <i class="fas fa-clock mr-2"></i>
            <span id="timeUntilReset">Loading...</span> until daily reset
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          function selectDMO(level) {
            // Check if user has already selected a DMO for today
            const today = new Date().toDateString();
            const todaysDMO = localStorage.getItem('todays_dmo_selection');
            
            if (todaysDMO) {
              const dmoData = JSON.parse(todaysDMO);
              if (dmoData.date === today) {
                // User already selected a DMO today
                if (dmoData.level === level) {
                  // Same DMO, allow them to continue
                  window.location.href = '/dmo/' + level;
                } else {
                  // Different DMO, show warning
                  alert('You have already selected ' + dmoData.level.replace('-', ' ').toUpperCase() + ' DMO for today. You can only work on one DMO level per day to maintain leaderboard integrity. Come back tomorrow to choose a different level!');
                  return;
                }
              } else {
                // New day, allow selection
                storeTodaysDMO(level, today);
                window.location.href = '/dmo/' + level;
              }
            } else {
              // First time selecting today
              storeTodaysDMO(level, today);
              window.location.href = '/dmo/' + level;
            }
          }
          
          function storeTodaysDMO(level, date) {
            const dmoSelection = {
              level: level,
              date: date,
              startTime: new Date().toISOString(),
              submitted: false
            };
            localStorage.setItem('todays_dmo_selection', JSON.stringify(dmoSelection));
          }
          
          // Initialize DMO stats and check daily selection
          document.addEventListener('DOMContentLoaded', function() {
            const stats = getDMOStats();
            document.getElementById('currentStreak').textContent = stats.streak;
            document.getElementById('todayCompleted').textContent = stats.todayCompleted;
            document.getElementById('totalXP').textContent = stats.totalXP.toLocaleString();
            
            // Check if user has already selected a DMO today and show status
            checkTodaysDMOSelection();
            
            // Start countdown timer
            updateCountdownTimer();
            setInterval(updateCountdownTimer, 1000);
          });
          
          function updateCountdownTimer() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const timerElement = document.getElementById('timeUntilReset');
            if (timerElement) {
              timerElement.textContent = \`\${hours}h \${minutes}m \${seconds}s\`;
            }
          }
          
          function checkTodaysDMOSelection() {
            const today = new Date().toDateString();
            const todaysDMO = localStorage.getItem('todays_dmo_selection');
            
            if (todaysDMO) {
              const dmoData = JSON.parse(todaysDMO);
              if (dmoData.date === today) {
                // Show which DMO is selected today
                showSelectedDMOStatus(dmoData);
              }
            }
          }
          
          function showSelectedDMOStatus(dmoData) {
            // Add visual indicator to show which DMO is selected
            const levelMap = {
              'express': 'Express (1 Hour)',
              'pocket-builder': 'Pocket Builder (2 Hours)', 
              'steady-climber': 'Steady Climber (4 Hours)',
              'full-throttle': 'Full Throttle (6+ Hours)'
            };
            
            const statusMessage = document.createElement('div');
            statusMessage.className = 'mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4';
            statusMessage.innerHTML = \`
              <div class="flex items-center">
                <i class="fas fa-info-circle text-blue-600 mr-3"></i>
                <div>
                  <p class="font-semibold text-blue-900">Today's DMO Selection: \${levelMap[dmoData.level]}</p>
                  <p class="text-blue-700 text-sm">Started at \${new Date(dmoData.startTime).toLocaleTimeString()}\${dmoData.submitted ? ' - 🎉 Completed!' : ' - 🔄 In Progress'}</p>
                </div>
              </div>
            \`;
            
            // Insert after the description paragraph
            const description = document.querySelector('.mb-6 p');
            description.parentNode.insertBefore(statusMessage, description.nextSibling);
            
            // Highlight the selected DMO card
            const cards = document.querySelectorAll('.cursor-pointer');
            cards.forEach(card => {
              const onclick = card.getAttribute('onclick');
              if (onclick && onclick.includes(dmoData.level)) {
                card.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
                card.style.transform = 'scale(1.02)';
                
                // Update button text
                const button = card.querySelector('button');
                if (button) {
                  button.textContent = dmoData.submitted ? '🎉 Completed Today!' : '➤ Continue DMO';
                  if (dmoData.submitted) {
                    button.classList.remove('hover:bg-blue-700', 'hover:bg-green-700', 'hover:bg-orange-700', 'hover:bg-red-700');
                    button.classList.add('bg-gray-400', 'cursor-not-allowed');
                  }
                }
              } else {
                // Fade out non-selected cards
                card.style.opacity = '0.6';
                card.style.pointerEvents = 'none';
                const button = card.querySelector('button');
                if (button) {
                  button.textContent = 'Available Tomorrow';
                  button.classList.add('bg-gray-400', 'cursor-not-allowed');
                  button.classList.remove('hover:bg-blue-700', 'hover:bg-green-700', 'hover:bg-orange-700', 'hover:bg-red-700');
                }
              }
            });
          }
          
          function getDMOStats() {
            const stats = localStorage.getItem('dmo_stats');
            if (stats) {
              return JSON.parse(stats);
            }
            return {
              streak: 0,
              todayCompleted: 0,
              totalXP: 0,
              lastCompletedDate: null
            };
          }
          
          // 🎉 SHAREABLE AWARD FEATURE
          function showDMOCompletionAward(level, tasksCompleted, xpEarned) {
            const levelNames = {
              'express': 'Express DMO',
              'pocket-builder': 'Pocket Builder DMO',
              'steady-climber': 'Steady Climber DMO',
              'full-throttle': 'Full Throttle DMO'
            };
            
            const levelEmojis = {
              'express': '⚡',
              'pocket-builder': '🚀',
              'steady-climber': '⛰️',
              'full-throttle': '🔥'
            };
            
            const today = new Date().toLocaleDateString();
            const levelName = levelNames[level] || level;
            const emoji = levelEmojis[level] || '🎯';
            
            // Create modal with award
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = \`
              <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center transform scale-0 transition-transform duration-300" id="awardModal">
                <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl mb-6">
                  <div class="text-6xl mb-4">🏆</div>
                  <h2 class="text-2xl font-bold mb-2">DMO COMPLETED!</h2>
                  <div class="text-lg">\${emoji} \${levelName}</div>
                </div>
                
                <div class="space-y-4 mb-6">
                  <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span class="font-medium text-gray-700">Tasks Completed:</span>
                    <span class="font-bold text-green-600">\${tasksCompleted}</span>
                  </div>
                  <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span class="font-medium text-gray-700">XP Earned:</span>
                    <span class="font-bold text-blue-600">+\${xpEarned}</span>
                  </div>
                  <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span class="font-medium text-gray-700">Date:</span>
                    <span class="font-bold text-purple-600">\${today}</span>
                  </div>
                </div>
                
                <div class="space-y-3">
                  <button onclick="shareToFacebookGroup()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                    <i class="fab fa-facebook mr-2"></i>
                    Share to VIP Group
                  </button>
                  <button onclick="copyShareText()" class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    <i class="fas fa-copy mr-2"></i>
                    Copy Share Text
                  </button>
                  <button onclick="closeAwardModal()" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    ✅ Awesome, Continue
                  </button>
                </div>
              </div>
            \`;
            
            document.body.appendChild(modal);
            
            // Animate in
            setTimeout(() => {
              const awardModal = document.getElementById('awardModal');
              awardModal.style.transform = 'scale(1)';
            }, 100);
            
            // Store share data globally
            window.shareData = {
              level: levelName,
              emoji: emoji,
              tasks: tasksCompleted,
              xp: xpEarned,
              date: today
            };
          }
          
          function shareToFacebookGroup() {
            const data = window.shareData;
            const shareText = \`🎉 Just completed my \${data.emoji} \${data.level}! \n\n✅ \${data.tasks} tasks completed\n⭐ +\${data.xp} XP earned\n📅 \${data.date}\n\n#OnlineEmpires #DMOComplete #ConsistentAction #BusinessGrowth\n\nJoin us: https://www.facebook.com/groups/onlineempiresvip\`;
            
            // Open Facebook with pre-filled post
            const facebookUrl = \`https://www.facebook.com/groups/onlineempiresvip/\`;
            const facebookShareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(window.location.origin)}&quote=\${encodeURIComponent(shareText)}\`;
            
            window.open(facebookShareUrl, '_blank', 'width=600,height=400');
          }
          
          function copyShareText() {
            const data = window.shareData;
            const shareText = \`🎉 Just completed my \${data.emoji} \${data.level}! \n\n✅ \${data.tasks} tasks completed\n⭐ +\${data.xp} XP earned\n📅 \${data.date}\n\n#OnlineEmpires #DMOComplete #ConsistentAction #BusinessGrowth\n\nJoin us: https://www.facebook.com/groups/onlineempiresvip\`;
            
            navigator.clipboard.writeText(shareText).then(() => {
              // Show feedback
              const button = event.target;
              const originalText = button.innerHTML;
              button.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
              button.classList.add('bg-green-600');
              button.classList.remove('bg-gray-600');
              
              setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('bg-green-600');
                button.classList.add('bg-gray-600');
              }, 2000);
            });
          }
          
          function closeAwardModal() {
            const modal = document.querySelector('.fixed.inset-0.bg-black');
            if (modal) {
              const awardModal = document.getElementById('awardModal');
              awardModal.style.transform = 'scale(0)';
              setTimeout(() => {
                modal.remove();
              }, 300);
            }
          }
        `
      }} />
    </Layout>,
    { title: 'Daily Method (DMO) - Digital Era' }
  )
})

// Express DMO - 1 Hour Per Day
app.get('/dmo/express', (c) => {
  return c.render(
    <Layout title="Express DMO - 1 Hour Per Day" currentPage="dmo">
      <div class="mb-6">
        <button onclick="window.location.href='/dmo'" class="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <i class="fas fa-arrow-left mr-2"></i>
          Back to DMO Selection
        </button>
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold mb-2">Express DMO - 1 Hour Per Day</h1>
              <p class="text-blue-100">Perfect for busy beginners getting started</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold" id="expressProgress">0/6</div>
              <div class="text-blue-100 text-sm">tasks completed</div>
              <div class="mt-2 bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
                <i class="fas fa-clock mr-1"></i>
                <span id="timeUntilReset">Loading...</span> until reset
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress Section - NEW */}
      <div class="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
        <h3 class="text-xl font-bold text-gray-900 mb-4">📊 Today's Progress</h3>
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm text-gray-600 mb-1"><span id="completedTasks">0</span> of <span id="totalTasks">6</span> tasks completed</div>
                <div class="text-sm text-blue-600 font-medium">+<span id="earnedXP">0</span> XP earned today</div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-blue-600" id="progressPercent">0%</div>
                <div class="text-sm text-gray-600">completion</div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
                <p class="text-xs text-gray-500">Lock in progress and build your streak</p>
              </div>
              <button 
                id="submitDMOBtn" 
                onclick="submitDMO('express')" 
                class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                disabled
              >
                Submit DMO
              </button>
            </div>
          </div>
        </div>
        <div class="bg-gray-200 rounded-full h-3">
          <div id="progressBar" class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
        </div>
      </div>

      {/* Original Progress Summary - Keep for backward compatibility */}
      <div class="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6" style={{display: 'none'}}>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Today's Progress</h3>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-600">
                <span id="completedTasks">0</span> of <span id="totalTasks">6</span> tasks completed
              </div>
              <div class="text-sm text-blue-600 font-medium">
                +<span id="earnedXP">0</span> XP earned today
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-blue-600" id="progressPercent">0%</div>
            <div class="text-sm text-gray-600">completion</div>
          </div>
        </div>
        
        <div class="mt-4 bg-gray-200 rounded-full h-3">
          <div id="progressBar" class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
        </div>
        
        {/* Submit Section - Hidden since moved to top */}
        <div class="mt-6 space-y-4" style={{display: 'none'}}>
          <div class="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
            <div>
              <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
              <p class="text-xs text-gray-500">This will lock in your progress and add to your streak</p>
            </div>
            <button 
              id="submitDMOBtn2" 
              onclick="submitDMO('express')" 
              class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled
            >
              Submit DMO
            </button>
          </div>
          
          {/* Debug/Reset Section */}
          <div class="flex items-center justify-between bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div>
              <p class="text-sm text-yellow-800 mb-1">🐛 Debug: Having issues with progress tracking?</p>
              <p class="text-xs text-yellow-600">This will clear all saved data and reset the checkboxes</p>
            </div>
            <button 
              onclick="debugReset()" 
              class="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              Reset & Debug
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        {/* Social Media Connections - 15 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-users text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Social Media Connections</h3>
                <p class="text-gray-600 text-sm">15 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600" id="socialProgress">0/3</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="social" data-xp="10" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Check friend requests and respond to new connections</div>
                <div class="text-sm text-gray-600">Review and accept relevant connection requests (5 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+10 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="social" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Send 5-10 friend requests with personal messages</div>
                <div class="text-sm text-gray-600">Target relevant prospects in your niche (5 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+15 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="social" data-xp="10" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Engage with 10+ posts in your timeline</div>
                <div class="text-sm text-gray-600">Like, comment, and share valuable content (5 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+10 XP</div>
            </label>
          </div>
        </div>

        {/* Quick Conversations - 20 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-comments text-green-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Quick Conversations</h3>
                <p class="text-gray-600 text-sm">20 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600" id="conversationProgress">0/2</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversation" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Message 5-10 warm prospects with value-first approach</div>
                <div class="text-sm text-gray-600">Share tips, articles, or helpful resources (15 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+20 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversation" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Follow up with previous conversations</div>
                <div class="text-sm text-gray-600">Check in with recent contacts and continue building relationships (5 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+15 XP</div>
            </label>
          </div>
        </div>

        {/* Content Creation - 25 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-edit text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Content Creation</h3>
                <p class="text-gray-600 text-sm">25 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600" id="contentProgress">0/1</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Create and post 1 high-value post</div>
                <div class="text-sm text-gray-600">Share a tip, success story, or motivational content (25 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+25 XP</div>
            </label>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // 🚀 BULLETPROOF EXPRESS DMO PROGRESS TRACKING - SINGLE CLEAN IMPLEMENTATION
          console.log('🚀 Express DMO script loading...');
          
          // Global state
          let tasks = { social: 0, conversation: 0, content: 0 };
          let totalXP = 0;
          let completedCount = 0;
          const totalTasks = 6;
          
          // SINGLE DOM READY EVENT LISTENER
          document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ Express DMO page loaded');
            
            // Start countdown timer
            updateCountdownTimer();
            setInterval(updateCountdownTimer, 1000);
            
            // Load any saved progress
            loadTaskProgress();
            
            // Add event listeners to all checkboxes - ONLY ONCE
            const checkboxes = document.querySelectorAll('.task-checkbox');
            console.log('Found', checkboxes.length, 'checkboxes');
            
            checkboxes.forEach((checkbox, index) => {
              checkbox.addEventListener('change', function() {
                console.log('📋 Checkbox', index, 'changed to:', this.checked);
                updateAllProgress();
                saveTaskProgress();
                
                // Show XP notification for newly checked items
                if (this.checked) {
                  const xp = parseInt(this.dataset.xp);
                  showTaskComplete(xp);
                }
              });
            });
            
            // Force initial progress calculation
            updateAllProgress();
          });
          
          function updateAllProgress() {
            console.log('🔄 Calculating progress...');
            
            // Reset counters
            tasks = { social: 0, conversation: 0, content: 0 };
            totalXP = 0;
            completedCount = 0;
            
            const checkboxes = document.querySelectorAll('.task-checkbox');
            console.log('Checking', checkboxes.length, 'checkboxes...');
            
            checkboxes.forEach((checkbox, index) => {
              console.log('Checkbox', index, '- checked:', checkbox.checked, 'category:', checkbox.dataset.category);
              if (checkbox.checked) {
                const category = checkbox.dataset.category;
                const xp = parseInt(checkbox.dataset.xp) || 0;
                
                if (category === 'social') tasks.social++;
                if (category === 'conversation') tasks.conversation++;
                if (category === 'content') tasks.content++;
                
                totalXP += xp;
                completedCount++;
              }
            });
            
            console.log('📊 Final Progress:', {
              social: tasks.social,
              conversation: tasks.conversation,
              content: tasks.content,
              totalCompleted: completedCount,
              totalXP: totalXP
            });
            
            // Update all displays
            updateElement('socialProgress', tasks.social + '/3');
            updateElement('conversationProgress', tasks.conversation + '/2');
            updateElement('contentProgress', tasks.content + '/1');
            updateElement('expressProgress', completedCount + '/6');
            updateElement('completedTasks', completedCount);
            updateElement('earnedXP', totalXP);
            
            const percentage = Math.round((completedCount / totalTasks) * 100);
            updateElement('progressPercent', percentage + '%');
            
            // Update progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
              progressBar.style.width = percentage + '%';
              console.log('📈 Progress bar set to:', percentage + '%');
            }
            
            // Update submit button
            const submitBtn = document.getElementById('submitDMOBtn');
            if (submitBtn) {
              if (completedCount >= totalTasks) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Complete DMO 🎉';
                submitBtn.className = 'bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors';
                console.log('✅ Submit button ENABLED');
              } else {
                submitBtn.disabled = true;
                submitBtn.textContent = \`Complete \${totalTasks - completedCount} more tasks\`;
                submitBtn.className = 'bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed';
                console.log('❌ Submit button disabled -', (totalTasks - completedCount), 'tasks remaining');
              }
            }
            
            // Update global stats
            updateGlobalStats();
          }
          
          function updateElement(id, text) {
            const element = document.getElementById(id);
            if (element) {
              element.textContent = text;
              console.log('📝 Updated', id, 'to:', text);
            } else {
              console.warn('⚠️ Element not found:', id);
            }
          }
          
          function debugReset() {
            console.log('🔄 RESET: Clearing all data...');
            
            // Clear localStorage
            localStorage.clear();
            
            // Uncheck all boxes
            document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
              checkbox.checked = false;
              checkbox.disabled = false;
              console.log('⬜ Unchecked checkbox', index);
            });
            
            // Reset counters
            tasks = { social: 0, conversation: 0, content: 0 };
            totalXP = 0;
            completedCount = 0;
            
            // Update progress
            updateAllProgress();
            
            alert('🔄 RESET COMPLETE!\\n\\n✅ All data cleared\\n✅ All checkboxes unchecked\\n✅ Progress reset to 0\\n\\nNow manually check each task to test!');
          }
          
          function showTaskComplete(xp) {
            // Create floating XP notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            notification.innerHTML = \`
              <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>Task Complete! +\${xp} XP</span>
              </div>
            \`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
              notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
              notification.style.transform = 'translateX(100%)';
              setTimeout(() => document.body.removeChild(notification), 300);
            }, 2000);
          }
          
          function saveTaskProgress() {
            const today = new Date().toDateString();
            
            // Save which specific checkboxes are checked
            const checkedTasks = [];
            document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
              if (checkbox.checked) {
                checkedTasks.push({
                  index: index,
                  category: checkbox.dataset.category,
                  xp: parseInt(checkbox.dataset.xp)
                });
              }
            });
            
            const progress = {
              date: today,
              checkedTasks: checkedTasks,
              tasks: tasks,
              totalXP: totalXP,
              completedCount: completedCount,
              level: 'pocket-builder'
            };
            
            localStorage.setItem('dmo_daily_progress', JSON.stringify(progress));
            console.log('💾 Progress saved:', progress);
          }
          
          function loadTaskProgress() {
            const today = new Date().toDateString();
            const saved = localStorage.getItem('dmo_daily_progress');
            
            if (saved) {
              const progress = JSON.parse(saved);
              if (progress.date === today && progress.level === 'pocket-builder') {
                console.log('🔄 Loading saved progress:', progress);
                
                // Load the saved counts
                tasks = progress.tasks || { social: 0, conversation: 0, content: 0 };
                totalXP = progress.totalXP || 0;
                completedCount = progress.completedCount || 0;
                
                // Restore specific checkbox states
                if (progress.checkedTasks) {
                  const checkboxes = document.querySelectorAll('.task-checkbox');
                  progress.checkedTasks.forEach(savedTask => {
                    if (checkboxes[savedTask.index]) {
                      checkboxes[savedTask.index].checked = true;
                    }
                  });
                }
              }
            }
          }
          
          function updateCountdownTimer() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            updateElement('timeUntilReset', \`\${hours}h \${minutes}m \${seconds}s\`);
          }
          
          function updateGlobalStats() {
            let globalStats = JSON.parse(localStorage.getItem('dmo_stats') || '{"streak": 0, "todayCompleted": 0, "totalXP": 0, "lastCompletedDate": null}');
            
            globalStats.todayCompleted = completedCount;
            
            // Check if user completed all tasks today
            if (completedCount === totalTasks) {
              const today = new Date().toDateString();
              if (globalStats.lastCompletedDate !== today) {
                if (globalStats.lastCompletedDate === new Date(Date.now() - 86400000).toDateString()) {
                  globalStats.streak += 1;
                } else {
                  globalStats.streak = 1;
                }
                globalStats.lastCompletedDate = today;
              }
            }
            
            localStorage.setItem('dmo_stats', JSON.stringify(globalStats));
          }
          
          function submitDMO(level) {
            const today = new Date().toDateString();
            const todaysDMO = localStorage.getItem('todays_dmo_selection');
            
            if (!todaysDMO) {
              alert('🎉 EXPRESS DMO SUBMITTED!\\n\\n(This is a demo - full submission logic would save to database)');
              return;
            }
            
            const dmoData = JSON.parse(todaysDMO);
            
            // Verify this is the correct DMO for today
            if (dmoData.level !== level || dmoData.date !== today) {
              alert('Error: This is not your selected DMO for today.');
              return;
            }
            
            // Check if already submitted
            if (dmoData.submitted) {
              alert('You have already submitted your DMO for today! Great job! ✅');
              return;
            }
            
            // Mark as submitted
            dmoData.submitted = true;
            dmoData.submittedAt = new Date().toISOString();
            dmoData.completedTasks = completedCount;
            dmoData.totalXP = totalXP;
            dmoData.completionPercentage = Math.round((completedCount / totalTasks) * 100);
            
            localStorage.setItem('todays_dmo_selection', JSON.stringify(dmoData));
            
            // Update global stats for streak and completion
            const globalStats = JSON.parse(localStorage.getItem('dmo_stats') || '{}');
            globalStats.streak = (globalStats.streak || 0) + 1;
            globalStats.todayCompleted = completedCount;
            globalStats.totalXP = (globalStats.totalXP || 0) + totalXP;
            globalStats.lastCompletedDate = today;
            localStorage.setItem('dmo_stats', JSON.stringify(globalStats));
            
            // Show success message with award
            showDMOCompletionAward(level, completedCount, totalXP);
            
            // Disable submit button and update UI
            const submitBtn = document.getElementById('submitDMOBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = '🎉 Completed Today!';
            submitBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
            submitBtn.classList.remove('hover:bg-blue-700', 'hover:bg-green-700', 'hover:bg-orange-700', 'hover:bg-red-700');
            
            // Disable all task checkboxes
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
              checkbox.disabled = true;
            });
            
            // Add completion badge
            const progressSummary = document.querySelector('.bg-gradient-to-r');
            progressSummary.classList.add('ring-2', 'ring-green-500');
            
            // Redirect to main DMO page after 3 seconds
            setTimeout(() => {
              window.location.href = '/dmo';
            }, 3000);
          }


        `
      }} />
    </Layout>,
    { title: 'Express DMO - Digital Era' }
  )
})

// Pocket Builder DMO - 2 Hours Per Day
app.get('/dmo/pocket-builder', (c) => {
  return c.render(
    <Layout title="Pocket Builder DMO - 2 Hours Per Day" currentPage="dmo">
      <div class="mb-6">
        <button onclick="window.location.href='/dmo'" class="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <i class="fas fa-arrow-left mr-2"></i>
          Back to DMO Selection
        </button>
        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold mb-2">Pocket Builder DMO - 2 Hours Per Day</h1>
              <p class="text-green-100">For those building their business steadily</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold" id="pocketProgress">0/10</div>
              <div class="text-green-100 text-sm">tasks completed</div>
              <div class="mt-2 bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
                <i class="fas fa-clock mr-1"></i>
                <span id="timeUntilReset">Loading...</span> until reset
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        {/* Connections - 30 minutes */
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-users text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Connections</h3>
                <p class="text-gray-600 text-sm">30 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600" id="connectionsProgress">0/4</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Check and respond to friend requests</div>
                <div class="text-sm text-gray-600">Accept relevant connections (5 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+15 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Send 15-25 friend requests with personal messages</div>
                <div class="text-sm text-gray-600">Target quality prospects in your market (10 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+20 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Engage with 20+ posts in your timeline</div>
                <div class="text-sm text-gray-600">Like, comment meaningfully, and share (10 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+15 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="10" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Join and engage in 2-3 relevant groups</div>
                <div class="text-sm text-gray-600">Find and participate in industry groups (5 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+10 XP</div>
            </label>
          </div>
        </div>
      }

        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-comments text-green-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Conversations</h3>
                <p class="text-gray-600 text-sm">45 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600" id="conversationsProgress">0/3</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Message 10-15 warm prospects with value</div>
                <div class="text-sm text-gray-600">Share resources, tips, or helpful content (20 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+25 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Follow up with previous conversations</div>
                <div class="text-sm text-gray-600">Continue building relationships (15 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+20 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Conduct 1-2 product/opportunity mini-presentations</div>
                <div class="text-sm text-gray-600">Share your business opportunity briefly (10 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+15 XP</div>
            </label>
          </div>
        </div>

        {/* Content Creation - 45 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-edit text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Content Creation</h3>
                <p class="text-gray-600 text-sm">45 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600" id="contentCreationProgress">0/3</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Create and post 2-3 high-value posts</div>
                <div class="text-sm text-gray-600">Educational, motivational, or behind-the-scenes content (20 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+25 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Record and post 1 short educational video</div>
                <div class="text-sm text-gray-600">Quick tip, testimonial, or product demo (15 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+20 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Update stories with behind-the-scenes content</div>
                <div class="text-sm text-gray-600">Show your daily routine or business activities (10 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+15 XP</div>
            </label>
          </div>
        </div>
      </div>

      {/* TODAY'S PROGRESS SECTION - MOVED TO TOP */}
      <div class="mb-8 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 border border-gray-200">
        <h3 class="text-xl font-bold text-gray-900 mb-4">📊 Today's Progress</h3>
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm text-gray-600 mb-1"><span id="completedTasks">0</span> of <span id="totalTasks">10</span> tasks completed</div>
                <div class="text-sm text-green-600 font-medium">+<span id="earnedXP">0</span> XP earned today</div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-green-600" id="progressPercent">0%</div>
                <div class="text-sm text-gray-600">completion</div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
                <p class="text-xs text-gray-500">Lock in progress and build your streak</p>
              </div>
              <button 
                id="submitDMOBtn" 
                onclick="submitDMO('pocket-builder')" 
                class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                disabled
              >
                Submit DMO
              </button>
            </div>
          </div>
        </div>
        <div class="bg-gray-200 rounded-full h-3">
          <div id="progressBar" class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
        </div>
      </div>

      {/* ORIGINAL PROGRESS SUMMARY - MOVED TO BOTTOM */}
      <div class="mt-8 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6" style={{display: 'none'}}>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Today's Progress</h3>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-600">
                <span id="completedTasks">0</span> of <span id="totalTasks">10</span> tasks completed
              </div>
              <div class="text-sm text-green-600 font-medium">
                +<span id="earnedXP">0</span> XP earned today
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-green-600" id="progressPercent">0%</div>
            <div class="text-sm text-gray-600">completion</div>
          </div>
        </div>
        
        <div class="mt-4 bg-gray-200 rounded-full h-3">
          <div id="progressBar" class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
        </div>
        
        {/* Submit Section - Hidden since moved to top */}
        <div class="mt-6 flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200" style={{display: 'none'}}>
          <div>
            <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
            <p class="text-xs text-gray-500">This will lock in your progress and add to your streak</p>
          </div>
          <button 
            id="submitDMOBtn2" 
            onclick="submitDMO('pocket-builder')" 
            class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled
          >
            Submit DMO
          </button>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // 🚀 BULLETPROOF POCKET BUILDER DMO PROGRESS TRACKING - SINGLE CLEAN IMPLEMENTATION
          console.log('🚀 Pocket Builder DMO script loading...');
          
          // Global state
          let tasks = { connections: 0, conversations: 0, content: 0 };
          let totalXP = 0;
          let completedCount = 0;
          const totalTasks = 10;
          
          // SINGLE DOM READY EVENT LISTENER
          document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ Pocket Builder DMO page loaded');
            
            // Start countdown timer
            updateCountdownTimer();
            setInterval(updateCountdownTimer, 1000);
            
            // Load any saved progress
            loadTaskProgress();
            
            // Add event listeners to all checkboxes - ONLY ONCE
            const checkboxes = document.querySelectorAll('.task-checkbox');
            console.log('Found', checkboxes.length, 'checkboxes');
            
            checkboxes.forEach((checkbox, index) => {
              checkbox.addEventListener('change', function() {
                console.log('📋 Checkbox', index, 'changed to:', this.checked);
                updateAllProgress();
                saveTaskProgress();
                
                // Show XP notification for newly checked items
                if (this.checked) {
                  const xp = parseInt(this.dataset.xp);
                  showTaskComplete(xp);
                }
              });
            });
            
            // Force initial progress calculation
            updateAllProgress();
          });
          
          function updateCountdownTimer() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const timerElement = document.getElementById('timeUntilReset');
            if (timerElement) {
              timerElement.textContent = \`\${hours}h \${minutes}m \${seconds}s\`;
            }
          }
          
          function updateAllProgress() {
            console.log('🔄 Calculating progress...');
            
            // Reset counters
            tasks = { connections: 0, conversations: 0, content: 0 };
            totalXP = 0;
            completedCount = 0;
            
            const checkboxes = document.querySelectorAll('.task-checkbox');
            console.log('Checking', checkboxes.length, 'checkboxes...');
            
            checkboxes.forEach((checkbox, index) => {
              console.log('Checkbox', index, '- checked:', checkbox.checked, 'category:', checkbox.dataset.category);
              if (checkbox.checked) {
                const category = checkbox.dataset.category;
                const xp = parseInt(checkbox.dataset.xp) || 0;
                
                if (category === 'connections') tasks.connections++;
                if (category === 'conversations') tasks.conversations++;
                if (category === 'content') tasks.content++;
                
                totalXP += xp;
                completedCount++;
              }
            });
            
            console.log('📊 Final Progress:', {
              connections: tasks.connections,
              conversations: tasks.conversations,
              content: tasks.content,
              totalCompleted: completedCount,
              totalXP: totalXP
            });
            
            // Update all displays
            updateElement('connectionsProgress', tasks.connections + '/4');
            updateElement('conversationsProgress', tasks.conversations + '/3');
            updateElement('contentCreationProgress', tasks.content + '/3');
            updateElement('pocketProgress', completedCount + '/10');
            updateElement('completedTasks', completedCount);
            updateElement('earnedXP', totalXP);
            
            const percentage = Math.round((completedCount / totalTasks) * 100);
            updateElement('progressPercent', percentage + '%');
            
            // Update progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
              progressBar.style.width = percentage + '%';
              console.log('📈 Progress bar set to:', percentage + '%');
            }
            
            // Update submit button
            const submitBtn = document.getElementById('submitDMOBtn');
            if (submitBtn) {
              if (completedCount >= totalTasks) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Complete DMO 🎉';
                submitBtn.className = 'bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors';
                console.log('✅ Submit button ENABLED');
              } else {
                submitBtn.disabled = true;
                submitBtn.textContent = \`Complete \${totalTasks - completedCount} more tasks\`;
                submitBtn.className = 'bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed';
                console.log('❌ Submit button disabled -', (totalTasks - completedCount), 'tasks remaining');
              }
            }
            
            // Update global stats
            updateGlobalStats();
          }
          
          function updateElement(id, text) {
            const element = document.getElementById(id);
            if (element) {
              element.textContent = text;
              console.log('📝 Updated', id, 'to:', text);
            } else {
              console.warn('⚠️ Element not found:', id);
            }
          }
          
          function showTaskComplete(xp) {
            // Same as Express implementation
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            notification.innerHTML = \`
              <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>Task Complete! +\${xp} XP</span>
              </div>
            \`;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.style.transform = 'translateX(0)', 100);
            setTimeout(() => {
              notification.style.transform = 'translateX(100%)';
              setTimeout(() => document.body.removeChild(notification), 300);
            }, 2000);
          }
          
          function saveTaskProgress() {
            const today = new Date().toDateString();
            
            // Save which specific checkboxes are checked
            const checkedTasks = [];
            document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
              if (checkbox.checked) {
                checkedTasks.push({
                  index: index,
                  category: checkbox.dataset.category,
                  xp: parseInt(checkbox.dataset.xp)
                });
              }
            });
            
            const progress = {
              date: today,
              checkedTasks: checkedTasks,
              tasks: tasks,
              totalXP: totalXP,
              completedCount: completedCount,
              level: 'pocket-builder'
            };
            localStorage.setItem('dmo_daily_progress', JSON.stringify(progress));
          }
          
          function loadTaskProgress() {
            const today = new Date().toDateString();
            const saved = localStorage.getItem('dmo_daily_progress');
            
            if (saved) {
              const progress = JSON.parse(saved);
              if (progress.date === today && progress.level === 'pocket-builder') {
                console.log('🔄 Loading saved progress:', progress);
                
                // Load the saved counts
                tasks = progress.tasks || { connections: 0, conversations: 0, content: 0 };
                totalXP = progress.totalXP || 0;
                completedCount = progress.completedCount || 0;
                
                // Restore specific checkbox states
                if (progress.checkedTasks) {
                  const checkboxes = document.querySelectorAll('.task-checkbox');
                  progress.checkedTasks.forEach(savedTask => {
                    if (checkboxes[savedTask.index]) {
                      checkboxes[savedTask.index].checked = true;
                    }
                  });
                } else {
                  // Fallback to old method
                  tasks = progress.tasks;
                  totalXP = progress.totalXP;
                  completedCount = progress.completedCount;
                  
                  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                    const category = checkbox.dataset.category;
                    const categoryProgress = tasks[category];
                    const categoryTasks = document.querySelectorAll(\`[data-category="\${category}"]\`);
                    
                    for (let i = 0; i < categoryProgress; i++) {
                      if (categoryTasks[i]) {
                        categoryTasks[i].checked = true;
                      }
                    }
                  });
                }
              }
            }
          }
          
          function updateGlobalStats() {
            let globalStats = JSON.parse(localStorage.getItem('dmo_stats') || '{"streak": 0, "todayCompleted": 0, "totalXP": 0, "lastCompletedDate": null}');
            globalStats.todayCompleted = completedCount;
            
            if (completedCount === totalTasks) {
              const today = new Date().toDateString();
              if (globalStats.lastCompletedDate !== today) {
                if (globalStats.lastCompletedDate === new Date(Date.now() - 86400000).toDateString()) {
                  globalStats.streak += 1;
                } else {
                  globalStats.streak = 1;
                }
                globalStats.lastCompletedDate = today;
              }
            }
            
            globalStats.totalXP = (globalStats.totalXP || 0) + totalXP;
            localStorage.setItem('dmo_stats', JSON.stringify(globalStats));
          }
        `
      }} />
    </Layout>,
    { title: 'Pocket Builder DMO - Digital Era' }
  )
})

// Steady Climber DMO - 4 Hours Per Day
app.get('/dmo/steady-climber', (c) => {
  return c.render(
    <Layout title="Steady Climber DMO - 4 Hours Per Day" currentPage="dmo">
      <div class="mb-6">
        <button onclick="window.location.href='/dmo'" class="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <i class="fas fa-arrow-left mr-2"></i>
          Back to DMO Selection
        </button>
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold mb-2">Steady Climber DMO - 4 Hours Per Day</h1>
              <p class="text-orange-100">For serious business builders</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold" id="steadyProgress">0/15</div>
              <div class="text-orange-100 text-sm">tasks completed</div>
              <div class="mt-2 bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
                <i class="fas fa-clock mr-1"></i>
                <span id="timeUntilReset">Loading...</span> until reset
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S PROGRESS SECTION */}
      <div class="mb-8 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-6 border border-gray-200">
        <h3 class="text-xl font-bold text-gray-900 mb-4">📊 Today's Progress</h3>
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm text-gray-600 mb-1"><span id="completedTasks">0</span> of <span id="totalTasks">15</span> tasks completed</div>
                <div class="text-sm text-orange-600 font-medium">+<span id="earnedXP">0</span> XP earned today</div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-orange-600" id="progressPercent">0%</div>
                <div class="text-sm text-gray-600">completion</div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
                <p class="text-xs text-gray-500">Lock in progress and build your streak</p>
              </div>
              <button 
                id="submitDMOBtn" 
                onclick="submitDMO('steady-climber')" 
                class="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                disabled
              >
                Submit DMO
              </button>
            </div>
          </div>
        </div>
        <div class="bg-gray-200 rounded-full h-3">
          <div id="progressBar" class="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
        </div>
      </div>

      {/* ORIGINAL PROGRESS SUMMARY */}
      <div class="mb-8 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-6" style={{display: 'none'}}>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Today's Progress</h3>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-600">
                <span id="completedTasks">0</span> of <span id="totalTasks">15</span> tasks completed
              </div>
              <div class="text-sm text-orange-600 font-medium">
                +<span id="earnedXP">0</span> XP earned today
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-orange-600" id="progressPercent">0%</div>
            <div class="text-sm text-gray-600">completion</div>
          </div>
        </div>
        
        <div class="mt-4 bg-gray-200 rounded-full h-3">
          <div id="progressBar" class="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
        </div>
        
        {/* Submit Section - Hidden since moved to top */}
        <div class="mt-6 flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200" style={{display: 'none'}}>
          <div>
            <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
            <p class="text-xs text-gray-500">This will lock in your progress and add to your streak</p>
          </div>
          <button 
            id="submitDMOBtn2" 
            onclick="submitDMO('steady-climber')" 
            class="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled
          >
            Submit DMO
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        {/* Connections - 60 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-users text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Connections</h3>
                <p class="text-gray-600 text-sm">60 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600" id="connectionsProgress">0/6</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Check friend requests and respond to new connections</div>
                <div class="text-sm text-gray-600">Review and accept quality connections (10 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+20 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Send 25-50 friend requests with personal messages</div>
                <div class="text-sm text-gray-600">Target high-quality prospects with personalized outreach (20 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+25 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Engage with 20+ posts in your timeline</div>
                <div class="text-sm text-gray-600">Meaningful comments and shares (15 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+20 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Join and engage in 3-5 relevant groups</div>
                <div class="text-sm text-gray-600">Active participation in industry groups (10 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+15 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="10" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Research and connect with industry influencers</div>
                <div class="text-sm text-gray-600">Find and connect with key people in your niche (5 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+10 XP</div>
            </label>
          </div>
        </div>

        {/* Conversations - 90 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-comments text-green-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Conversations</h3>
                <p class="text-gray-600 text-sm">90 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600" id="conversationsProgress">0/5</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="30" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Message 15-20 warm prospects with value-first approach</div>
                <div class="text-sm text-gray-600">Share tips, resources, and build relationships (30 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+30 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Follow up with previous conversations</div>
                <div class="text-sm text-gray-600">Continue nurturing existing relationships (20 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+25 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="35" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Conduct 2-3 product/opportunity presentations</div>
                <div class="text-sm text-gray-600">Formal business presentations with interested prospects (40 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+35 XP</div>
            </label>
          </div>
        </div>

        {/* Content Creation - 90 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-edit text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Content Creation</h3>
                <p class="text-gray-600 text-sm">90 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600" id="contentCreationProgress">0/4</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="30" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Create and post 2-3 high-value posts</div>
                <div class="text-sm text-gray-600">Educational, motivational, or success stories (30 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+30 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="35" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Record and post 1 educational video</div>
                <div class="text-sm text-gray-600">Product demo, testimonial, or training content (45 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+35 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Update stories with behind-the-scenes content</div>
                <div class="text-sm text-gray-600">Show daily activities and business journey (15 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+20 XP</div>
            </label>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // 🚀 BULLETPROOF STEADY CLIMBER DMO PROGRESS TRACKING - SINGLE CLEAN IMPLEMENTATION
          console.log('🚀 Steady Climber DMO script loading...');
          
          // Global state
          let tasks = { connections: 0, conversations: 0, content: 0 };
          let totalXP = 0;
          let completedCount = 0;
          const totalTasks = 15;
          
          // SINGLE DOM READY EVENT LISTENER
          document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ Steady Climber DMO page loaded');
            
            // Start countdown timer
            updateCountdownTimer();
            setInterval(updateCountdownTimer, 1000);
            
            // Load any saved progress
            loadTaskProgress();
            
            // Add event listeners to all checkboxes - ONLY ONCE
            const checkboxes = document.querySelectorAll('.task-checkbox');
            console.log('Found', checkboxes.length, 'checkboxes');
            
            checkboxes.forEach((checkbox, index) => {
              checkbox.addEventListener('change', function() {
                console.log('📋 Checkbox', index, 'changed to:', this.checked);
                updateAllProgress();
                saveTaskProgress();
                
                // Show XP notification for newly checked items
                if (this.checked) {
                  const xp = parseInt(this.dataset.xp);
                  showTaskComplete(xp);
                }
              });
            });
            
            // Force initial progress calculation
            updateAllProgress();
          });
          
          function updateCountdownTimer() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const timerElement = document.getElementById('timeUntilReset');
            if (timerElement) {
              timerElement.textContent = \`\${hours}h \${minutes}m \${seconds}s\`;
            }
          }
          
          function updateAllProgress() {
            console.log('🔄 Calculating progress...');
            
            // Reset counters
            tasks = { connections: 0, conversations: 0, content: 0 };
            totalXP = 0;
            completedCount = 0;
            
            const checkboxes = document.querySelectorAll('.task-checkbox');
            console.log('Checking', checkboxes.length, 'checkboxes...');
            
            checkboxes.forEach((checkbox, index) => {
              console.log('Checkbox', index, '- checked:', checkbox.checked, 'category:', checkbox.dataset.category);
              if (checkbox.checked) {
                const category = checkbox.dataset.category;
                const xp = parseInt(checkbox.dataset.xp) || 0;
                
                if (category === 'connections') tasks.connections++;
                if (category === 'conversations') tasks.conversations++;
                if (category === 'content') tasks.content++;
                
                totalXP += xp;
                completedCount++;
              }
            });
            
            console.log('📊 Final Progress:', {
              connections: tasks.connections,
              conversations: tasks.conversations,
              content: tasks.content,  
              totalCompleted: completedCount,
              totalXP: totalXP
            });
            
            // Update all displays
            updateElement('connectionsProgress', tasks.connections + '/6');
            updateElement('conversationsProgress', tasks.conversations + '/5');
            updateElement('contentCreationProgress', tasks.content + '/4');
            updateElement('steadyProgress', completedCount + '/15');
            updateElement('completedTasks', completedCount);
            updateElement('earnedXP', totalXP);
            
            const percentage = Math.round((completedCount / totalTasks) * 100);
            updateElement('progressPercent', percentage + '%');
            
            // Update progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
              progressBar.style.width = percentage + '%';
              console.log('📈 Progress bar set to:', percentage + '%');
            }
            
            // Update submit button
            const submitBtn = document.getElementById('submitDMOBtn');
            if (submitBtn) {
              if (completedCount >= totalTasks) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Complete DMO 🎉';
                submitBtn.className = 'bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors';
                console.log('✅ Submit button ENABLED');
              } else {
                submitBtn.disabled = true;
                submitBtn.textContent = \`Complete \${totalTasks - completedCount} more tasks\`;
                submitBtn.className = 'bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed';
                console.log('❌ Submit button disabled -', (totalTasks - completedCount), 'tasks remaining');
              }
            }
            
            // Update global stats
            updateGlobalStats();
          }
          
          function updateElement(id, text) {
            const element = document.getElementById(id);
            if (element) {
              element.textContent = text;
              console.log('📝 Updated', id, 'to:', text);
            } else {
              console.warn('⚠️ Element not found:', id);
            }
          }
          
          function recalculateProgress() {
            // Reset counters
            tasks = { connections: 0, conversations: 0, content: 0 };
            totalXP = 0;
            completedCount = 0;
            
            // Count checked checkboxes
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
              if (checkbox.checked) {
                const category = checkbox.dataset.category;
                const xp = parseInt(checkbox.dataset.xp);
                tasks[category]++;
                totalXP += xp;
                completedCount++;
              }
            });
            
            updateProgress();
          }
          
          function showTaskComplete(xp) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            notification.innerHTML = \`
              <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>Task Complete! +\${xp} XP</span>
              </div>
            \`;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.style.transform = 'translateX(0)', 100);
            setTimeout(() => {
              notification.style.transform = 'translateX(100%)';
              setTimeout(() => document.body.removeChild(notification), 300);
            }, 2000);
          }
          
          function saveTaskProgress() {
            const today = new Date().toDateString();
            
            // Save which specific checkboxes are checked
            const checkedTasks = [];
            document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
              if (checkbox.checked) {
                checkedTasks.push({
                  index: index,
                  category: checkbox.dataset.category,
                  xp: parseInt(checkbox.dataset.xp)
                });
              }
            });
            
            const progress = {
              date: today,
              checkedTasks: checkedTasks,
              tasks: tasks,
              totalXP: totalXP,
              completedCount: completedCount,
              level: 'steady-climber'
            };
            localStorage.setItem('dmo_daily_progress', JSON.stringify(progress));
          }
          
          function loadTaskProgress() {
            const today = new Date().toDateString();
            const saved = localStorage.getItem('dmo_daily_progress');
            
            if (saved) {
              const progress = JSON.parse(saved);
              if (progress.date === today && progress.level === 'steady-climber') {
                // Restore specific checkbox states if checkedTasks exists
                if (progress.checkedTasks) {
                  const checkboxes = document.querySelectorAll('.task-checkbox');
                  progress.checkedTasks.forEach(task => {
                    if (checkboxes[task.index]) {
                      checkboxes[task.index].checked = true;
                    }
                  });
                  
                  // Recalculate from actual checkbox states
                  recalculateProgress();
                } else {
                  // Fallback to old method
                  tasks = progress.tasks;
                  totalXP = progress.totalXP;
                  completedCount = progress.completedCount;
                  
                  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                    const category = checkbox.dataset.category;
                    const categoryProgress = tasks[category];
                    const categoryTasks = document.querySelectorAll(\`[data-category="\${category}"]\`);
                    
                    for (let i = 0; i < categoryProgress; i++) {
                      if (categoryTasks[i]) {
                        categoryTasks[i].checked = true;
                      }
                    }
                  });
                }
              }
            }
          }
          
          function updateGlobalStats() {
            let globalStats = JSON.parse(localStorage.getItem('dmo_stats') || '{"streak": 0, "todayCompleted": 0, "totalXP": 0, "lastCompletedDate": null}');
            globalStats.todayCompleted = completedCount;
            
            if (completedCount === totalTasks) {
              const today = new Date().toDateString();
              if (globalStats.lastCompletedDate !== today) {
                if (globalStats.lastCompletedDate === new Date(Date.now() - 86400000).toDateString()) {
                  globalStats.streak += 1;
                } else {
                  globalStats.streak = 1;
                }
                globalStats.lastCompletedDate = today;
              }
            }
            
            globalStats.totalXP = (globalStats.totalXP || 0) + totalXP;
            localStorage.setItem('dmo_stats', JSON.stringify(globalStats));
          }
        `
      }} />
    </Layout>,
    { title: 'Steady Climber DMO - Digital Era' }
  )
})

// Full Throttle DMO - 6+ Hours Per Day
app.get('/dmo/full-throttle', (c) => {
  return c.render(
    <Layout title="Full Throttle DMO - 6+ Hours Per Day" currentPage="dmo">
      <div class="mb-6">
        <button onclick="window.location.href='/dmo'" class="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <i class="fas fa-arrow-left mr-2"></i>
          Back to DMO Selection
        </button>
        <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold mb-2">Full Throttle DMO - 6+ Hours Per Day</h1>
              <p class="text-red-100">Maximum acceleration for rapid growth</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold" id="throttleProgress">0/20</div>
              <div class="text-red-100 text-sm">tasks completed</div>
              <div class="mt-2 bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
                <i class="fas fa-clock mr-1"></i>
                <span id="timeUntilReset">Loading...</span> until reset
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S PROGRESS SECTION */}
      <div class="mb-8 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl p-6 border border-gray-200">
        <h3 class="text-xl font-bold text-gray-900 mb-4">📊 Today's Progress</h3>
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm text-gray-600 mb-1"><span id="completedTasks">0</span> of <span id="totalTasks">20</span> tasks completed</div>
                <div class="text-sm text-red-600 font-medium">+<span id="earnedXP">0</span> XP earned today</div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-red-600" id="progressPercent">0%</div>
                <div class="text-sm text-gray-600">completion</div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-4 border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
                <p class="text-xs text-gray-500">Lock in progress and build your streak</p>
              </div>
              <button 
                id="submitDMOBtn" 
                onclick="submitDMO('full-throttle')" 
                class="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                disabled
              >
                Submit DMO
              </button>
            </div>
          </div>
        </div>
        <div class="bg-gray-200 rounded-full h-3">
          <div id="progressBar" class="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
        </div>
      </div>

      {/* ORIGINAL PROGRESS SUMMARY */}
      <div class="mb-8 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl p-6" style={{display: 'none'}}>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Today's Progress</h3>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-600">
                <span id="completedTasks">0</span> of <span id="totalTasks">20</span> tasks completed
              </div>
              <div class="text-sm text-red-600 font-medium">
                +<span id="earnedXP">0</span> XP earned today
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-red-600" id="progressPercent">0%</div>
            <div class="text-sm text-gray-600">completion</div>
          </div>
        </div>
        
        <div class="mt-4 bg-gray-200 rounded-full h-3">
          <div id="progressBar" class="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500" style={{width: '0%'}}></div>
        </div>
        
        {/* Submit Section - Hidden since moved to top */}
        <div class="mt-6 flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200" style={{display: 'none'}}>
          <div>
            <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
            <p class="text-xs text-gray-500">This will lock in your progress and add to your streak</p>
          </div>
          <button 
            id="submitDMOBtn2" 
            onclick="submitDMO('full-throttle')" 
            class="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled
          >
            Submit DMO
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        {/* Connections - 120 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-users text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Connections</h3>
                <p class="text-gray-600 text-sm">120 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600" id="connectionsProgress">0/8</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Check friend requests and respond to connections</div>
                <div class="text-sm text-gray-600">Review and manage all incoming requests (15 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+25 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="35" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Send 50-100 friend requests with personal messages</div>
                <div class="text-sm text-gray-600">Mass targeted outreach with personalization (30 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+35 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="30" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Engage with 30+ posts in your timeline</div>
                <div class="text-sm text-gray-600">Deep engagement with meaningful comments (25 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+30 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Join and actively engage in 5-10 relevant groups</div>
                <div class="text-sm text-gray-600">Post valuable content and engage discussions (20 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+25 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Research and connect with industry influencers</div>
                <div class="text-sm text-gray-600">Strategic networking with key industry leaders (15 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+20 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Host or attend networking events/webinars</div>
                <div class="text-sm text-gray-600">Participate in online events and make connections (15 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+15 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Create and optimize professional profiles across platforms</div>
                <div class="text-sm text-gray-600">Update LinkedIn, Facebook, Instagram business profiles (15 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+20 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-blue-600" data-category="connections" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Engage with competitor's audiences and followers</div>
                <div class="text-sm text-gray-600">Strategic engagement to build relationships (20 min)</div>
              </div>
              <div class="text-blue-600 font-medium text-sm">+25 XP</div>
            </label>
          </div>
        </div>

        {/* Conversations - 150 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-comments text-green-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Conversations</h3>
                <p class="text-gray-600 text-sm">150 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600" id="conversationsProgress">0/6</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="40" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Message 25-50 warm prospects with value</div>
                <div class="text-sm text-gray-600">Personalized outreach with high-value content (45 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+40 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="35" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Follow up with previous conversations</div>
                <div class="text-sm text-gray-600">Systematic follow-up with existing prospects (30 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+35 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="45" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Conduct 3-5 product/opportunity presentations</div>
                <div class="text-sm text-gray-600">Full business presentations with qualified prospects (75 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+45 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="30" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Host live Q&A sessions or consultations</div>
                <div class="text-sm text-gray-600">Interactive sessions to build trust and rapport (25 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+30 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Engage in high-value group discussions</div>
                <div class="text-sm text-gray-600">Participate in industry forums and communities (20 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+25 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversations" data-xp="20" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Schedule and conduct discovery calls</div>
                <div class="text-sm text-gray-600">One-on-one calls to understand prospect needs (20 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+20 XP</div>
            </label>
          </div>
        </div>

        {/* Content Creation - 90 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-edit text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Content Creation</h3>
                <p class="text-gray-600 text-sm">90 minutes</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-purple-600" id="contentCreationProgress">0/6</div>
              <div class="text-gray-500 text-xs">completed</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="35" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Create and post 3-5 high-value posts</div>
                <div class="text-sm text-gray-600">Mix of educational, motivational, and promotional content (30 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+35 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="40" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Record and post 1 comprehensive educational video</div>
                <div class="text-sm text-gray-600">In-depth training or product demonstration (30 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+40 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Update stories with behind-the-scenes content</div>
                <div class="text-sm text-gray-600">Multiple story updates throughout the day (15 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+25 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="30" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Write and publish 1 blog post or article</div>
                <div class="text-sm text-gray-600">Long-form content for your website or LinkedIn (15 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+30 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="35" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Create podcast episodes or audio content</div>
                <div class="text-sm text-gray-600">Record and publish audio content for your audience (30 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+35 XP</div>
            </label>

            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-purple-600" data-category="content" data-xp="25" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Design and post infographics or visual content</div>
                <div class="text-sm text-gray-600">Create engaging visual content for social media (15 min)</div>
              </div>
              <div class="text-purple-600 font-medium text-sm">+25 XP</div>
            </label>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // 🚀 BULLETPROOF FULL THROTTLE DMO PROGRESS TRACKING - SINGLE CLEAN IMPLEMENTATION
          console.log('🚀 Full Throttle DMO script loading...');
          
          // Global state
          let tasks = { connections: 0, conversations: 0, content: 0 };
          let totalXP = 0;
          let completedCount = 0;
          const totalTasks = 20;
          
          // SINGLE DOM READY EVENT LISTENER
          document.addEventListener('DOMContentLoaded', function() {
            console.log('✅ Full Throttle DMO page loaded');
            
            // Start countdown timer
            updateCountdownTimer();
            setInterval(updateCountdownTimer, 1000);
            
            // Load any saved progress
            loadTaskProgress();
            
            // Add event listeners to all checkboxes - ONLY ONCE
            const checkboxes = document.querySelectorAll('.task-checkbox');
            console.log('Found', checkboxes.length, 'checkboxes');
            
            checkboxes.forEach((checkbox, index) => {
              checkbox.addEventListener('change', function() {
                console.log('📋 Checkbox', index, 'changed to:', this.checked);
                updateAllProgress();
                saveTaskProgress();
                
                // Show XP notification for newly checked items
                if (this.checked) {
                  const xp = parseInt(this.dataset.xp);
                  showTaskComplete(xp);
                }
              });
            });
            
            // Force initial progress calculation
            updateAllProgress();
          });
          
          function updateCountdownTimer() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const timerElement = document.getElementById('timeUntilReset');
            if (timerElement) {
              timerElement.textContent = \`\${hours}h \${minutes}m \${seconds}s\`;
            }
          }
          
          function updateAllProgress() {
            console.log('🔄 Calculating progress...');
            
            // Reset counters
            tasks = { connections: 0, conversations: 0, content: 0 };
            totalXP = 0;
            completedCount = 0;
            
            const checkboxes = document.querySelectorAll('.task-checkbox');
            console.log('Checking', checkboxes.length, 'checkboxes...');
            
            checkboxes.forEach((checkbox, index) => {
              console.log('Checkbox', index, '- checked:', checkbox.checked, 'category:', checkbox.dataset.category);
              if (checkbox.checked) {
                const category = checkbox.dataset.category;
                const xp = parseInt(checkbox.dataset.xp) || 0;
                
                if (category === 'connections') tasks.connections++;
                if (category === 'conversations') tasks.conversations++;
                if (category === 'content') tasks.content++;
                
                totalXP += xp;
                completedCount++;
              }
            });
            
            console.log('📊 Final Progress:', {
              connections: tasks.connections,
              conversations: tasks.conversations,
              content: tasks.content,
              totalCompleted: completedCount,
              totalXP: totalXP
            });
            
            // Update all displays
            updateElement('connectionsProgress', tasks.connections + '/8');
            updateElement('conversationsProgress', tasks.conversations + '/6');
            updateElement('contentCreationProgress', tasks.content + '/6');
            updateElement('throttleProgress', completedCount + '/20');
            updateElement('completedTasks', completedCount);
            updateElement('earnedXP', totalXP);
            
            const percentage = Math.round((completedCount / totalTasks) * 100);
            updateElement('progressPercent', percentage + '%');
            
            // Update progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
              progressBar.style.width = percentage + '%';
              console.log('📈 Progress bar set to:', percentage + '%');
            }
            
            // Update submit button
            const submitBtn = document.getElementById('submitDMOBtn');
            if (submitBtn) {
              if (completedCount >= totalTasks) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Complete DMO 🎉';
                submitBtn.className = 'bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors';
                console.log('✅ Submit button ENABLED');
              } else {
                submitBtn.disabled = true;
                submitBtn.textContent = \`Complete \${totalTasks - completedCount} more tasks\`;
                submitBtn.className = 'bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed';
                console.log('❌ Submit button disabled -', (totalTasks - completedCount), 'tasks remaining');
              }
            }
            
            // Update global stats
            updateGlobalStats();
          }
          
          function updateElement(id, text) {
            const element = document.getElementById(id);
            if (element) {
              element.textContent = text;
              console.log('📝 Updated', id, 'to:', text);
            } else {
              console.warn('⚠️ Element not found:', id);
            }
          }
          
          function recalculateProgress() {
            // Reset counters
            tasks = { connections: 0, conversations: 0, content: 0 };
            totalXP = 0;
            completedCount = 0;
            
            // Count checked checkboxes
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
              if (checkbox.checked) {
                const category = checkbox.dataset.category;
                const xp = parseInt(checkbox.dataset.xp);
                tasks[category]++;
                totalXP += xp;
                completedCount++;
              }
            });
            
            updateProgress();
          }
          
          function showTaskComplete(xp) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            notification.innerHTML = \`
              <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>Task Complete! +\${xp} XP</span>
              </div>
            \`;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.style.transform = 'translateX(0)', 100);
            setTimeout(() => {
              notification.style.transform = 'translateX(100%)';
              setTimeout(() => document.body.removeChild(notification), 300);
            }, 2000);
          }
          
          function saveTaskProgress() {
            const today = new Date().toDateString();
            
            // Save which specific checkboxes are checked
            const checkedTasks = [];
            document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
              if (checkbox.checked) {
                checkedTasks.push({
                  index: index,
                  category: checkbox.dataset.category,
                  xp: parseInt(checkbox.dataset.xp)
                });
              }
            });
            
            const progress = {
              date: today,
              checkedTasks: checkedTasks,
              tasks: tasks,
              totalXP: totalXP,
              completedCount: completedCount,
              level: 'full-throttle'
            };
            localStorage.setItem('dmo_daily_progress', JSON.stringify(progress));
          }
          
          function loadTaskProgress() {
            const today = new Date().toDateString();
            const saved = localStorage.getItem('dmo_daily_progress');
            
            if (saved) {
              const progress = JSON.parse(saved);
              if (progress.date === today && progress.level === 'full-throttle') {
                // Restore specific checkbox states if checkedTasks exists
                if (progress.checkedTasks) {
                  const checkboxes = document.querySelectorAll('.task-checkbox');
                  progress.checkedTasks.forEach(task => {
                    if (checkboxes[task.index]) {
                      checkboxes[task.index].checked = true;
                    }
                  });
                  
                  // Recalculate from actual checkbox states
                  recalculateProgress();
                } else {
                  // Fallback to old method
                  tasks = progress.tasks;
                  totalXP = progress.totalXP;
                  completedCount = progress.completedCount;
                  
                  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                    const category = checkbox.dataset.category;
                    const categoryProgress = tasks[category];
                    const categoryTasks = document.querySelectorAll(\`[data-category="\${category}"]\`);
                    
                    for (let i = 0; i < categoryProgress; i++) {
                      if (categoryTasks[i]) {
                        categoryTasks[i].checked = true;
                      }
                    }
                  });
                }
              }
            }
          }
          
          function updateGlobalStats() {
            let globalStats = JSON.parse(localStorage.getItem('dmo_stats') || '{"streak": 0, "todayCompleted": 0, "totalXP": 0, "lastCompletedDate": null}');
            globalStats.todayCompleted = completedCount;
            
            if (completedCount === totalTasks) {
              const today = new Date().toDateString();
              if (globalStats.lastCompletedDate !== today) {
                if (globalStats.lastCompletedDate === new Date(Date.now() - 86400000).toDateString()) {
                  globalStats.streak += 1;
                } else {
                  globalStats.streak = 1;
                }
                globalStats.lastCompletedDate = today;
              }
            }
            
            globalStats.totalXP = (globalStats.totalXP || 0) + totalXP;
            localStorage.setItem('dmo_stats', JSON.stringify(globalStats));
          }
        `
      }} />
    </Layout>,
    { title: 'Full Throttle DMO - Digital Era' }
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
          { id: 1, title: 'Getting Started with TikTok', duration: '15 min', completed: true },
          { id: 2, title: 'Profile Optimization', duration: '12 min', completed: true }
        ]},
        { id: 2, title: 'Module 2', status: 'Complete', lessons: [
          { id: 1, title: 'Content Strategy Basics', duration: '18 min', completed: true },
          { id: 2, title: 'Understanding the Algorithm', duration: '20 min', completed: true }
        ]},
        { id: 3, title: 'Module 3', status: 'In Progress', lessons: [
          { id: 1, title: 'Advanced Content Creation', duration: '25 min', completed: true },
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
                          : lesson.completed
                          ? 'text-green-700 hover:bg-green-50 bg-green-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          {lesson.completed && (
                            <i class="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                          )}
                          {lesson.current && !lesson.completed && (
                            <i class="fas fa-play-circle text-blue-500 mr-2 text-xs"></i>
                          )}
                          <span>Lesson {lesson.id}: {lesson.title}</span>
                        </div>
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
                <button 
                  id="markCompleteBtn"
                  onclick={`markLessonComplete(${courseId}, ${lessonId})`}
                  class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i class="fas fa-check mr-2"></i>
                  Mark Complete
                </button>
                
                <button 
                  id="nextLessonBtn"
                  onclick={`goToNextLesson(${courseId}, ${lessonId})`}
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

// Admin Login page
app.get('/admin/login', (c) => {
  return c.render(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Login - Digital Era</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body class="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen flex items-center justify-center">
        <div class="max-w-md w-full mx-4">
          <div class="bg-white rounded-xl shadow-2xl p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
              <p class="text-gray-600 mt-2">Access the Digital Era admin panel</p>
            </div>

            <form id="adminLoginForm">
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="adminEmail"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@digitalera.com"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    id="adminPassword"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your admin password"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    <span class="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" class="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
                </div>

                <button 
                  type="submit" 
                  class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <i class="fas fa-sign-in-alt mr-2"></i>
                  Sign In to Admin Panel
                </button>
              </div>
            </form>

            <div class="mt-6 text-center">
              <p class="text-sm text-gray-500">
                Demo Credentials: 
                <span class="font-medium">admin@digitalera.com</span> / 
                <span class="font-medium">admin123</span>
              </p>
            </div>

            <div class="mt-6 text-center">
              <a href="/" class="text-sm text-gray-600 hover:text-gray-800">
                <i class="fas fa-arrow-left mr-1"></i>
                Back to Member Portal
              </a>
            </div>
          </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
              e.preventDefault();
              
              const email = document.getElementById('adminEmail').value;
              const password = document.getElementById('adminPassword').value;
              
              try {
                const response = await axios.post('/api/admin/login', { email, password });
                if (response.data.success) {
                  window.location.href = '/admin/dashboard';
                } else {
                  alert('Invalid credentials. Please try again.');
                }
              } catch (error) {
                alert('Login failed. Please check your credentials.');
              }
            });
          `
        }} />
      </body>
    </html>,
    { title: 'Admin Login - Digital Era' }
  )
})

// Admin Dashboard
app.get('/admin/dashboard', (c) => {
  return c.render(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Dashboard - Digital Era</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body class="bg-gray-50">
        <div class="min-h-screen flex">
          {/* Admin Sidebar */}
          <div class="w-64 bg-slate-900 text-white flex flex-col">
            <div class="p-6 border-b border-slate-700">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-shield-alt text-white text-base"></i>
                </div>
                <div>
                  <span class="font-bold text-lg">ADMIN PANEL</span>
                  <p class="text-slate-400 text-xs">Digital Era</p>
                </div>
              </div>
            </div>

            <nav class="flex-1 py-6">
              <div class="space-y-2 px-4">
                <a href="/admin/dashboard" class="flex items-center px-4 py-3 rounded-lg text-base font-medium bg-blue-600 text-white">
                  <i class="fas fa-tachometer-alt mr-4 w-5 text-lg"></i>Dashboard
                </a>
                <a href="/admin/users" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-users mr-4 w-5 text-lg"></i>User Management
                </a>
                <a href="/admin/courses" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-graduation-cap mr-4 w-5 text-lg"></i>Course Management
                </a>
                <a href="/admin/content" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-video mr-4 w-5 text-lg"></i>Content Management
                </a>
                <a href="/admin/analytics" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-chart-bar mr-4 w-5 text-lg"></i>Analytics
                </a>
                <a href="/admin/settings" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-cog mr-4 w-5 text-lg"></i>Settings
                </a>
              </div>
            </nav>

            <div class="p-4 border-t border-slate-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&size=32" alt="Admin" class="w-8 h-8 rounded-full mr-3" />
                  <div>
                    <p class="text-sm font-medium">Admin User</p>
                    <p class="text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
                <a href="/" class="text-slate-400 hover:text-white">
                  <i class="fas fa-sign-out-alt"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div class="flex-1 flex flex-col">
            <header class="bg-white border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <div class="flex items-center space-x-4">
                  <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-plus mr-2"></i>Quick Actions
                  </button>
                </div>
              </div>
            </header>

            <main class="flex-1 p-6">
              {/* Admin Stats */}
              <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <i class="fas fa-users text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">Total Users</p>
                      <p class="text-2xl font-bold text-gray-900">2,847</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <i class="fas fa-graduation-cap text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">Total Courses</p>
                      <p class="text-2xl font-bold text-gray-900">45</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      <i class="fas fa-video text-yellow-600 text-xl"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">Total Lessons</p>
                      <p class="text-2xl font-bold text-gray-900">324</p>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <i class="fas fa-dollar-sign text-purple-600 text-xl"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 mb-1">Revenue</p>
                      <p class="text-2xl font-bold text-gray-900">$127,450</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div class="grid grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div class="space-y-3">
                    <button onclick="window.location.href='/admin/users/add'" class="w-full bg-blue-50 text-blue-700 p-3 rounded-lg hover:bg-blue-100 text-left">
                      <i class="fas fa-user-plus mr-3"></i>Add New User
                    </button>
                    <button onclick="window.location.href='/admin/courses/add'" class="w-full bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 text-left">
                      <i class="fas fa-plus mr-3"></i>Create Course
                    </button>
                    <button onclick="window.location.href='/admin/content/upload'" class="w-full bg-purple-50 text-purple-700 p-3 rounded-lg hover:bg-purple-100 text-left">
                      <i class="fas fa-upload mr-3"></i>Upload Content
                    </button>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div class="space-y-3">
                    <div class="flex items-center text-sm">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span class="text-gray-600">New user registered</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span class="text-gray-600">Course completed</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span class="text-gray-600">Payment received</span>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Server Status</span>
                      <span class="text-green-600 text-sm font-medium">Online</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Database</span>
                      <span class="text-green-600 text-sm font-medium">Connected</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">Storage</span>
                      <span class="text-blue-600 text-sm font-medium">82% Used</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Chart */}
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">User Growth & Revenue</h3>
                <canvas id="analyticsChart" width="400" height="200"></canvas>
              </div>
            </main>
          </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Initialize analytics chart
            const ctx = document.getElementById('analyticsChart').getContext('2d');
            const chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                  label: 'Users',
                  data: [120, 190, 300, 500, 800, 1200, 1800, 2847],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4
                }, {
                  label: 'Revenue ($)',
                  data: [1200, 2300, 4500, 7800, 12000, 18500, 25000, 35000],
                  borderColor: 'rgb(16, 185, 129)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  tension: 0.4
                }]
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
          `
        }} />
      </body>
    </html>,
    { title: 'Admin Dashboard - Digital Era' }
  )
})

// Admin API - Login
app.post('/api/admin/login', async (c) => {
  const { email, password } = await c.req.json()
  
  // Simple demo authentication - in production, use proper auth
  if (email === 'admin@digitalera.com' && password === 'admin123') {
    return c.json({ success: true, message: 'Login successful' })
  } else {
    return c.json({ success: false, message: 'Invalid credentials' }, 401)
  }
})

// Lesson completion API
app.post('/api/lesson/:courseId/:lessonId/complete', async (c) => {
  const courseId = c.req.param('courseId')
  const lessonId = c.req.param('lessonId')
  
  try {
    // In a real app, you would update the user's progress in the database
    // For now, we'll simulate a successful completion
    
    return c.json({
      success: true,
      message: 'Lesson marked as complete',
      courseId: courseId,
      lessonId: lessonId,
      xpEarned: 50 // Award XP for completion
    })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to mark lesson complete' }, 500)
  }
})

// Admin User Management
app.get('/admin/users', (c) => {
  return c.render(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>User Management - Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body class="bg-gray-50">
        <div class="min-h-screen flex">
          {/* Admin Sidebar - Same as dashboard */}
          <div class="w-64 bg-slate-900 text-white flex flex-col">
            <div class="p-6 border-b border-slate-700">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-shield-alt text-white text-base"></i>
                </div>
                <div>
                  <span class="font-bold text-lg">ADMIN PANEL</span>
                  <p class="text-slate-400 text-xs">Digital Era</p>
                </div>
              </div>
            </div>

            <nav class="flex-1 py-6">
              <div class="space-y-2 px-4">
                <a href="/admin/dashboard" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-tachometer-alt mr-4 w-5 text-lg"></i>Dashboard
                </a>
                <a href="/admin/users" class="flex items-center px-4 py-3 rounded-lg text-base font-medium bg-blue-600 text-white">
                  <i class="fas fa-users mr-4 w-5 text-lg"></i>User Management
                </a>
                <a href="/admin/courses" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-graduation-cap mr-4 w-5 text-lg"></i>Course Management
                </a>
                <a href="/admin/content" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-video mr-4 w-5 text-lg"></i>Content Management
                </a>
                <a href="/admin/analytics" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-chart-bar mr-4 w-5 text-lg"></i>Analytics
                </a>
                <a href="/admin/settings" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-cog mr-4 w-5 text-lg"></i>Settings
                </a>
              </div>
            </nav>

            <div class="p-4 border-t border-slate-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&size=32" alt="Admin" class="w-8 h-8 rounded-full mr-3" />
                  <div>
                    <p class="text-sm font-medium">Admin User</p>
                    <p class="text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
                <a href="/" class="text-slate-400 hover:text-white">
                  <i class="fas fa-sign-out-alt"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div class="flex-1 flex flex-col">
            <header class="bg-white border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
                <div class="flex items-center space-x-4">
                  <button id="addUserBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-plus mr-2"></i>Add New User
                  </button>
                  <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <i class="fas fa-download mr-2"></i>Export Users
                  </button>
                </div>
              </div>
            </header>

            <main class="flex-1 p-6">
              {/* User Stats */}
              <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">2,847</div>
                    <div class="text-sm text-gray-500">Total Users</div>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">2,156</div>
                    <div class="text-sm text-gray-500">Active Users</div>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-yellow-600">524</div>
                    <div class="text-sm text-gray-500">Trial Members</div>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">167</div>
                    <div class="text-sm text-gray-500">Premium Members</div>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div class="bg-white rounded-xl shadow-sm border border-gray-100">
                <div class="p-6 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">All Users</h3>
                    <div class="flex items-center space-x-4">
                      <input type="text" placeholder="Search users..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>Premium</option>
                        <option>Trial</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <img class="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Ashley+Kemp&background=6366f1&color=fff" alt="" />
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">Ashley Kemp</div>
                              <div class="text-sm text-gray-500">ID: 001</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ashley@digitalera.com</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Premium</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 15, 2024</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <img class="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff" alt="" />
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">John Smith</div>
                              <div class="text-sm text-gray-500">ID: 002</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">john@example.com</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Trial</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 22, 2024</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <img class="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=ef4444&color=fff" alt="" />
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">Sarah Johnson</div>
                              <div class="text-sm text-gray-500">ID: 003</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">sarah@example.com</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Admin</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Feb 08, 2024</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div class="flex-1 flex justify-between sm:hidden">
                    <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</a>
                    <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</a>
                  </div>
                  <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p class="text-sm text-gray-700">
                        Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">2,847</span> results
                      </p>
                    </div>
                    <div>
                      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <i class="fas fa-chevron-left"></i>
                        </a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
                        <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <i class="fas fa-chevron-right"></i>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Add User Modal */}
        <div id="addUserModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
              <form id="addUserForm">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Role</label>
                    <select class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>Trial</option>
                      <option>Premium</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                  <button type="button" id="cancelAddUser" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                  <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add User</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            // Modal functionality
            document.getElementById('addUserBtn').addEventListener('click', function() {
              document.getElementById('addUserModal').classList.remove('hidden');
            });

            document.getElementById('cancelAddUser').addEventListener('click', function() {
              document.getElementById('addUserModal').classList.add('hidden');
            });

            // Form submission
            document.getElementById('addUserForm').addEventListener('submit', function(e) {
              e.preventDefault();
              alert('User would be added to the system');
              document.getElementById('addUserModal').classList.add('hidden');
            });
          `
        }} />
      </body>
    </html>,
    { title: 'User Management - Admin' }
  )
})

// Admin Course Management  
app.get('/admin/courses', (c) => {
  return c.render(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Course Management - Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body class="bg-gray-50">
        <div class="min-h-screen flex">
          {/* Admin Sidebar */}
          <div class="w-64 bg-slate-900 text-white flex flex-col">
            <div class="p-6 border-b border-slate-700">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-shield-alt text-white text-base"></i>
                </div>
                <div>
                  <span class="font-bold text-lg">ADMIN PANEL</span>
                  <p class="text-slate-400 text-xs">Digital Era</p>
                </div>
              </div>
            </div>

            <nav class="flex-1 py-6">
              <div class="space-y-2 px-4">
                <a href="/admin/dashboard" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-tachometer-alt mr-4 w-5 text-lg"></i>Dashboard
                </a>
                <a href="/admin/users" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-users mr-4 w-5 text-lg"></i>User Management
                </a>
                <a href="/admin/courses" class="flex items-center px-4 py-3 rounded-lg text-base font-medium bg-blue-600 text-white">
                  <i class="fas fa-graduation-cap mr-4 w-5 text-lg"></i>Course Management
                </a>
                <a href="/admin/content" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-video mr-4 w-5 text-lg"></i>Content Management
                </a>
                <a href="/admin/analytics" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-chart-bar mr-4 w-5 text-lg"></i>Analytics
                </a>
                <a href="/admin/settings" class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <i class="fas fa-cog mr-4 w-5 text-lg"></i>Settings
                </a>
              </div>
            </nav>

            <div class="p-4 border-t border-slate-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&size=32" alt="Admin" class="w-8 h-8 rounded-full mr-3" />
                  <div>
                    <p class="text-sm font-medium">Admin User</p>
                    <p class="text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
                <a href="/" class="text-slate-400 hover:text-white">
                  <i class="fas fa-sign-out-alt"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div class="flex-1 flex flex-col">
            <header class="bg-white border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900">Course Management</h1>
                <div class="flex items-center space-x-4">
                  <button id="addCourseBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-plus mr-2"></i>Add New Course
                  </button>
                  <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    <i class="fas fa-upload mr-2"></i>Bulk Import
                  </button>
                </div>
              </div>
            </header>

            <main class="flex-1 p-6">
              {/* Course Stats */}
              <div class="grid grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <div class="text-2xl font-bold text-blue-600">45</div>
                  <div class="text-sm text-gray-500">Total Courses</div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <div class="text-2xl font-bold text-green-600">324</div>
                  <div class="text-sm text-gray-500">Total Lessons</div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <div class="text-2xl font-bold text-yellow-600">12</div>
                  <div class="text-sm text-gray-500">Draft Courses</div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <div class="text-2xl font-bold text-purple-600">89%</div>
                  <div class="text-sm text-gray-500">Completion Rate</div>
                </div>
              </div>

              {/* Courses Grid */}
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-semibold text-gray-900">All Courses</h3>
                  <div class="flex items-center space-x-4">
                    <input type="text" placeholder="Search courses..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>All Categories</option>
                      <option>Business</option>
                      <option>Social Media</option>
                      <option>Sales</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-6">
                  <div class="border border-gray-200 rounded-lg p-4">
                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300" alt="TikTok Mastery" class="w-full h-32 object-cover rounded-lg mb-4" />
                    <h4 class="font-semibold text-gray-900 mb-2">TIK-TOK MASTERY</h4>
                    <p class="text-sm text-gray-600 mb-3">6 modules • 25 lessons</p>
                    <div class="flex items-center justify-between mb-3">
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
                      <span class="text-sm text-gray-500">2,847 enrolled</span>
                    </div>
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button class="text-green-600 hover:text-green-800 text-sm">View</button>
                      <button class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </div>

                  <div class="border border-gray-200 rounded-lg p-4">
                    <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300" alt="Business Blueprint" class="w-full h-32 object-cover rounded-lg mb-4" />
                    <h4 class="font-semibold text-gray-900 mb-2">The Business Blueprint</h4>
                    <p class="text-sm text-gray-600 mb-3">8 modules • 45 lessons</p>
                    <div class="flex items-center justify-between mb-3">
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
                      <span class="text-sm text-gray-500">1,523 enrolled</span>
                    </div>
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button class="text-green-600 hover:text-green-800 text-sm">View</button>
                      <button class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </div>

                  <div class="border border-gray-200 rounded-lg p-4">
                    <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300" alt="Facebook Ads" class="w-full h-32 object-cover rounded-lg mb-4" />
                    <h4 class="font-semibold text-gray-900 mb-2">Facebook Advertising Mastery</h4>
                    <p class="text-sm text-gray-600 mb-3">5 modules • 32 lessons</p>
                    <div class="flex items-center justify-between mb-3">
                      <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>
                      <span class="text-sm text-gray-500">0 enrolled</span>
                    </div>
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button class="text-green-600 hover:text-green-800 text-sm">Preview</button>
                      <button class="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Add Course Modal */}
        <div id="addCourseModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Course</h3>
              <form id="addCourseForm">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Course Title</label>
                    <input type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Category</label>
                    <select class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>Business</option>
                      <option>Social Media</option>
                      <option>Sales</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                    <input type="url" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div class="flex justify-end space-x-3 mt-6">
                  <button type="button" id="cancelAddCourse" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                  <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Course</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            // Modal functionality
            document.getElementById('addCourseBtn').addEventListener('click', function() {
              document.getElementById('addCourseModal').classList.remove('hidden');
            });

            document.getElementById('cancelAddCourse').addEventListener('click', function() {
              document.getElementById('addCourseModal').classList.add('hidden');
            });

            // Form submission
            document.getElementById('addCourseForm').addEventListener('submit', function(e) {
              e.preventDefault();
              alert('Course would be created in the system');
              document.getElementById('addCourseModal').classList.add('hidden');
            });
          `
        }} />
      </body>
    </html>,
    { title: 'Course Management - Admin' }
  )
})

export default app