<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'ID учебного плана не указан'));
    exit();
}

try {
    $curriculum_id = (int)$_GET['id'];

    $stmt = $GLOBALS['pdo']->prepare("SELECT * FROM curriculum WHERE id = ?");
    $stmt->execute([$curriculum_id]);
    $curriculum = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$curriculum) {
        http_response_code(404);
        echo json_encode(array('error' => 'Учебный план не найден'));
        exit();
    }

    // Декодируем JSON поля
    $curriculum['subjects'] = json_decode($curriculum['subjects'], true);
    $curriculum['hours_per_week'] = json_decode($curriculum['hours_per_week'], true);

    if (!is_array($curriculum['subjects'])) {
        $curriculum['subjects'] = array();
    }
    if (!is_array($curriculum['hours_per_week'])) {
        $curriculum['hours_per_week'] = array();
    }

    echo json_encode($curriculum);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>