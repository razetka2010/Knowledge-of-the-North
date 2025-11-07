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
    $curriculum_id = (int)$_GET['id'];

    // Проверяем существование учебного плана
    $check_stmt = $GLOBALS['pdo']->prepare("SELECT id FROM curriculum WHERE id = ?");
    $check_stmt->execute([$curriculum_id]);
    if (!$check_stmt->fetch()) {
        throw new Exception('Учебный план не найден');
    }

    $stmt = $GLOBALS['pdo']->prepare("DELETE FROM curriculum WHERE id = ?");
    $result = $stmt->execute([$curriculum_id]);

    if ($result && $stmt->rowCount() > 0) {
        echo json_encode(array('success' => true, 'message' => 'Учебный план успешно удален'));
    } else {
        throw new Exception('Ошибка при удалении учебного плана');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>