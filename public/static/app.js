// Online Empires Frontend JavaScript

// Global state
let currentUser = { id: 1, name: 'Ashley Kemp' }; // Demo user
let chartsInstances = {};

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getStatusBadgeClass(status) {
  const statusClasses = {
    'new': 'bg-blue-100 text-blue-800',
    'contacted': 'bg-yellow-100 text-yellow-800',
    'qualified': 'bg-purple-100 text-purple-800',
    'converted': 'bg-green-100 text-green-800',
    'lost': 'bg-red-100 text-red-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-blue-100 text-blue-800',
    'paid': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

// API functions
async function fetchAPI(endpoint) {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Load courses page
async function loadCourses() {
  const container = document.getElementById('courses-container');
  if (!container) return;

  try {
    const courses = await fetchAPI('/api/courses');
    
    container.innerHTML = courses.map(course => `
      <div class="course-card card-hover">
        <img src="${course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'}" 
             alt="${course.title}" class="course-thumbnail">
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold">
              ${course.category || 'General'}
            </span>
            <span class="text-sm text-gray-500">${course.level}</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${course.title}</h3>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">${course.description || ''}</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-gray-500">
              <i class="fas fa-clock mr-1"></i>
              ${course.duration_hours}h
            </span>
            <span class="text-lg font-bold text-indigo-600">${formatCurrency(course.price)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">by ${course.instructor_name || 'Instructor'}</span>
            <button class="btn-primary px-4 py-2 rounded-md text-white font-medium text-sm">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
        <p class="text-red-600">Failed to load courses. Please try again.</p>
      </div>
    `;
  }
}

// Load experts page
async function loadExperts() {
  const container = document.getElementById('experts-container');
  if (!container) return;

  try {
    const experts = await fetchAPI('/api/experts');
    
    container.innerHTML = experts.map(expert => {
      const expertiseAreas = JSON.parse(expert.expertise_areas || '[]');
      const languages = JSON.parse(expert.languages || '[]');
      
      return `
        <div class="expert-card card-hover">
          <img src="${expert.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}" 
               alt="${expert.name}" class="expert-avatar">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${expert.name}</h3>
          <div class="flex justify-center items-center mb-2">
            <div class="flex text-yellow-400 mr-2">
              ${Array.from({length: 5}, (_, i) => 
                `<i class="fas fa-star ${i < Math.floor(expert.rating) ? '' : 'text-gray-300'}"></i>`
              ).join('')}
            </div>
            <span class="text-sm text-gray-600">${expert.rating} (${expert.total_reviews} reviews)</span>
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">${expert.bio || ''}</p>
          <div class="mb-4">
            <div class="flex flex-wrap gap-1 justify-center">
              ${expertiseAreas.slice(0, 3).map(area => 
                `<span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">${area}</span>`
              ).join('')}
            </div>
          </div>
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-semibold text-gray-900">${formatCurrency(expert.hourly_rate || 0)}/hr</span>
            <span class="text-xs px-2 py-1 rounded-full ${expert.availability_status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
              ${expert.availability_status}
            </span>
          </div>
          <button class="w-full btn-primary py-2 rounded-md text-white font-medium text-sm">
            Contact Expert
          </button>
        </div>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
        <p class="text-red-600">Failed to load experts. Please try again.</p>
      </div>
    `;
  }
}

// Load leads page
async function loadLeads() {
  const container = document.getElementById('leads-container');
  if (!container) return;

  try {
    const leads = await fetchAPI(`/api/user/${currentUser.id}/leads`);
    
    container.innerHTML = `
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Your Leads</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${leads.map(lead => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">${lead.name}</div>
                      <div class="text-sm text-gray-500">${lead.email}</div>
                      ${lead.phone ? `<div class="text-sm text-gray-500">${lead.phone}</div>` : ''}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      ${lead.source}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(lead.status)}">
                      ${lead.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${lead.estimated_value ? formatCurrency(lead.estimated_value) : '-'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(lead.created_at)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button class="text-green-600 hover:text-green-900">Contact</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
        <p class="text-red-600">Failed to load leads. Please try again.</p>
      </div>
    `;
  }
}

// Load affiliate portal
async function loadAffiliate() {
  const container = document.getElementById('affiliate-container');
  if (!container) return;

  try {
    const commissions = await fetchAPI(`/api/user/${currentUser.id}/commissions`);
    const totalEarnings = commissions.reduce((sum, comm) => sum + parseFloat(comm.amount), 0);
    const pendingEarnings = commissions.filter(c => c.status === 'pending').reduce((sum, comm) => sum + parseFloat(comm.amount), 0);
    
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-dollar-sign text-green-500 text-2xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Earnings</p>
              <p class="text-2xl font-bold text-gray-900">${formatCurrency(totalEarnings)}</p>
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
              <p class="text-2xl font-bold text-gray-900">${formatCurrency(pendingEarnings)}</p>
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
              <p class="text-2xl font-bold text-gray-900">${formatCurrency(commissions.filter(c => new Date(c.earned_at).getMonth() === new Date().getMonth()).reduce((sum, comm) => sum + parseFloat(comm.amount), 0))}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Commission History</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${commissions.map(commission => `
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      ${commission.commission_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${commission.description || '-'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${formatCurrency(commission.amount)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(commission.status)}">
                      ${commission.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(commission.earned_at)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
        <p class="text-red-600">Failed to load affiliate data. Please try again.</p>
      </div>
    `;
  }
}

// Load statistics with charts
async function loadStatistics() {
  const container = document.getElementById('statistics-container');
  if (!container) return;

  try {
    const stats = await fetchAPI(`/api/user/${currentUser.id}/stats`);
    const courses = await fetchAPI(`/api/user/${currentUser.id}/courses`);
    const commissions = await fetchAPI(`/api/user/${currentUser.id}/commissions`);
    
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="chart-container">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
          <canvas id="courseProgressChart"></canvas>
        </div>
        <div class="chart-container">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Commissions</h3>
          <canvas id="commissionsChart"></canvas>
        </div>
      </div>
    `;

    // Create course progress chart
    const ctx1 = document.getElementById('courseProgressChart').getContext('2d');
    const completedCourses = courses.filter(c => c.progress_percentage === 100).length;
    const inProgressCourses = courses.filter(c => c.progress_percentage > 0 && c.progress_percentage < 100).length;
    const notStartedCourses = courses.filter(c => c.progress_percentage === 0).length;

    if (chartsInstances.courseProgress) {
      chartsInstances.courseProgress.destroy();
    }

    chartsInstances.courseProgress = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
          data: [completedCourses, inProgressCourses, notStartedCourses],
          backgroundColor: ['#10b981', '#f59e0b', '#6b7280'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    // Create commissions chart
    const ctx2 = document.getElementById('commissionsChart').getContext('2d');
    const monthlyData = {};
    commissions.forEach(comm => {
      const month = new Date(comm.earned_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + parseFloat(comm.amount);
    });

    if (chartsInstances.commissions) {
      chartsInstances.commissions.destroy();
    }

    chartsInstances.commissions = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Commissions',
          data: Object.values(monthlyData),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toFixed(0);
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

  } catch (error) {
    container.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
        <p class="text-red-600">Failed to load statistics. Please try again.</p>
      </div>
    `;
  }
}

// Initialize page based on current route
function initializePage() {
  const path = window.location.pathname;
  
  switch (path) {
    case '/courses':
      loadCourses();
      break;
    case '/experts':
      loadExperts();
      break;
    case '/leads':
      loadLeads();
      break;
    case '/affiliate':
      loadAffiliate();
      break;
    case '/statistics':
      loadStatistics();
      break;
    default:
      // Dashboard or other pages
      break;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  
  // Add navigation active state
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('nav-active');
    }
  });
});