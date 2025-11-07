<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

try {
    // Статистика по школам
    $schools_stmt = $GLOBALS['pdo']->query("
        SELECT COUNT(*) as total, 
               SUM(status = 'активная') as active,
               SUM(status = 'неактивная') as inactive
        FROM schools
    ");
    $schools_stats = $schools_stmt->fetch(PDO::FETCH_ASSOC);

    // Статистика по пользователям
    $users_stmt = $GLOBALS['pdo']->query("
        SELECT COUNT(*) as total,
               SUM(is_active = 1) as active,
               COUNT(DISTINCT role_id) as roles_count
        FROM users
    ");
    $users_stats = $users_stmt->fetch(PDO::FETCH_ASSOC);

    // Статистика по ролям
    $roles_stmt = $GLOBALS['pdo']->query("
        SELECT r.name, COUNT(u.id) as user_count
        FROM roles r 
        LEFT JOIN users u ON r.id = u.role_id 
        GROUP BY r.id, r.name
    ");
    $roles_stats = $roles_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Активность
    $activity_stmt = $GLOBALS['pdo']->query("
        SELECT COUNT(*) as recent_logins 
        FROM users 
        WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ");
    $activity_stats = $activity_stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(array(
        'success' => true,
        'data' => array(
            'schools' => $schools_stats,
            'users' => $users_stats,
            'roles' => $roles_stats,
            'activity' => $activity_stats,
            'generated_at' => date('Y-m-d H:i:s')
        )
    ));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
}
?>