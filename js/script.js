// База данных для аутентификации
class AuthDatabase {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('users')) {
            this.initializeData();
        }
    }

    initializeData() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@sgo.ru',
                password: 'admin123',
                fullName: 'Иванов Александр Сергеевич',
                role: 'super_admin',
                position: 'Главный администратор',
                phone: '+7 (495) 111-22-33',
                schoolId: null,
                isActive: true,
                permissions: ['all'],
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                username: 'school_admin',
                email: 'admin@school1.ru',
                password: 'admin123',
                fullName: 'Сидорова Мария Петровна',
                role: 'school_admin',
                position: 'Заместитель директора',
                phone: '+7 (495) 123-45-67',
                schoolId: 1,
                isActive: true,
                permissions: ['school_management', 'user_management'],
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                username: 'teacher',
                email: 'teacher@school1.ru',
                password: 'teacher123',
                fullName: 'Петрова Ольга Ивановна',
                role: 'teacher',
                position: 'Учитель математики',
                phone: '+7 (495) 234-56-78',
                schoolId: 1,
                isActive: true,
                permissions: ['grade_management', 'attendance'],
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    authenticateUser(username, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u =>
            (u.username === username || u.email === username) &&
            u.password === password &&
            u.isActive
        );

        if (user) {
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    position: user.position,
                    schoolId: user.schoolId,
                    permissions: user.permissions
                },
                token: 'demo-token-' + Date.now()
            };
        } else {
            throw new Error('Неверный логин или пароль');
        }
    }

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    setToken(token) {
        localStorage.setItem('authToken', token);
    }
}

// Создаем глобальный экземпляр базы данных
const authDB = new AuthDatabase();

// Основной код приложения
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const btnIcon = document.querySelector('.btn-icon');

    // Функция показа уведомления
    function showNotification(message, type = 'info') {
        // Удаляем предыдущие уведомления
        const existingNotification = document.getElementById('notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Скрываем через 5 секунд
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Переключение видимости пароля
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Анимация при фокусе на инпутах
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('.input-icon').style.color = 'var(--primary)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.querySelector('.input-icon').style.color = 'var(--text-light)';
        });
    });

    // Обработка отправки формы
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById('remember').checked;

        // Валидация
        if (!username || !password) {
            showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }

        // Показать загрузку
        setLoadingState(true);

        try {
            // Аутентификация через базу данных
            const result = authDB.authenticateUser(username, password);

            if (result.success) {
                // Сохраняем данные пользователя
                authDB.setCurrentUser(result.user);
                authDB.setToken(result.token);

                showNotification('Вход выполнен успешно!', 'success');

                // Сохранить данные если выбрано "Запомнить меня"
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', username);
                }

                // Перенаправление в зависимости от роли
                setTimeout(() => {
                    redirectUser(result.user.role);
                }, 1500);
            }

        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoadingState(false);
        }
    });

    // Перенаправление пользователя в зависимости от роли
    function redirectUser(role) {
        switch(role) {
            case 'super_admin':
                window.location.href = 'admin-dashboard.html';
                break;
            case 'school_admin':
                window.location.href = 'school-admin-dashboard.html';
                break;
            case 'teacher':
                window.location.href = 'teacher-dashboard.html';
                break;
            default:
                showNotification('Роль не определена', 'error');
        }
    }

    // Управление состоянием загрузки
    function setLoadingState(isLoading) {
        if (isLoading) {
            btnText.style.opacity = '0';
            btnLoader.style.display = 'block';
            btnIcon.style.opacity = '0';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';
        } else {
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
            btnIcon.style.opacity = '1';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }

    // Восстановить сохраненного пользователя
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        document.getElementById('remember').checked = true;
    }

    // Обработчик для "Забыли пароль?"
    document.querySelector('.forgot-link').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Функция восстановления пароля будет доступна скоро', 'info');
    });

    // Добавляем анимацию при загрузке
    setTimeout(() => {
        document.querySelector('.login-card').style.opacity = '1';
        document.querySelector('.features-panel').style.opacity = '1';
    }, 100);

    // Инициализация стилей для плавного появления
    document.querySelector('.login-card').style.opacity = '0';
    document.querySelector('.features-panel').style.opacity = '0';
    document.querySelector('.login-card').style.transition = 'opacity 0.5s ease';
    document.querySelector('.features-panel').style.transition = 'opacity 0.5s ease 0.2s';
});