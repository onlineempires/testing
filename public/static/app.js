// Online Empires Frontend JavaScript - Professional Design

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

// Initialize navigation
function initializeNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Search functionality
function initializeSearch() {
  const searchInput = document.querySelector('input[placeholder*="Search"]');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      console.log('Searching for:', query);
      // Implement search functionality here
    });
  }
}

// Course card interactions
function initializeCourseCards() {
  const courseCards = document.querySelectorAll('.course-card, .bg-white.rounded-xl');
  courseCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('shadow-xl');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('shadow-xl');
    });
  });
}

// Expert card interactions
function initializeExpertCards() {
  const expertCards = document.querySelectorAll('.expert-card');
  expertCards.forEach(card => {
    const bookButton = card.querySelector('button');
    if (bookButton) {
      bookButton.addEventListener('click', function(e) {
        e.preventDefault();
        const expertName = card.querySelector('h3').textContent;
        console.log('Booking coaching call with:', expertName);
        // Implement booking functionality here
        showNotification(`Booking request sent to ${expertName}!`, 'success');
      });
    }
  });
}

// Button interactions
function initializeButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (this.textContent.includes('Start Course')) {
        e.preventDefault();
        const courseTitle = this.closest('.bg-white').querySelector('h4').textContent;
        console.log('Starting course:', courseTitle);
        // Implement course start functionality here
        showNotification(`Starting ${courseTitle}...`, 'info');
      }
      
      if (this.textContent.includes('Continue Learning')) {
        e.preventDefault();
        console.log('Continuing TikTok Mastery course');
        // Implement continue learning functionality here
        window.location.href = '/lesson/1/2';
      }
    });
  });
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${getNotificationClass(type)}`;
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

function getNotificationClass(type) {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-white';
    default:
      return 'bg-blue-500 text-white';
  }
}

// Progress tracking
function updateProgress() {
  const progressBars = document.querySelectorAll('.progress-bar, [style*="width:"]');
  progressBars.forEach(bar => {
    const width = bar.style.width || '0%';
    console.log('Progress bar width:', width);
    // Add animation class
    bar.classList.add('progress-bar');
  });
}

// Stats animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.text-2xl.font-bold');
  statNumbers.forEach(stat => {
    const finalValue = stat.textContent;
    // Add animation class
    stat.classList.add('fade-in-up');
  });
}

// Video player controls (for lesson page)
function initializeVideoPlayer() {
  const playButton = document.querySelector('button[class*="bg-blue-600"]:contains("Play")');
  if (playButton) {
    playButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Playing video...');
      // Implement video play functionality here
      showNotification('Video player not available in demo', 'warning');
    });
  }
}

// Lesson navigation
function initializeLessonNavigation() {
  const prevButton = document.querySelector('button:contains("Previous Lesson")');
  const nextButton = document.querySelector('button:contains("Next Lesson")');
  const completeCheckbox = document.querySelector('input[type="checkbox"]');
  
  if (prevButton) {
    prevButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Going to previous lesson');
      // Implement previous lesson functionality
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Going to next lesson');
      // Implement next lesson functionality
    });
  }
  
  if (completeCheckbox) {
    completeCheckbox.addEventListener('change', function() {
      if (this.checked) {
        console.log('Lesson marked as complete');
        showNotification('Lesson marked as complete!', 'success');
      }
    });
  }
}

// Responsive design helpers
function handleResponsiveDesign() {
  const sidebar = document.querySelector('.sidebar-nav');
  const mainContent = document.querySelector('.flex-1.flex.flex-col');
  
  // Handle mobile view
  function checkMobile() {
    if (window.innerWidth < 768) {
      document.body.classList.add('mobile-view');
    } else {
      document.body.classList.remove('mobile-view');
    }
  }
  
  // Initial check
  checkMobile();
  
  // Listen for resize
  window.addEventListener('resize', checkMobile);
}

// Initialize all functionality
function initializeApp() {
  initializeNavigation();
  initializeSearch();
  initializeCourseCards();
  initializeExpertCards();
  initializeButtons();
  initializeVideoPlayer();
  initializeLessonNavigation();
  updateProgress();
  animateStats();
  handleResponsiveDesign();
  
  console.log('Online Empires app initialized successfully');
}

// Page-specific initializations
function initializePage() {
  const path = window.location.pathname;
  
  switch (path) {
    case '/':
      console.log('Dashboard page loaded');
      // Dashboard-specific functionality
      break;
    case '/courses':
      console.log('Courses page loaded');
      // Courses-specific functionality
      break;
    case '/experts':
      console.log('Experts page loaded');
      // Experts-specific functionality
      break;
    default:
      if (path.includes('/lesson/')) {
        console.log('Lesson page loaded');
        // Lesson-specific functionality
      }
      break;
  }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  initializePage();
  
  // Add smooth scrolling
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Add loading completed class
  document.body.classList.add('loaded');
});

// Handle link clicks
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.href) {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      // This is an internal link - could add SPA functionality here
      console.log('Navigating to:', href);
    }
  }
});

// Export functions for global access
window.showNotification = showNotification;
window.initializeApp = initializeApp;