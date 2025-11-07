<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('error' => 'Метод не разрешен'));
    exit();
}

try {
    $user_id = $_POST['id'];

    // Проверяем существование пользователя
    $check_stmt = $GLOBALS['pdo']->prepare("SELECT id FROM users WHERE id = ?");
    $check_stmt->execute([$user_id]);
    if (!$check_stmt->fetch()) {
        throw new Exception('Пользователь не найден');
    }

    $sql = "UPDATE users SET 
            school_id = ?, role_id = ?, full_name = ?, position = ?, 
            email = ?, phone = ?, login = ?, updated_at = NOW() 
            WHERE id = ?";

    $stmt = $GLOBALS['pdo']->prepare($sql);
    $result = $stmt->execute([
        isset($_POST['school_id']) && !empty($_POST['school_id']) ? $_POST['school_id'] : null,
        $_POST['role_id'],
        $_POST['full_name'],
        isset($_POST['position']) ? $_POST['position'] : '',
        $_POST['email'],
        isset($_POST['phone']) ? $_POST['phone'] : '',
        $_POST['login'],
        $user_id
    ]);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Пользователь успешно обновлен'));
    } else {
        throw new Exception('Ошибка при обновлении пользователя');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>