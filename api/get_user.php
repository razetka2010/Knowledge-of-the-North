<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'ID пользователя не указан'));
    exit();
}

try {
    $user_id = (int)$_GET['id'];

    $stmt = $GLOBALS['pdo']->prepare("
        SELECT u.*, s.full_name as school_name, r.name as role_name 
        FROM users u 
        LEFT JOIN schools s ON u.school_id = s.id 
        LEFT JOIN roles r ON u.role_id = r.id 
        WHERE u.id = ?
    ");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(array('error' => 'Пользователь не найдена'));
        exit();
    }

    echo json_encode($user);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>