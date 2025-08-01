let currentMonth = 1;
let stats = {
    totalProblems: 0,
    totalProjects: 0,
    totalPosts: 0,
    totalHours: 0
};

// Schedule and Todo data arrays
let customSchedule = [];
let todoItems = [];

// Default schedule items
const defaultSchedule = [
    { time: "06:00", activity: "🧠 DSA Practice (2 hours)" },
    { time: "09:00", activity: "💻 Frontend Project (3 hours)" },
    { time: "13:00", activity: "🍽️ Break & Lunch" },
    { time: "15:00", activity: "📚 CS Subjects (1 hour)" },
    { time: "16:00", activity: "📱 Social Media & Networking" },
    { time: "19:00", activity: "🔄 DSA Revision (1 hour)" },
    { time: "21:00", activity: "💪 Exercise & Personal Time" }
];

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
    const targetContent = document.getElementById(`month${month}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    // Add active class to the correct button
    const targetButton = document.querySelectorAll('.tab-button')[month - 1];
    if (targetButton) {
        targetButton.classList.add('active');
    }

    currentMonth = month;
    saveProgress();
}

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
    saveProgress();
    setTimeout(celebrateCompletion, 100);
}

function updateStats() {
    // Count completed tasks in each month
    const month1Tasks = document.querySelectorAll('#month1 .task-checkbox:checked').length;
    const month2Tasks = document.querySelectorAll('#month2 .task-checkbox:checked').length;
    const month3Tasks = document.querySelectorAll('#month3 .task-checkbox:checked').length;

    // Update progress bars
    const totalTasks = document.querySelectorAll('.task-checkbox').length;
    const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
    const overallProgress = (completedTasks / totalTasks) * 100;

    document.querySelector('.progress-overview .progress-fill').style.width = `${overallProgress}%`;
    document.querySelector('.progress-overview .progress-text').textContent = `${Math.round(overallProgress)}% Complete`;

    // Update problem count (estimate based on completed DSA tasks)
    const problemProgress = Math.min((completedTasks * 10), 240);
    document.querySelectorAll('.progress-overview')[0].children[1].querySelector('.progress-fill').style.width = `${(problemProgress/240)*100}%`;
    document.querySelectorAll('.progress-overview')[0].children[1].querySelector('.progress-text').textContent = `${problemProgress} / 240 Problems`;

    // Update project count
    const projectCount = Math.min(Math.floor(completedTasks / 4), 3);
    document.querySelectorAll('.progress-overview')[0].children[2].querySelector('.progress-fill').style.width = `${(projectCount/3)*100}%`;
    document.querySelectorAll('.progress-overview')[0].children[2].querySelector('.progress-text').textContent = `${projectCount} / 3 Projects`;

    // Update social media posts
    const postCount = Math.min(completedTasks * 3, 90);
    document.querySelectorAll('.progress-overview')[0].children[3].querySelector('.progress-fill').style.width = `${(postCount/90)*100}%`;
    document.querySelectorAll('.progress-overview')[0].children[3].querySelector('.progress-text').textContent = `${postCount} / 90 Posts`;

    // Update individual month stats
    document.getElementById('m1-problems').textContent = month1Tasks * 10;
    document.getElementById('m1-projects').textContent = Math.min(Math.floor(month1Tasks / 4), 1);
    document.getElementById('m1-posts').textContent = month1Tasks * 4;
    document.getElementById('m1-hours').textContent = month1Tasks * 8;

    document.getElementById('m2-problems').textContent = month2Tasks * 12;
    document.getElementById('m2-projects').textContent = Math.min(Math.floor(month2Tasks / 4), 1);

    document.getElementById('m3-problems').textContent = month3Tasks * 8;
    document.getElementById('m3-applications').textContent = month3Tasks * 5;
}

// Schedule Management Functions
function addScheduleItem() {
    const timeInput = document.getElementById('timeInput');
    const activityInput = document.getElementById('activityInput');

    if (!timeInput.value || !activityInput.value.trim()) {
        showNotification('Please enter both time and activity', 'error');
        return;
    }

    const newItem = {
        time: timeInput.value,
        activity: activityInput.value.trim(),
        id: Date.now()
    };

    customSchedule.push(newItem);
    customSchedule.sort((a, b) => a.time.localeCompare(b.time));

    timeInput.value = '';
    activityInput.value = '';

    renderSchedule();
    saveProgress();
    showNotification('Schedule item added successfully!', 'success');
}

function removeScheduleItem(id) {
    customSchedule = customSchedule.filter(item => item.id !== id);
    renderSchedule();
    saveProgress();
    showNotification('Schedule item removed', 'success');
}

function renderSchedule() {
    const scheduleContainer = document.getElementById('dailySchedule');

    if (customSchedule.length === 0) {
        scheduleContainer.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">No schedule items added. Click "Reset to Default Schedule" to load default timings or add your own custom schedule.</p>';
        return;
    }

    scheduleContainer.innerHTML = customSchedule.map(item => `
        <div class="time-block">
            <span class="time">${formatTime(item.time)}</span>
            <span class="activity">${item.activity}</span>
            <button class="delete-btn" onclick="removeScheduleItem(${item.id})" title="Remove this item">×</button>
        </div>
    `).join('');
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

function resetSchedule() {
    if (confirm('Are you sure you want to reset to the default schedule? This will remove all your custom schedule items.')) {
        customSchedule = defaultSchedule.map((item, index) => ({
            ...item,
            id: Date.now() + index
        }));
        renderSchedule();
        saveProgress();
        showNotification('Schedule reset to default', 'success');
    }
}

// Todo List Functions
function addTodoItem() {
    const todoInput = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('prioritySelect');

    if (!todoInput.value.trim()) {
        showNotification('Please enter a todo item', 'error');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: todoInput.value.trim(),
        priority: prioritySelect.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todoItems.push(newTodo);
    todoInput.value = '';

    renderTodos();
    updateTodoStats();
    saveProgress();
    showNotification('Todo added successfully!', 'success');
}

function toggleTodo(id) {
    const todo = todoItems.find(item => item.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
        updateTodoStats();
        saveProgress();
    }
}

function removeTodo(id) {
    todoItems = todoItems.filter(item => item.id !== id);
    renderTodos();
    updateTodoStats();
    saveProgress();
    showNotification('Todo removed', 'success');
}

function renderTodos() {
    const todoList = document.getElementById('todoList');

    if (todoItems.length === 0) {
        todoList.innerHTML = '<li style="text-align: center; color: #718096; padding: 30px;">No todo items yet. Add some tasks to get started!</li>';
        return;
    }

    todoList.innerHTML = todoItems.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            <span class="todo-priority priority-${todo.priority}">${todo.priority.toUpperCase()}</span>
            <button class="todo-delete" onclick="removeTodo(${todo.id})" title="Delete todo">×</button>
        </li>
    `).join('');
}

