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
    $check_stmt = $GLOBALS['pdo']->prepare("SELECT id FROM academic_periods WHERE id = ?");
    $check_stmt->execute([$period_id]);
    if (!$check_stmt->fetch()) {
        throw new Exception('Учебный период не найден');
    }

    // Сбрасываем все текущие периоды
    $GLOBALS['pdo']->exec("UPDATE academic_periods SET is_current = FALSE");

    // Устанавливаем выбранный период как текущий
    $stmt = $GLOBALS['pdo']->prepare("UPDATE academic_periods SET is_current = TRUE WHERE id = ?");
    $result = $stmt->execute([$period_id]);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Учебный период установлен как текущий'));
    } else {
        throw new Exception('Ошибка при установке текущего периода');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>