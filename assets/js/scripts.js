// Software Engineering Placement Prep Dashboard - JavaScript
// Global variables
let currentMonth = 1;
let stats = {
    totalProblems: 0,
    totalProjects: 0,
    totalPosts: 0,
    totalHours: 0
};

// Tab switching functionality
function switchTab(month) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected month content
    document.getElementById(`month${month}`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    currentMonth = month;
}

// Task management functions
function updateTask(checkbox) {
    const taskItem = checkbox.parentElement;
    if (checkbox.checked) {
        taskItem.classList.add('completed');
        // Add a small celebration animation
        taskItem.style.animation = 'none';
        setTimeout(() => {
            taskItem.style.animation = 'celebrationPulse 0.6s ease-out';
        }, 10);
    } else {
        taskItem.classList.remove('completed');
        taskItem.style.animation = 'none';
    }
    
    updateStats();
    saveProgress(); // Auto-save on every change
    setTimeout(celebrateCompletion, 100);
}

// Statistics update function
function updateStats() {
    // Count completed tasks in each month
    const month1Tasks = document.querySelectorAll('#month1 .task-checkbox:checked').length;
    const month2Tasks = document.querySelectorAll('#month2 .task-checkbox:checked').length;
    const month3Tasks = document.querySelectorAll('#month3 .task-checkbox:checked').length;
    
    // Update progress bars
    const totalTasks = document.querySelectorAll('.task-checkbox').length;
    const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
    const overallProgress = (completedTasks / totalTasks) * 100;
    
    // Update overall progress
    const overallProgressBar = document.querySelector('.progress-overview .progress-fill');
    const overallProgressText = document.querySelector('.progress-overview .progress-text');
    if (overallProgressBar && overallProgressText) {
        overallProgressBar.style.width = `${overallProgress}%`;
        overallProgressText.textContent = `${Math.round(overallProgress)}% Complete`;
    }
    
    // Update problem count (estimate based on completed DSA tasks)
    const problemProgress = Math.min((completedTasks * 10), 240);
    const problemProgressElements = document.querySelectorAll('.progress-overview')[0]?.children[1];
    if (problemProgressElements) {
        problemProgressElements.querySelector('.progress-fill').style.width = `${(problemProgress/240)*100}%`;
        problemProgressElements.querySelector('.progress-text').textContent = `${problemProgress} / 240 Problems`;
    }
    
    // Update project count
    const projectCount = Math.min(Math.floor(completedTasks / 4), 3);
    const projectProgressElements = document.querySelectorAll('.progress-overview')[0]?.children[2];
    if (projectProgressElements) {
        projectProgressElements.querySelector('.progress-fill').style.width = `${(projectCount/3)*100}%`;
        projectProgressElements.querySelector('.progress-text').textContent = `${projectCount} / 3 Projects`;
    }
    
    // Update social media posts
    const postCount = Math.min(completedTasks * 3, 90);
    const postProgressElements = document.querySelectorAll('.progress-overview')[0]?.children[3];
    if (postProgressElements) {
        postProgressElements.querySelector('.progress-fill').style.width = `${(postCount/90)*100}%`;
        postProgressElements.querySelector('.progress-text').textContent = `${postCount} / 90 Posts`;
    }
    
    // Update individual month stats
    const m1Problems = document.getElementById('m1-problems');
    const m1Projects = document.getElementById('m1-projects');
    const m1Posts = document.getElementById('m1-posts');
    const m1Hours = document.getElementById('m1-hours');
    
    if (m1Problems) m1Problems.textContent = month1Tasks * 10;
    if (m1Projects) m1Projects.textContent = Math.min(Math.floor(month1Tasks / 4), 1);
    if (m1Posts) m1Posts.textContent = month1Tasks * 4;
    if (m1Hours) m1Hours.textContent = month1Tasks * 8;
    
    const m2Problems = document.getElementById('m2-problems');
    const m2Projects = document.getElementById('m2-projects');
    
    if (m2Problems) m2Problems.textContent = month2Tasks * 12;
    if (m2Projects) m2Projects.textContent = Math.min(Math.floor(month2Tasks / 4), 1);
    
    const m3Problems = document.getElementById('m3-problems');
    const m3Applications = document.getElementById('m3-applications');
    
    if (m3Problems) m3Problems.textContent = month3Tasks * 8;
    if (m3Applications) m3Applications.textContent = month3Tasks * 5;
}