function updateTodoStats() {
    const totalTodos = todoItems.length;
    const completedTodos = todoItems.filter(todo => todo.completed).length;

    document.getElementById('todoCount').textContent = totalTodos;
    document.getElementById('todoCompleted').textContent = completedTodos;
}

function clearCompletedTodos() {
    if (todoItems.filter(todo => todo.completed).length === 0) {
        showNotification('No completed todos to clear', 'error');
        return;
    }

    if (confirm('Are you sure you want to delete all completed todos?')) {
        todoItems = todoItems.filter(todo => !todo.completed);
        renderTodos();
        updateTodoStats();
        saveProgress();
        showNotification('Completed todos cleared', 'success');
    }
}

function sortTodosByPriority() {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    todoItems.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed - b.completed; // Incomplete todos first
        }
        return priorityOrder[b.priority] - priorityOrder[a.priority]; // Then by priority
    });
    renderTodos();
    saveProgress();
    showNotification('Todos sorted by priority', 'success');
}

// Enhanced keyboard support
document.addEventListener('keydown', function(e) {
    // Enter key to add schedule item
    if (e.target.id === 'activityInput' && e.key === 'Enter') {
        addScheduleItem();
    }

    // Enter key to add todo item
    if (e.target.id === 'todoInput' && e.key === 'Enter') {
        addTodoItem();
    }

    // Alt key shortcuts for month switching
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
        customSchedule: customSchedule,
        todoItems: todoItems,
        lastUpdated: new Date().toISOString(),
        currentMonth: currentMonth,
        totalSessions: (window.progressData?.totalSessions || 0) + 1,
        neetcodeProfile: localStorage.getItem('neetcodeProfile') || ''
    };

    // Store in memory
    window.progressData = progressData;

    // Also save to localStorage for persistence
    try {
        localStorage.setItem('placement-prep-data', JSON.stringify(progressData));
    } catch (e) {
        console.log('LocalStorage save failed');
    }
}

function loadProgress() {
    let progressData = null;

    // Try to load from memory first
    if (window.progressData) {
        progressData = window.progressData;
    } else {
        // Try to load from localStorage
        try {
            const stored = localStorage.getItem('placement-prep-data');
            if (stored) {
                progressData = JSON.parse(stored);
            }
        } catch (e) {
            console.log('Could not load from localStorage');
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

        // Restore custom schedule
        if (progressData.customSchedule && Array.isArray(progressData.customSchedule)) {
            customSchedule = progressData.customSchedule;
        } else {
            // Load default schedule if no custom schedule exists
            customSchedule = defaultSchedule.map((item, index) => ({
                ...item,
                id: Date.now() + index
            }));
        }

        // Restore todo items
        if (progressData.todoItems && Array.isArray(progressData.todoItems)) {
            todoItems = progressData.todoItems;
        }

        // Restore current month
        if (progressData.currentMonth) {
            currentMonth = progressData.currentMonth;
            // Switch to the saved month
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.tab-button').forEach(button => {
                button.classList.remove('active');
            });
            document.getElementById(`month${currentMonth}`).classList.add('active');
            document.querySelectorAll('.tab-button')[currentMonth - 1].classList.add('active');
        }

        // Restore NeetCode profile
        if (progressData.neetcodeProfile) {
            localStorage.setItem('neetcodeProfile', progressData.neetcodeProfile);
            loadNeetCodeProfile();
        }

        updateStats();
        renderSchedule();
        renderTodos();
        updateTodoStats();
        showWelcomeBack(progressData);
    } else {
        // Load default schedule for new users
        customSchedule = defaultSchedule.map((item, index) => ({
            ...item,
            id: Date.now() + index
        }));
        renderSchedule();
        renderTodos();
        updateTodoStats();
    }
}

