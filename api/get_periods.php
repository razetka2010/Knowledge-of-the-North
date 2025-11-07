<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

try {
    $stmt = $GLOBALS['pdo']->query("SELECT * FROM academic_periods ORDER BY start_date DESC");
    $periods = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($periods);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>