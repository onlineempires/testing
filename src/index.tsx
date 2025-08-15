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
    <div class="w-48 bg-slate-800 text-white flex flex-col">
      {/* Logo */}
      <div class="p-4 border-b border-slate-700">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
            <i class="fas fa-crown text-white text-sm"></i>
          </div>
          <span class="font-bold text-lg">ONLINE EMPIRES</span>
        </div>
      </div>

      {/* Navigation */}
      <nav class="flex-1 py-4">
        <div class="space-y-1 px-3">
          <a href="/" class={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-tachometer-alt mr-3 w-4"></i>
            Dashboard
          </a>
          <a href="/courses" class={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-graduation-cap mr-3 w-4"></i>
            All Courses
          </a>
          <a href="/experts" class={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'experts' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-users mr-3 w-4"></i>
            Expert Directory
          </a>
          <a href="/dmo" class={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'dmo' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-calendar-check mr-3 w-4"></i>
            Daily Method (DMO)
          </a>
          <a href="/affiliate" class={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'affiliate' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-handshake mr-3 w-4"></i>
            Affiliate Portal
          </a>
          <a href="/statistics" class={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'statistics' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-chart-bar mr-3 w-4"></i>
            Statistics
          </a>
          <a href="/leads" class={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'leads' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-user-plus mr-3 w-4"></i>
            Leads
          </a>
          <a href="/profile" class={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}>
            <i class="fas fa-user mr-3 w-4"></i>
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
                placeholder="Search courses, lessons..."
                class="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            {/* User Menu */}
            <div class="flex items-center space-x-3">
              <button class="p-2 text-gray-400 hover:text-gray-600">
                <i class="fas fa-users"></i>
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 relative">
                <i class="fas fa-bell"></i>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 relative">
                <i class="fas fa-envelope"></i>
                <span class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
              </button>
              <div class="flex items-center space-x-2">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=32" alt="Profile" class="w-8 h-8 rounded-full" />
                <span class="text-sm font-medium text-gray-700">Ashley Kemp</span>
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
      <Layout title="ONLINE EMPIRES" currentPage="dashboard">
        {/* Welcome Banner */}
        <div class="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white mb-8">
          <div class="flex items-center">
            <img src="https://images.unsplash.com/photo-1494790108755-2616b25643e0?w=64" alt="Ashley" class="w-12 h-12 rounded-full mr-4" />
            <div>
              <h2 class="text-2xl font-bold mb-1">Hello, {userName}!</h2>
              <p class="text-purple-100">Welcome back to Online Empires! Ready to build your empire?</p>
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
              <button class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 ml-4">
                Continue Learning
              </button>
            </div>
          </div>
        </div>

        {/* Start Here Section */}
        <div>
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Start Here</h3>
          <div class="grid grid-cols-3 gap-6">
            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400" alt="Business Blueprint" class="w-full h-48 object-cover" />
              <div class="p-6">
                <h4 class="font-semibold text-gray-900 mb-2">The Business Blueprint</h4>
                <p class="text-sm text-gray-600 mb-4">Foundation principles for building your online business</p>
                <p class="text-xs text-gray-500 mb-4">5 modules</p>
                <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                  Start Course
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" alt="Discovery Process" class="w-full h-48 object-cover" />
              <div class="p-6">
                <h4 class="font-semibold text-gray-900 mb-2">The Discovery Process</h4>
                <p class="text-sm text-gray-600 mb-4">Find your niche and identify opportunities</p>
                <p class="text-xs text-gray-500 mb-4">3 modules</p>
                <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                  Start Course
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400" alt="Next Steps" class="w-full h-48 object-cover" />
              <div class="p-6">
                <h4 class="font-semibold text-gray-900 mb-2">Next Steps</h4>
                <p class="text-sm text-gray-600 mb-4">Action plan for immediate implementation</p>
                <p class="text-xs text-gray-500 mb-4">4 modules</p>
                <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                  Start Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>,
      { title: 'Dashboard - Online Empires' }
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
      <div class="mb-6">
        <p class="text-gray-600">Master the skills to build your online empire</p>
      </div>

      {/* Start Here Section */}
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Start Here</h3>
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400" alt="Business Blueprint" class="w-full h-48 object-cover" />
            <div class="p-6">
              <h4 class="font-semibold text-gray-900 mb-2">The Business Blueprint</h4>
              <p class="text-sm text-gray-600 mb-4">Foundation principles for building your online business</p>
              <p class="text-xs text-gray-500 mb-4">5 modules</p>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                Start Course
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400" alt="Discovery Process" class="w-full h-48 object-cover" />
            <div class="p-6">
              <h4 class="font-semibold text-gray-900 mb-2">The Discovery Process</h4>
              <p class="text-sm text-gray-600 mb-4">Find your niche and identify opportunities</p>
              <p class="text-xs text-gray-500 mb-4">3 modules</p>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                Start Course
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400" alt="Next Steps" class="w-full h-48 object-cover" />
            <div class="p-6">
              <h4 class="font-semibold text-gray-900 mb-2">Next Steps</h4>
              <p class="text-sm text-gray-600 mb-4">Action plan for immediate implementation</p>
              <p class="text-xs text-gray-500 mb-4">4 modules</p>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                Start Course
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Sales Section */}
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Social Media & Sales</h3>
        <div class="grid grid-cols-4 gap-6">
          <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" alt="TikTok Mastery" class="w-full h-40 object-cover" />
            <div class="p-4">
              <h4 class="font-semibold text-gray-900 mb-2">TikTok Mastery</h4>
              <p class="text-xs text-gray-500 mb-3">6 modules</p>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Start Course
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400" alt="Facebook Ads" class="w-full h-40 object-cover" />
            <div class="p-4">
              <h4 class="font-semibold text-gray-900 mb-2">Facebook Advertising</h4>
              <p class="text-xs text-gray-500 mb-3">8 modules</p>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Start Course
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1580894908361-967195033215?w=400" alt="Instagram Marketing" class="w-full h-40 object-cover" />
            <div class="p-4">
              <h4 class="font-semibold text-gray-900 mb-2">Instagram Marketing</h4>
              <p class="text-xs text-gray-500 mb-3">5 modules</p>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Start Course
              </button>
            </div>
          </div>

          <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400" alt="Sales Funnel" class="w-full h-40 object-cover" />
            <div class="p-4">
              <h4 class="font-semibold text-gray-900 mb-2">Sales Funnel Mastery</h4>
              <p class="text-xs text-gray-500 mb-3">7 modules</p>
              <button class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Start Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>,
    { title: 'All Courses - Online Empires' }
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
    { title: 'Expert Directory - Online Empires' }
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
    { title: 'Lesson - Online Empires' }
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
    { title: 'Daily Method (DMO) - Online Empires' }
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
    { title: 'Affiliate Portal - Online Empires' }
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
    { title: 'Statistics - Online Empires' }
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
    { title: 'Leads - Online Empires' }
  )
})

app.get('/profile', (c) => {
  return c.render(
    <Layout title="Profile" currentPage="profile">
      <div class="text-center py-20">
        <i class="fas fa-user text-6xl text-gray-400 mb-4"></i>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Profile</h2>
        <p class="text-gray-600">Manage your account settings</p>
      </div>
    </Layout>,
    { title: 'Profile - Online Empires' }
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

export default app