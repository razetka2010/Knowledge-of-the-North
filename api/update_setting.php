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
    $setting_key = $_POST['setting_key'];
    $setting_value = $_POST['setting_value'];

    $sql = "INSERT INTO system_settings (setting_key, setting_value) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE setting_value = ?";

    $stmt = $GLOBALS['pdo']->prepare($sql);
    $result = $stmt->execute([$setting_key, $setting_value, $setting_value]);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Настройка обновлена'));
    } else {
        throw new Exception('Ошибка при обновлении настройки');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>