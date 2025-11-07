// Основные функции для главной страницы
function goToLogin() {
    // Перенаправление на страницу входа через ЕСИА
    showLoading('Перенаправление на портал госуслуг...');
    setTimeout(() => {
        window.location.href = 'esia-login.php';
    }, 1000);
}

function goToSimpleLogin() {
    // Перенаправление на стандартную страницу входа
    showLoading('Переход к форме входа...');
    setTimeout(() => {
        window.location.href = 'login.php';
    }, 500);
}

function showLoading(message) {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;

    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
    `;

    document.body.appendChild(loading);
    return loading;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем плавное появление карточек
    const cards = document.querySelectorAll('.benefit-card, .login-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Обновление года в футере
    updateFooterYear();

    // Добавляем стили для загрузки
    addLoadingStyles();
});

function updateFooterYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} Правительство Ямало-Ненецкого автономного округа. Все права защищены.`;
    }
}

function addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .loading-content {
            text-align: center;
            background: white;
            padding: 30px;
            border-radius: 5px;
            color: #333;
        }
        
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #0055a4;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Функция для показа системных уведомлений
function showSystemNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `system-notification system-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '⚠️' : 'ℹ️'}</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Добавляем стили для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .system-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-left: 4px solid #0055a4;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        border-radius: 3px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    }
    
    .system-notification-error {
        border-left-color: #dc3545;
    }
    
    .notification-content {
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-text {
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
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
document.head.appendChild(notificationStyles);