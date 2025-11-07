<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'ID периода не указан'));
    exit();
}

try {
    $period_id = (int)$_GET['id'];

    $stmt = $GLOBALS['pdo']->prepare("SELECT * FROM academic_periods WHERE id = ?");
    $stmt->execute([$period_id]);
    $period = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$period) {
        http_response_code(404);
        echo json_encode(array('error' => 'Учебный период не найден'));
        exit();
    }

    echo json_encode($period);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>