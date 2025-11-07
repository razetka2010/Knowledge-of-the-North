<?php
session_start();

// Подключение к базе данных
$host = 'localhost';
$dbname = 'knowledge_north';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Ошибка подключения: " . $e->getMessage());
}

// ОТЛАДКА: Проверим есть ли пользователи в базе
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $debug_stmt = $pdo->query("SELECT id, login, password, full_name FROM users");
    $all_users = $debug_stmt->fetchAll();
    error_log("Все пользователи в базе: " . print_r($all_users, true));
}

// Обработка формы входа
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_login = trim($_POST['login']);
    $user_password = $_POST['password'];

    // Поиск пользователя в базе данных
    $stmt = $pdo->prepare("
        SELECT u.*, r.name as role_name 
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id 
        WHERE u.login = ? AND u.is_active = TRUE
    ");
    $stmt->execute([$user_login]);
    $user = $stmt->fetch();

    // ОТЛАДКА: Логируем что нашли
    error_log("Найден пользователь: " . print_r($user, true));

    if ($user) {
        error_log("Пароль из базы: " . $user['password']);
        error_log("Введенный пароль: " . $user_password);
        error_log("Результат проверки: " . (password_verify($user_password, $user['password']) ? 'true' : 'false'));
    }

    if ($user && password_verify($user_password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_login'] = $user['login'];
        $_SESSION['user_role'] = $user['role_name'];
        $_SESSION['user_full_name'] = $user['full_name'];
        $_SESSION['school_id'] = $user['school_id'];

        // Обновляем время последнего входа
        $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $updateStmt->execute([$user['id']]);

        // Перенаправляем в зависимости от роли
        if ($user['role_name'] == 'super_admin') {
            header('Location: admin_dashboard.php');
        } else {
            header('Location: dashboard.php');
        }
        exit();
    } else {
        $error = "Неверный логин или пароль!";
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход в систему - Знание Севера</title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
<div class="login-container">
    <div class="login-header">
        <div class="login-logo">
            <img src="https://via.placeholder.com/50x50/0055a4/ffffff?text=ЗС" alt="Логотип">
            <div class="login-logo-text">
                <div class="login-logo-title">Знание Севера</div>
                <div class="login-logo-subtitle">Электронный журнал</div>
            </div>
        </div>
        <h1>Вход в систему</h1>
        <p>Для доступа к электронному журналу требуется авторизация</p>
    </div>

    <form class="login-form" method="POST" action="">
        <?php if (isset($error)): ?>
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <div class="form-group">
            <label for="login">Логин:</label>
            <input type="text" id="login" name="login" required placeholder="Введите ваш логин" value="<?php echo isset($_POST['login']) ? htmlspecialchars($_POST['login']) : ''; ?>">
        </div>

        <div class="form-group">
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required placeholder="Введите ваш пароль">
        </div>

        <button type="submit" class="login-submit-btn">
            <span class="btn-icon">🔐</span>
            Войти в систему
        </button>
    </form>

    <div class="login-footer">
        <a href="index.html" class="back-link">← Вернуться на главную страницу</a>
        <div class="support-info">
            <p>Техническая поддержка: support@znanie-severa.ru</p>
            <?php if (!isset($_SESSION['user_id'])): ?>
                <p style="margin-top: 10px; background: #fff3cd; padding: 10px; border-radius: 4px; border: 1px solid #ffeaa7;">
                    <strong>Тестовый доступ:</strong><br>
                    Логин: <code>admin</code><br>
                    Пароль: <code>admin123</code>
                </p>
            <?php endif; ?>
        </div>
    </div>
</div>

<script src="js/login.js"></script>
</body>
</html>