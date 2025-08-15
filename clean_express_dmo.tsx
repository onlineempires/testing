// Express DMO - 1 Hour Per Day - CLEAN IMPLEMENTATION
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

      {/* Progress Summary - Moved Above Tasks */}
      <div class="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
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
        
        {/* Submit Section */}
        <div class="mt-6 space-y-4">
          <div class="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
            <div>
              <p class="text-sm text-gray-600 mb-1">Ready to submit your DMO?</p>
              <p class="text-xs text-gray-500">This will lock in your progress and add to your streak</p>
            </div>
            <button 
              id="submitDMOBtn" 
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
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversation" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Message 10 connections with value-based messages</div>
                <div class="text-sm text-gray-600">Quick follow-ups, congratulations, or helpful resources (10 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+15 XP</div>
            </label>
            
            <label class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input type="checkbox" class="task-checkbox mr-4 w-5 h-5 text-green-600" data-category="conversation" data-xp="15" />
              <div class="flex-1">
                <div class="font-medium text-gray-900">Start 2-3 conversations in relevant groups</div>
                <div class="text-sm text-gray-600">Answer questions or share quick insights (10 min)</div>
              </div>
              <div class="text-green-600 font-medium text-sm">+15 XP</div>
            </label>
          </div>
        </div>

        {/* Quick Content Creation - 25 minutes */}
        <div class="bg-white rounded-xl p-6 border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-edit text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Quick Content Creation</h3>
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
                submitBtn.textContent = \\`Complete \\${totalTasks - completedCount} more tasks\\`;
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
            
            alert('🔄 RESET COMPLETE!\\\\n\\\\n✅ All data cleared\\\\n✅ All checkboxes unchecked\\\\n✅ Progress reset to 0\\\\n\\\\nNow manually check each task to test!');
          }
          
          function showTaskComplete(xp) {
            // Create floating XP notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            notification.innerHTML = \\`
              <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>Task Complete! +\\${xp} XP</span>
              </div>
            \\`;
            
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
              level: 'express'
            };
            
            localStorage.setItem('dmo_daily_progress', JSON.stringify(progress));
            console.log('💾 Progress saved:', progress);
          }
          
          function loadTaskProgress() {
            const today = new Date().toDateString();
            const saved = localStorage.getItem('dmo_daily_progress');
            
            if (saved) {
              const progress = JSON.parse(saved);
              if (progress.date === today && progress.level === 'express') {
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
            
            globalStats.totalXP = (globalStats.totalXP || 0) + totalXP;
            localStorage.setItem('dmo_stats', JSON.stringify(globalStats));
          }
          
          function submitDMO(level) {
            const today = new Date().toDateString();
            const todaysDMO = localStorage.getItem('todays_dmo_selection');
            
            if (!todaysDMO) {
              alert('Error: No DMO selection found for today.');
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
            
            // Show success message
            alert('DMO Submitted Successfully! 🎉\\\\n\\\\nYour progress has been locked in and your streak has been updated. Come back tomorrow for your next DMO!');
            
            // Disable submit button and update UI
            const submitBtn = document.getElementById('submitDMOBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = '✅ Submitted Today';
            submitBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
            submitBtn.classList.remove('hover:bg-blue-700');
            
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
          
          function updateCountdownTimer() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            updateElement('timeUntilReset', \\`\\${hours}h \\${minutes}m \\${seconds}s\\`);
          }
        `
      }} />
    </Layout>,
    { title: 'Express DMO - Digital Era' }
  )
})