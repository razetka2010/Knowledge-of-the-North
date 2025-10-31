// Основной файл для админ-панели
document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    checkAuth();

    // Инициализация меню
    initMenu();

    // Инициализация быстрых действий
    initQuickActions();

    // Инициализация кнопки выхода
    initLogout();

    // Инициализация статистики
    initStats();

    // Инициализация обновления статистики
    initStatsRefresh();
});

// Проверка авторизации
function checkAuth() {
    const currentUser = realDB.getCurrentUser();
    if (!currentUser || currentUser.role !== 'super_admin') {
        window.location.href = 'index.html';
        return;
    }

    // Обновляем информацию о пользователе в шапке
    const userInfo = document.querySelector('.user-info span');
    if (userInfo && currentUser.fullName) {
        userInfo.textContent = currentUser.fullName;
    }
}

// Инициализация меню
function initMenu() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const moduleName = this.getAttribute('data-module');
            adminModules.loadModule(moduleName);
        });
    });
}

// Инициализация быстрых действий
function initQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');

    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const moduleName = this.getAttribute('data-module');
            adminModules.loadModule(moduleName);
        });
    });
}

// Инициализация кнопки выхода
function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');

    logoutBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            realDB.logout();
            window.location.href = 'index.html';
        }
    });
}

// Инициализация статистики
function initStats() {
    updateStats();
}

// Инициализация обновления статистики
function initStatsRefresh() {
    const refreshBtn = document.getElementById('refreshStats');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            updateStats();
            adminModules.showNotification('Статистика обновлена', 'success');
        });
    }
}

// Обновление статистики
function updateStats() {
    const stats = realDB.getSystemStats();

    if (document.getElementById('schools-count')) {
        document.getElementById('schools-count').textContent = stats.schoolsCount;
    }
    if (document.getElementById('users-count')) {
        document.getElementById('users-count').textContent = stats.usersCount;
    }
    if (document.getElementById('admins-count')) {
        document.getElementById('admins-count').textContent = stats.adminsCount;
    }
    if (document.getElementById('activity-percent')) {
        document.getElementById('activity-percent').textContent = stats.activityPercent + '%';
    }
}

// Глобальные функции
window.adminModules = adminModules;
window.realDB = realDB;
