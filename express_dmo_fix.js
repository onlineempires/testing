// BULLETPROOF EXPRESS DMO PROGRESS TRACKING
console.log('🚀 Express DMO script loading...');

window.addEventListener('load', function() {
  console.log('✅ Express DMO page loaded');
  
  // Start countdown timer
  updateCountdownTimer();
  setInterval(updateCountdownTimer, 1000);
  
  // Add event listeners to all checkboxes
  const checkboxes = document.querySelectorAll('.task-checkbox');
  console.log('Found', checkboxes.length, 'checkboxes');
  
  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function() {
      console.log('📋 Checkbox', index, 'changed to:', this.checked);
      updateAllProgress();
    });
  });
  
  // Force initial progress calculation
  updateAllProgress();
});

function updateAllProgress() {
  console.log('🔄 Calculating progress...');
  
  // Count all checked tasks by category
  let socialCount = 0;
  let conversationCount = 0; 
  let contentCount = 0;
  let totalXP = 0;
  let totalCompleted = 0;
  
  const checkboxes = document.querySelectorAll('.task-checkbox');
  console.log('Checking', checkboxes.length, 'checkboxes...');
  
  checkboxes.forEach((checkbox, index) => {
    console.log('Checkbox', index, '- checked:', checkbox.checked, 'category:', checkbox.dataset.category);
    if (checkbox.checked) {
      const category = checkbox.dataset.category;
      const xp = parseInt(checkbox.dataset.xp) || 0;
      
      if (category === 'social') socialCount++;
      if (category === 'conversation') conversationCount++;
      if (category === 'content') contentCount++;
      
      totalXP += xp;
      totalCompleted++;
    }
  });
  
  console.log('📊 Final Progress:', {
    social: socialCount,
    conversation: conversationCount,
    content: contentCount,
    totalCompleted: totalCompleted,
    totalXP: totalXP
  });
  
  // Update all progress displays immediately
  updateElement('socialProgress', socialCount + '/3');
  updateElement('conversationProgress', conversationCount + '/2');
  updateElement('contentProgress', contentCount + '/1');
  updateElement('expressProgress', totalCompleted + '/6');
  updateElement('completedTasks', totalCompleted);
  updateElement('earnedXP', totalXP);
  
  const percentage = Math.round((totalCompleted / 6) * 100);
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
    if (totalCompleted >= 6) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Complete DMO 🎉';
      submitBtn.className = 'bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors';
      console.log('✅ Submit button ENABLED');
    } else {
      submitBtn.disabled = true;
      submitBtn.textContent = `Complete ${6 - totalCompleted} more tasks`;
      submitBtn.className = 'bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed';
      console.log('❌ Submit button disabled -', (6 - totalCompleted), 'tasks remaining');
    }
  }
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
    console.log('⬜ Unchecked checkbox', index);
  });
  
  // Update progress
  updateAllProgress();
  
  alert('🔄 RESET COMPLETE!\\n\\n✅ All data cleared\\n✅ All checkboxes unchecked\\n✅ Progress reset to 0\\n\\nNow manually check each task to test!');
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
  
  updateElement('timeUntilReset', `${hours}h ${minutes}m ${seconds}s`);
}

function submitDMO(level) {
  alert('🎉 EXPRESS DMO SUBMITTED!\\n\\n(This is a demo - full submission logic would save to database)');
}