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
    $period_id = (int)$_GET['id'];

    // Проверяем существование периода
    $check_stmt = $GLOBALS['pdo']->prepare("SELECT id, is_current FROM academic_periods WHERE id = ?");
    $check_stmt->execute([$period_id]);
    $period = $check_stmt->fetch();

    if (!$period) {
        throw new Exception('Учебный период не найден');
    }

    if ($period['is_current']) {
        throw new Exception('Нельзя удалить текущий учебный период');
    }

    $stmt = $GLOBALS['pdo']->prepare("DELETE FROM academic_periods WHERE id = ?");
    $result = $stmt->execute([$period_id]);

    if ($result && $stmt->rowCount() > 0) {
        echo json_encode(array('success' => true, 'message' => 'Учебный период успешно удален'));
    } else {
        throw new Exception('Ошибка при удалении учебного периода');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>