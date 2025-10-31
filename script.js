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
    const notification = document.getElementById('notification');

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
            // Имитация запроса к серверу
            await simulateLoginRequest(username, password, rememberMe);

            showNotification('Вход выполнен успешно!', 'success');

            // Сохранить данные если выбрано "Запомнить меня"
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            }

            // Перенаправление (в реальном проекте)
            setTimeout(() => {
                // window.location.href = 'dashboard.html';
                showNotification('Перенаправление на главную страницу...', 'info');
            }, 2000);

        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoadingState(false);
        }
    });

    // Функция имитации запроса к серверу
    function simulateLoginRequest(username, password, rememberMe) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Демо-логика проверки
                const validUsers = ['admin', 'teacher', 'student', 'parent'];

                if (validUsers.includes(username.toLowerCase()) && password.length >= 3) {
                    resolve({
                        success: true,
                        user: {
                            username: username,
                            role: username.toLowerCase(),
                            token: 'demo-token-' + Date.now()
                        }
                    });
                } else {
                    reject(new Error('Неверный логин или пароль'));
                }
            }, 2000);
        });
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

    // Показать уведомление
    function showNotification(message, type = 'info') {
        notification.textContent = message;
        notification.className = `notification ${type}`;

        // Автоскрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
        }, 5000);
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