// Digital Era Frontend JavaScript - Professional Design with Enhanced Functionality

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

// Search functionality - ENHANCED
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      if (query.length > 0) {
        performSearch(query);
      } else {
        clearSearchResults();
      }
    });

    // Handle Enter key for search
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 0) {
          performSearch(query);
        }
      }
    });
  }
}

function performSearch(query) {
  console.log('Searching for:', query);
  
  // Search through current page content
  const searchableElements = document.querySelectorAll('h3, h4, p, .course-title, .expert-name');
  const results = [];
  
  searchableElements.forEach(element => {
    if (element.textContent.toLowerCase().includes(query)) {
      results.push({
        element: element,
        text: element.textContent,
        type: getElementType(element)
      });
    }
  });
  
  if (results.length > 0) {
    showNotification(`Found ${results.length} result(s) for "${query}"`, 'success');
    highlightSearchResults(results);
  } else {
    showNotification(`No results found for "${query}"`, 'info');
  }
}

function getElementType(element) {
  if (element.closest('.course-card, .bg-white.rounded-xl')) return 'course';
  if (element.closest('.expert-card')) return 'expert';
  return 'content';
}

function highlightSearchResults(results) {
  // Remove existing highlights
  clearSearchResults();
  
  results.forEach(result => {
    result.element.classList.add('search-highlight');
    // Scroll to first result
    if (results.indexOf(result) === 0) {
      result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function clearSearchResults() {
  const highlighted = document.querySelectorAll('.search-highlight');
  highlighted.forEach(el => el.classList.remove('search-highlight'));
}

// Feedback system - ENHANCED
function initializeFeedback() {
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackDropdown = document.getElementById('feedbackDropdown');
  const feedbackForm = document.getElementById('feedbackForm');
  const cancelBtn = document.getElementById('cancelFeedback');

  if (feedbackBtn && feedbackDropdown) {
    feedbackBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleDropdown(feedbackDropdown);
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        hideDropdown(feedbackDropdown);
        document.getElementById('feedbackText').value = '';
      });
    }

    if (feedbackForm) {
      feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const feedbackText = document.getElementById('feedbackText').value.trim();
        
        if (feedbackText) {
          try {
            // Simulate sending feedback to support@onlineempires.com
            await sendFeedback(feedbackText);
            showNotification('Feedback sent successfully! We\'ll get back to you soon.', 'success');
            document.getElementById('feedbackText').value = '';
            hideDropdown(feedbackDropdown);
          } catch (error) {
            showNotification('Error sending feedback. Please try again.', 'error');
          }
        }
      });
    }
  }
}

async function sendFeedback(feedback) {
  // Simulate API call to send feedback
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Feedback sent to support@onlineempires.com:', feedback);
      // In real implementation, this would make an API call
      resolve({ success: true });
    }, 1000);
  });
}

// Notification system - ENHANCED
function initializeNotifications() {
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationsDropdown = document.getElementById('notificationsDropdown');

  if (notificationBtn && notificationsDropdown) {
    notificationBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleDropdown(notificationsDropdown);
      markNotificationsAsRead();
    });

    // Load initial notifications
    loadNotifications();
  }
}

function loadNotifications() {
  // Simulate loading notifications from API
  const notifications = [
    {
      id: 1,
      type: 'lead',
      title: 'New Lead Generated!',
      message: 'John Smith signed up through your referral link',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'commission',
      title: 'Commission Earned!',
      message: '$150 commission from Sarah\'s purchase',
      time: '1 day ago',
      unread: true
    },
    {
      id: 3,
      type: 'lead',
      title: 'New Team Member!',
      message: 'Maria Rodriguez joined your team',
      time: '2 days ago',
      unread: false
    }
  ];

  updateNotificationBadge(notifications.filter(n => n.unread).length);
  renderNotifications(notifications);
}

function renderNotifications(notifications) {
  const notificationsList = document.getElementById('notificationsList');
  if (!notificationsList) return;

  notificationsList.innerHTML = notifications.map(notification => `
    <div class="p-3 bg-${getNotificationColor(notification.type)}-50 rounded-lg border-l-4 border-${getNotificationColor(notification.type)}-500 ${notification.unread ? 'ring-2 ring-blue-200' : ''}">
      <p class="text-sm font-medium text-${getNotificationColor(notification.type)}-900">${notification.title}</p>
      <p class="text-xs text-${getNotificationColor(notification.type)}-700 mt-1">${notification.message}</p>
      <p class="text-xs text-gray-500 mt-1">${notification.time}</p>
    </div>
  `).join('');
}

function getNotificationColor(type) {
  switch (type) {
    case 'lead': return 'blue';
    case 'commission': return 'green';
    case 'team': return 'purple';
    default: return 'gray';
  }
}

function updateNotificationBadge(count) {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    if (count > 0) {
      badge.style.display = 'block';
      badge.textContent = count > 9 ? '9+' : count;
    } else {
      badge.style.display = 'none';
    }
  }
}

function markNotificationsAsRead() {
  updateNotificationBadge(0);
}

// Profile dropdown - ENHANCED
function initializeProfile() {
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleDropdown(profileDropdown);
    });
  }
}

