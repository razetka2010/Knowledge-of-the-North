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
    $schoolId = (int)$_GET['id'];

    // Проверяем, есть ли пользователи, связанные с этой школой
    $stmt = $GLOBALS['pdo']->prepare("SELECT COUNT(*) as user_count FROM users WHERE school_id = ?");
    $stmt->execute(array($schoolId));
    $result = $stmt->fetch();

    if ($result['user_count'] > 0) {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => 'Невозможно удалить школу: есть связанные пользователи'));
        exit();
    }

    $stmt = $GLOBALS['pdo']->prepare("DELETE FROM schools WHERE id = ?");
    $result = $stmt->execute(array($schoolId));

    if ($result && $stmt->rowCount() > 0) {
        echo json_encode(array('success' => true, 'message' => 'Школа успешно удалена'));
    } else {
        http_response_code(404);
        echo json_encode(array('success' => false, 'message' => 'Школа не найдена'));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>