<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET' || !isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'Неверный запрос'));
    exit();
}

try {
    $role_id = (int)$_GET['id'];

    // Проверяем существование роли и что она не системная
    $check_stmt = $GLOBALS['pdo']->prepare("SELECT is_system_role FROM roles WHERE id = ?");
    $check_stmt->execute([$role_id]);
    $role = $check_stmt->fetch();

    if (!$role) {
        throw new Exception('Роль не найдена');
    }

    if ($role['is_system_role']) {
        throw new Exception('Нельзя удалять системные роли');
    }

    // Проверяем, есть ли пользователи с этой ролью
    $users_stmt = $GLOBALS['pdo']->prepare("SELECT COUNT(*) as user_count FROM users WHERE role_id = ?");
    $users_stmt->execute([$role_id]);
    $users = $users_stmt->fetch();

    if ($users['user_count'] > 0) {
        throw new Exception('Нельзя удалить роль: есть пользователи с этой ролью');
    }

    $stmt = $GLOBALS['pdo']->prepare("DELETE FROM roles WHERE id = ?");
    $result = $stmt->execute([$role_id]);

    if ($result && $stmt->rowCount() > 0) {
        echo json_encode(array('success' => true, 'message' => 'Роль успешно удалена'));
    } else {
        throw new Exception('Ошибка при удалении роли');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>