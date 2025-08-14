// Online Empires Frontend JavaScript - Simplified and Bug-Free

// Global state
let currentUser = { id: 1, name: 'Ashley Kemp' };

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
    
    if (!courses || courses.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-8">
          <i class="fas fa-graduation-cap text-gray-400 text-3xl mb-4"></i>
          <p class="text-gray-600">No courses available at the moment.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = courses.map(course => `
      <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img src="${course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'}" 
             alt="${course.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold">
              ${course.category || 'General'}
            </span>
            <span class="text-sm text-gray-500 capitalize">${course.level || 'beginner'}</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${course.title}</h3>
          <p class="text-gray-600 text-sm mb-4">${course.description || 'Course description not available.'}</p>
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-gray-500">
              <i class="fas fa-clock mr-1"></i>
              ${course.duration_hours || 0}h
            </span>
            <span class="text-lg font-bold text-indigo-600">${formatCurrency(course.price || 0)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">by ${course.instructor_name || 'Instructor'}</span>
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
              View Course
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    container.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
        <p class="text-red-600">Failed to load courses. Please try again later.</p>
        <button onclick="loadCourses()" class="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
          Retry
        </button>
      </div>
    `;
  }
}

// Initialize page based on current route
function initializePage() {
  const path = window.location.pathname;
  
  // Add navigation active state
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.classList.remove('bg-indigo-50', 'text-indigo-700');
    link.classList.add('text-gray-600', 'hover:bg-gray-50');
    
    if (link.getAttribute('href') === path) {
      link.classList.remove('text-gray-600', 'hover:bg-gray-50');
      link.classList.add('bg-indigo-50', 'text-indigo-700');
    }
  });
  
  // Load page-specific content
  switch (path) {
    case '/courses':
      loadCourses();
      break;
    default:
      // Dashboard or other pages - no additional loading needed
      break;
  }
}

// Add click handlers for interactive elements
function addClickHandlers() {
  // Add button click handlers
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('hover:bg-indigo-700')) {
      e.preventDefault();
      console.log('Button clicked:', e.target.textContent);
      // Add your button functionality here
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  addClickHandlers();
  
  // Add smooth scrolling for better UX
  document.documentElement.style.scrollBehavior = 'smooth';
});

// Handle navigation without page reload (optional enhancement)
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.href && e.target.href.includes(window.location.origin)) {
    const href = e.target.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      // This is a local navigation link - could add SPA functionality here
      // For now, let normal navigation happen
    }
  }
});

// Export functions for global access
window.loadCourses = loadCourses;
window.initializePage = initializePage;