<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

try {
    $sql = "SELECT c.*, s.full_name as school_name 
            FROM curriculum c 
            LEFT JOIN schools s ON c.school_id = s.id 
            ORDER BY c.created_at DESC";

    $stmt = $GLOBALS['pdo']->query($sql);
    $curriculum = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Декодируем JSON поля
    foreach ($curriculum as &$plan) {
        $plan['subjects'] = json_decode($plan['subjects'], true);
        $plan['hours_per_week'] = json_decode($plan['hours_per_week'], true);

        // Если декодирование не удалось, устанавливаем пустые массивы
        if (!is_array($plan['subjects'])) {
            $plan['subjects'] = array();
        }
        if (!is_array($plan['hours_per_week'])) {
            $plan['hours_per_week'] = array();
        }
    }

    echo json_encode($curriculum);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>