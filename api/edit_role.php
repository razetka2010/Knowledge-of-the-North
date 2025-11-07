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
    $role_id = $_POST['id'];

    // Проверяем существование роли
    $check_stmt = $GLOBALS['pdo']->prepare("SELECT id, is_system_role FROM roles WHERE id = ?");
    $check_stmt->execute([$role_id]);
    $role = $check_stmt->fetch();

    if (!$role) {
        throw new Exception('Роль не найдена');
    }

    if ($role['is_system_role']) {
        throw new Exception('Нельзя редактировать системные роли');
    }

    $permissions = isset($_POST['permissions_json']) ? json_decode($_POST['permissions_json'], true) : array();

    $sql = "UPDATE roles SET name = ?, description = ?, permissions = ? WHERE id = ?";

    $stmt = $GLOBALS['pdo']->prepare($sql);
    $result = $stmt->execute([
        $_POST['name'],
        isset($_POST['description']) ? $_POST['description'] : '',
        json_encode($permissions),
        $role_id
    ]);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Роль успешно обновлена'));
    } else {
        throw new Exception('Ошибка при обновлении роли');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>