<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';
require_once '../includes/admin_functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET' || !isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'Неверный запрос'));
    exit();
}

try {
    $userId = (int)$_GET['id'];
    $adminFunctions = new SuperAdminFunctions($GLOBALS['pdo']);

    $result = $adminFunctions->resetUserPassword($userId);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Пароль успешно сброшен. Новый пароль отправлен на email пользователя.'));
    } else {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => 'Ошибка при сбросе пароля'));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка: ' . $e->getMessage()));
}
?>