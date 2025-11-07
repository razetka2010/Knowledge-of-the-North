<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('error' => 'Метод не разрешен'));
    exit();
}

try {
    // Удаляем все настройки
    $GLOBALS['pdo']->exec("DELETE FROM system_settings");

    // Добавляем настройки по умолчанию
    $default_settings = array(
        array('system_name', 'Знание Севера', 'Название системы'),
        array('admin_email', 'admin@znanie-severa.ru', 'Email администратора'),
        array('max_users_per_school', '100', 'Максимальное количество пользователей на школу'),
        array('academic_year', date('Y') . '-' . (date('Y') + 1), 'Текущий учебный год'),
        array('session_timeout', '30', 'Таймаут сессии в минутах'),
        array('backup_enabled', '1', 'Автоматическое резервное копирование')
    );

    $stmt = $GLOBALS['pdo']->prepare("INSERT INTO system_settings (setting_key, setting_value, description) VALUES (?, ?, ?)");

    foreach ($default_settings as $setting) {
        $stmt->execute($setting);
    }

    echo json_encode(array('success' => true, 'message' => 'Настройки сброшены к значениям по умолчанию'));
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>