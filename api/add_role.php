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
    $permissions = isset($_POST['permissions_json']) ? json_decode($_POST['permissions_json'], true) : array();

    $sql = "INSERT INTO roles (name, description, permissions, is_system_role) 
            VALUES (?, ?, ?, ?)";

    $stmt = $GLOBALS['pdo']->prepare($sql);
    $result = $stmt->execute([
        $_POST['name'],
        isset($_POST['description']) ? $_POST['description'] : '',
        json_encode($permissions),
        isset($_POST['is_system_role']) ? 1 : 0
    ]);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Роль успешно создана'));
    } else {
        throw new Exception('Ошибка при создании роли');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>