// Generic dropdown functionality
function toggleDropdown(dropdown) {
  // Close all other dropdowns first
  const allDropdowns = document.querySelectorAll('[id$="Dropdown"]');
  allDropdowns.forEach(dd => {
    if (dd !== dropdown) {
      dd.classList.add('hidden');
    }
  });

  // Toggle the clicked dropdown
  dropdown.classList.toggle('hidden');
}

function hideDropdown(dropdown) {
  dropdown.classList.add('hidden');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  const dropdowns = document.querySelectorAll('[id$="Dropdown"]');
  dropdowns.forEach(dropdown => {
    if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
      hideDropdown(dropdown);
    }
  });
});

// Course card interactions - ENHANCED
function initializeCourseCards() {
  const courseCards = document.querySelectorAll('.course-card, .bg-white.rounded-xl');
  courseCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('shadow-xl', 'scale-105');
      this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('shadow-xl', 'scale-105');
    });
  });
}

// Expert card interactions - ENHANCED
function initializeExpertCards() {
  const expertCards = document.querySelectorAll('.bg-white.rounded-xl.p-6.shadow-sm.border.border-gray-100.text-center');
  expertCards.forEach(card => {
    const bookButton = card.querySelector('button');
    if (bookButton && bookButton.textContent.includes('Book Coaching Call')) {
      bookButton.addEventListener('click', function(e) {
        e.preventDefault();
        const expertName = card.querySelector('h3').textContent;
        console.log('Booking coaching call with:', expertName);
        showNotification(`Booking request sent to ${expertName}! You'll receive a confirmation email shortly.`, 'success');
        
        // Simulate booking process
        setTimeout(() => {
          showNotification(`${expertName} will contact you within 24 hours to schedule your coaching call.`, 'info');
        }, 2000);
      });
    }
  });
}

// Enhanced notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${getNotificationClass(type)} transform transition-all duration-300`;
  notification.textContent = message;
  
  // Add to DOM with animation
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('translate-x-0');
  }, 10);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
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

// Initialize navigation
function initializeNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/')) {
      link.classList.add('bg-blue-600', 'text-white');
      link.classList.remove('text-gray-300', 'hover:bg-slate-700', 'hover:text-white');
    }
  });
}

// Progress tracking
function updateProgress() {
  const progressBars = document.querySelectorAll('.progress-bar, [style*="width:"]');
  progressBars.forEach(bar => {
    const width = bar.style.width || '0%';
    // Add smooth animation
    bar.style.transition = 'width 1s ease-in-out';
    bar.classList.add('progress-bar-animated');
  });
}

// Stats animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.text-2xl.font-bold');
  statNumbers.forEach((stat, index) => {
    // Add staggered animation
    setTimeout(() => {
      stat.classList.add('animate-pulse');
      setTimeout(() => {
        stat.classList.remove('animate-pulse');
      }, 1000);
    }, index * 200);
  });
}

// Video player controls (for lesson page)
function initializeVideoPlayer() {
  const playButtons = document.querySelectorAll('button');
  playButtons.forEach(button => {
    if (button.textContent.includes('Play')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Playing video...');
        showNotification('Video player feature coming soon!', 'info');
      });
    }
  });
}

// Lesson navigation
function initializeLessonNavigation() {
  const prevButtons = document.querySelectorAll('button');
  const nextButtons = document.querySelectorAll('button');
  const completeCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  
  prevButtons.forEach(button => {
    if (button.textContent.includes('Previous Lesson')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Going to previous lesson');
        showNotification('Navigating to previous lesson...', 'info');
      });
    }
  });
  
  nextButtons.forEach(button => {
    if (button.textContent.includes('Next Lesson')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Going to next lesson');
        showNotification('Navigating to next lesson...', 'info');
      });
    }
  });
  
  completeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        console.log('Lesson marked as complete');
        showNotification('Lesson marked as complete! Great job!', 'success');
      }
    });
  });
}

// Responsive design helpers
function handleResponsiveDesign() {
  function checkMobile() {
    if (window.innerWidth < 768) {
      document.body.classList.add('mobile-view');
    } else {
      document.body.classList.remove('mobile-view');
    }
  }
  
  checkMobile();
  window.addEventListener('resize', checkMobile);
}

// Initialize all functionality
function initializeApp() {
  initializeNavigation();
  initializeSearch();
  initializeFeedback();
  initializeNotifications();
  initializeProfile();
  initializeCourseCards();
  initializeExpertCards();
  initializeVideoPlayer();
  initializeLessonNavigation();
  updateProgress();
  animateStats();
  handleResponsiveDesign();
  
  console.log('Digital Era app initialized successfully');
  showNotification('Welcome to Digital Era! All systems ready.', 'success');
}

// Page-specific initializations
function initializePage() {
  const path = window.location.pathname;
  
  switch (path) {
    case '/':
      console.log('Dashboard page loaded');
      // Dashboard-specific functionality
      setTimeout(() => {
        showNotification('Dashboard loaded successfully!', 'info');
      }, 1000);
      break;
    case '/courses':
      console.log('Courses page loaded');
      break;
    case '/experts':
      console.log('Experts page loaded');
      break;
    default:
      if (path.includes('/lesson/')) {
        console.log('Lesson page loaded');
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

// Handle link clicks for SPA-like experience
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.href) {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      console.log('Navigating to:', href);
    }
  }
});

// Export functions for global access
window.showNotification = showNotification;
window.initializeApp = initializeApp;
window.performSearch = performSearch;