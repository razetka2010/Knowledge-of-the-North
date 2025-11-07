document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const inputs = document.querySelectorAll('input');

    // Анимация появления формы
    loginForm.style.opacity = '0';
    loginForm.style.transform = 'translateY(30px)';

    setTimeout(() => {
        loginForm.style.transition = 'all 0.5s ease';
        loginForm.style.opacity = '1';
        loginForm.style.transform = 'translateY(0)';
    }, 300);

    // Валидация формы в реальном времени
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.background = 'rgba(255, 255, 255, 0.3)';
            } else {
                this.style.background = 'rgba(255, 255, 255, 0.2)';
            }
        });
    });

    // Показ/скрытие пароля
    const passwordInput = document.getElementById('password');
    const togglePassword = document.createElement('span');
    togglePassword.innerHTML = '👁️';
    togglePassword.style.cursor = 'pointer';
    togglePassword.style.position = 'absolute';
    togglePassword.style.right = '10px';
    togglePassword.style.top = '50%';
    togglePassword.style.transform = 'translateY(-50%)';

    passwordInput.parentNode.style.position = 'relative';
    passwordInput.parentNode.appendChild(togglePassword);

    togglePassword.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.innerHTML = '🔒';
        } else {
            passwordInput.type = 'password';
            this.innerHTML = '👁️';
        }
    });
});