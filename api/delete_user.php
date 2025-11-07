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
    $userId = (int)$_GET['id'];

    // Нельзя удалить самого себя
    if ($userId == $_SESSION['user_id']) {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => 'Нельзя удалить свой собственный аккаунт'));
        exit();
    }

    $stmt = $GLOBALS['pdo']->prepare("DELETE FROM users WHERE id = ?");
    $result = $stmt->execute(array($userId));

    if ($result && $stmt->rowCount() > 0) {
        echo json_encode(array('success' => true, 'message' => 'Пользователь успешно удален'));
    } else {
        http_response_code(404);
        echo json_encode(array('success' => false, 'message' => 'Пользователь не найден'));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>