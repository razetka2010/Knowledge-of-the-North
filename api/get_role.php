<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'ID роли не указан'));
    exit();
}

try {
    $role_id = (int)$_GET['id'];

    $stmt = $GLOBALS['pdo']->prepare("SELECT * FROM roles WHERE id = ?");
    $stmt->execute([$role_id]);
    $role = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$role) {
        http_response_code(404);
        echo json_encode(array('error' => 'Роль не найдена'));
        exit();
    }

    // Декодируем permissions
    $role['permissions'] = json_decode($role['permissions'], true);
    if (!is_array($role['permissions'])) {
        $role['permissions'] = array();
    }

    echo json_encode($role);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>