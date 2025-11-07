<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

try {
    $sql = "SELECT u.*, s.full_name as school_name, r.name as role_name 
            FROM users u 
            LEFT JOIN schools s ON u.school_id = s.id 
            LEFT JOIN roles r ON u.role_id = r.id 
            ORDER BY u.created_at DESC";

    $stmt = $GLOBALS['pdo']->query($sql);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>