function saveProgressManually() {
    saveProgress();
    showNotification('Progress saved successfully!', 'success');
}

function resetProgress() {
    if (confirm('⚠️ Are you sure you want to reset ALL progress? This will remove all tasks, schedule, and todos. This cannot be undone!')) {
        // Clear all checkboxes
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.classList.remove('completed');
        });

        // Clear all notes
        document.querySelectorAll('.notes-area').forEach(textarea => {
            textarea.value = '';
        });

        // Reset schedule and todos
        customSchedule = defaultSchedule.map((item, index) => ({
            ...item,
            id: Date.now() + index
        }));
        todoItems = [];

        // Clear stored data
        window.progressData = null;
        localStorage.removeItem('placement-prep-data');

        // Update display
        updateStats();
        renderSchedule();
        renderTodos();
        updateTodoStats();

        showNotification('🔄 All progress reset successfully!', 'success');
    }
}

function exportProgress() {
    const progressData = window.progressData || {
        tasks: {},
        notes: {},
        customSchedule: customSchedule,
        todoItems: todoItems,
        lastUpdated: new Date().toISOString(),
        currentMonth: currentMonth
    };

    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `placement-prep-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    showNotification('Progress exported successfully!', 'success');
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
            showNotification('✅ Progress imported successfully!', 'success');
        } catch (error) {
            showNotification('Error importing progress file. Please check the file format.', 'error');
        }
    };
    reader.readAsText(file);

    // Reset the file input
    event.target.value = '';
}

// Celebration and notification functions
function celebrateCompletion() {
    const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
    const totalTasks = document.querySelectorAll('.task-checkbox').length;

    if (completedTasks === totalTasks && totalTasks > 0) {
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

function showWelcomeBack(progressData) {
    const completedTasks = Object.values(progressData.tasks || {}).filter(Boolean).length;
    const totalTasks = document.querySelectorAll('.task-checkbox').length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const welcome = document.createElement('div');
    welcome.innerHTML = `
        <div style="font-size: 1.2rem; margin-bottom: 10px;">🎉 Welcome Back!</div>
        <div>You've completed <strong>${completedTasks}</strong> tasks (${progressPercent}%)</div>
        <div>Schedule items: <strong>${customSchedule.length}</strong> | Todos: <strong>${todoItems.length}</strong></div>
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

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'linear-gradient(135deg, #e53e3e, #c53030)' : 'linear-gradient(135deg, #38a169, #4fd1c7)'};
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// NeetCode Profile Functions
function saveNeetCodeProfile() {
    const profileUrl = document.getElementById('neetcodeProfile').value.trim();

    if (!profileUrl) {
        showNotification('Please enter a valid profile URL', 'error');
        return;
    }

    // Validate URL format
    if (!profileUrl.includes('leetcode.com') && !profileUrl.includes('neetcode.io')) {
        showNotification('Please enter a valid LeetCode or NeetCode profile URL', 'error');
        return;
    }

    // Save to localStorage
    localStorage.setItem('neetcodeProfile', profileUrl);
    saveProgress();

    // Update display
    document.getElementById('profileLink').href = profileUrl;
    document.getElementById('profileDisplay').style.display = 'block';
    document.getElementById('neetcodeProfile').value = '';

    showNotification('Profile URL saved successfully!', 'success');
}

function loadNeetCodeProfile() {
    const savedProfile = localStorage.getItem('neetcodeProfile');
    if (savedProfile) {
        document.getElementById('profileLink').href = savedProfile;
        document.getElementById('profileDisplay').style.display = 'block';
    }
}

// Auto-save when notes are updated
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.notes-area').forEach(textarea => {
        textarea.addEventListener('input', function() {
            clearTimeout(window.noteSaveTimeout);
            window.noteSaveTimeout = setTimeout(saveProgress, 1000);
        });
    });
});

// Add motivational quotes that change daily
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

    setTimeout(() => {
        motivationDiv.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => motivationDiv.remove(), 500);
    }, 5000);
}

// Initialize the application
function initializeApp() {
    // Load progress and data
    loadProgress();
    loadNeetCodeProfile();

    // Update stats
    updateStats();

    // Show daily motivation after a delay
    setTimeout(displayDailyMotivation, 2000);

    // Add interactive animations
    document.querySelectorAll('.progress-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add tooltip for keyboard shortcuts
function addShortcutTooltip() {
    const shortcutInfo = document.createElement('div');
    shortcutInfo.innerHTML = '💡 Tips: Alt+1/2/3 for months | Enter to add items | Hover for actions';
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

// Initialize when page loads
window.addEventListener('load', function() {
    initializeApp();
    addShortcutTooltip();
});

// Auto-save on page unload
window.addEventListener('beforeunload', saveProgress);