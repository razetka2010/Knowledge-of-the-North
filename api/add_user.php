<?php
require_once '../config/database.php';
require_once '../includes/auth_check.php';
require_once '../includes/admin_functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('error' => 'Метод не разрешен'));
    exit();
}

try {
    $adminFunctions = new SuperAdminFunctions($GLOBALS['pdo']);

    $userData = array(
        'school_id' => isset($_POST['school_id']) && !empty($_POST['school_id']) ? $_POST['school_id'] : null,
        'role_id' => $_POST['role_id'],
        'full_name' => $_POST['full_name'],
        'position' => isset($_POST['position']) ? $_POST['position'] : '',
        'email' => $_POST['email'],
        'phone' => isset($_POST['phone']) ? $_POST['phone'] : '',
        'login' => isset($_POST['login']) ? $_POST['login'] : '',
        'password' => isset($_POST['password']) ? $_POST['password'] : ''
    );

    // Определяем тип создания пользователя
    $isManual = !empty($_POST['password']);

    $result = $adminFunctions->addSchoolAdmin($userData, $isManual);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Пользователь успешно добавлен'));
    } else {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => 'Ошибка при добавлении пользователя'));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка: ' . $e->getMessage()));
}
?>