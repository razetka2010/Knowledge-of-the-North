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
    // Если выбран как текущий, сбрасываем предыдущий текущий период
    if (isset($_POST['is_current']) && $_POST['is_current'] == '1') {
        $GLOBALS['pdo']->exec("UPDATE academic_periods SET is_current = FALSE");
    }

    $sql = "INSERT INTO academic_periods (name, start_date, end_date, academic_year, is_current) 
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $GLOBALS['pdo']->prepare($sql);
    $result = $stmt->execute([
        $_POST['name'],
        $_POST['start_date'],
        $_POST['end_date'],
        isset($_POST['academic_year']) ? $_POST['academic_year'] : '',
        isset($_POST['is_current']) ? 1 : 0
    ]);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Учебный период успешно создан'));
    } else {
        throw new Exception('Ошибка при создании учебного периода');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>