// Celebration function for task completion
function celebrateCompletion() {
    const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
    const totalTasks = document.querySelectorAll('.task-checkbox').length;
    
    if (completedTasks === totalTasks) {
        // Show completion celebration
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉 Congratulations! All tasks completed! 🎉';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: celebrationPulse 2s ease-in-out;
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }
}

// Progress management functions
function saveProgressManually() {
    saveProgress();
}

function resetProgress() {
    if (confirm('⚠️ Are you sure you want to reset ALL progress? This cannot be undone!')) {
        // Clear all checkboxes
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.classList.remove('completed');
        });
        
        // Clear all notes
        document.querySelectorAll('.notes-area').forEach(textarea => {
            textarea.value = '';
        });
        
        // Clear stored data
        window.progressData = null;
        
        // Update display
        updateStats();
        
        // Show confirmation
        const reset = document.createElement('div');
        reset.innerHTML = '🔄 Progress Reset Successfully!';
        reset.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e53e3e, #c53030);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(reset);
        setTimeout(() => reset.remove(), 3000);
    }
}

// Enhanced progress persistence system
function saveProgress() {
    const taskStates = {};
    const notesData = {};
    
    // Save task states
    document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
        taskStates[index] = checkbox.checked;
    });
    
    // Save notes content
    document.querySelectorAll('.notes-area').forEach((textarea, index) => {
        notesData[index] = textarea.value;
    });
    
    // Create comprehensive progress data
    const progressData = {
        tasks: taskStates,
        notes: notesData,
        lastUpdated: new Date().toISOString(),
        currentMonth: currentMonth,
        totalSessions: (window.progressData?.totalSessions || 0) + 1
    };
    
    // Store in memory with backup methods
    window.progressData = progressData;
    
    // Also try to save to URL hash as backup
    try {
        const encoded = btoa(JSON.stringify(progressData));
        // Don't update URL to avoid clutter, but keep data in memory
    } catch (e) {
        console.log('Encoding failed, using memory only');
    }
    
    // Show save confirmation
    showSaveNotification();
}

function loadProgress() {
    let progressData = null;
    
    // Try to load from memory first
    if (window.progressData) {
        progressData = window.progressData;
    }
    
    // Try to load from URL hash as backup
    if (!progressData && window.location.hash) {
        try {
            const encoded = window.location.hash.substring(1);
            progressData = JSON.parse(atob(encoded));
        } catch (e) {
            console.log('Could not load from URL hash');
        }
    }
    
    if (progressData) {
        // Restore task states
        if (progressData.tasks) {
            document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
                if (progressData.tasks[index]) {
                    checkbox.checked = true;
                    checkbox.parentElement.classList.add('completed');
                }
            });
        }
        
        // Restore notes
        if (progressData.notes) {
            document.querySelectorAll('.notes-area').forEach((textarea, index) => {
                if (progressData.notes[index]) {
                    textarea.value = progressData.notes[index];
                }
            });
        }
        
        // Restore current month
        if (progressData.currentMonth) {
            switchTab(progressData.currentMonth);
        }
        
        updateStats();
        showWelcomeBack(progressData);
    }
}

function showSaveNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = '💾 Progress Saved!';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #38a169, #4fd1c7);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 1001;
        box-shadow: 0 10px 30px rgba(56, 161, 105, 0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function showWelcomeBack(progressData) {
    const completedTasks = Object.values(progressData.tasks || {}).filter(Boolean).length;
    const totalTasks = document.querySelectorAll('.task-checkbox').length;
    const progressPercent = Math.round((completedTasks / totalTasks) * 100);
    
    const welcome = document.createElement('div');
    welcome.innerHTML = `
        <div style="font-size: 1.2rem; margin-bottom: 10px;">🎉 Welcome Back!</div>
        <div>You've completed <strong>${completedTasks}</strong> tasks (${progressPercent}%)</div>
        <div style="font-size: 0.9rem; margin-top: 8px; opacity: 0.8;">
            Last updated: ${new Date(progressData.lastUpdated).toLocaleDateString()}
        </div>
    `;
    welcome.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        padding: 25px 35px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        z-index: 1002;
        text-align: center;
        border: 2px solid #e2e8f0;
        animation: celebrationPulse 0.6s ease-out;
    `;
    
    document.body.appendChild(welcome);
    
    setTimeout(() => {
        welcome.style.animation = 'fadeOut 0.5s ease-in';
        setTimeout(() => welcome.remove(), 500);
    }, 4000);
}

// Export/Import functionality
function exportProgress() {
    const progressData = window.progressData || {};
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `placement-prep-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const progressData = JSON.parse(e.target.result);
            window.progressData = progressData;
            loadProgress();
            
            const success = document.createElement('div');
            success.innerHTML = '✅ Progress imported successfully!';
            success.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #38a169, #4fd1c7);
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                font-weight: 600;
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
            `;
            document.body.appendChild(success);
            setTimeout(() => success.remove(), 3000);
        } catch (error) {
            alert('Error importing progress file. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

// Motivational system
const motivationalQuotes = [
    "💪 Consistency is the key to success!",
    "🚀 Every problem solved makes you stronger!",
    "✨ Your dedication today shapes your tomorrow!",
    "🎯 Focus on progress, not perfection!",
    "💡 Code your way to success!",
    "🔥 Push your limits every single day!",
    "⚡ Small daily improvements lead to stunning results!",
    "🌟 Believe in yourself and your journey!"
];

function displayDailyMotivation() {
    const today = new Date().getDate();
    const quote = motivationalQuotes[today % motivationalQuotes.length];
    
    const motivationDiv = document.createElement('div');
    motivationDiv.innerHTML = quote;
    motivationDiv.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 15px 20px;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        font-weight: 600;
        color: #4a5568;
        max-width: 300px;
        z-index: 999;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(motivationDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        motivationDiv.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => motivationDiv.remove(), 500);
    }, 5000);
}

// Dynamic CSS Animations
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebrationPulse {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        @keyframes progressFill {
            from { width: 0%; }
            to { width: var(--target-width); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Interactive animations for progress cards
function addProgressCardAnimations() {
    document.querySelectorAll('.progress-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    switchTab(1);
                    e.preventDefault();
                    break;
                case '2':
                    switchTab(2);
                    e.preventDefault();
                    break;
                case '3':
                    switchTab(3);
                    e.preventDefault();
                    break;
            }
        }
    });
}

// Auto-save functionality for notes
function setupAutoSave() {
    document.querySelectorAll('.notes-area').forEach(textarea => {
        textarea.addEventListener('input', function() {
            clearTimeout(window.noteSaveTimeout);
            window.noteSaveTimeout = setTimeout(saveProgress, 1000); // Auto-save 1 second after typing stops
        });
    });
    
    // Save progress whenever a task is updated
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', saveProgress);
    });
}

// Tooltip for keyboard shortcuts
function addKeyboardShortcutTooltip() {
    const shortcutInfo = document.createElement('div');
    shortcutInfo.innerHTML = '💡 Tip: Use Alt+1, Alt+2, Alt+3 to switch between months';
    shortcutInfo.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 0.85rem;
        z-index: 998;
        opacity: 0.7;
    `;
    document.body.appendChild(shortcutInfo);
}

// Initialize dashboard
function initializeDashboard() {
    // Add dynamic styles
    addDynamicStyles();
    
    // Setup interactive elements
    addProgressCardAnimations();
    setupKeyboardShortcuts();
    setupAutoSave();
    addKeyboardShortcutTooltip();
    
    // Load saved progress
    loadProgress();
    
    // Initialize stats
    updateStats();
    
    // Show daily motivation after a delay
    setTimeout(displayDailyMotivation, 2000);
    
    console.log('🚀 Software Engineering Placement Prep Dashboard initialized successfully!');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Also run if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}