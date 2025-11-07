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
    $curriculum_id = $_POST['id'];

    // Проверяем существование учебного плана
    $check_stmt = $GLOBALS['pdo']->prepare("SELECT id FROM curriculum WHERE id = ?");
    $check_stmt->execute([$curriculum_id]);
    if (!$check_stmt->fetch()) {
        throw new Exception('Учебный план не найден');
    }

    $subjects = isset($_POST['subjects_json']) ? json_decode($_POST['subjects_json'], true) : array();
    $hours = isset($_POST['hours_json']) ? json_decode($_POST['hours_json'], true) : array();

    // Валидация данных
    if (empty($_POST['school_id']) || empty($_POST['name'])) {
        throw new Exception('Заполните обязательные поля: школа и название плана');
    }

    if (empty($subjects) || empty($hours)) {
        throw new Exception('Добавьте хотя бы один предмет');
    }

    $sql = "UPDATE curriculum SET 
            school_id = ?, name = ?, description = ?, grade_level = ?, 
            academic_year = ?, subjects = ?, hours_per_week = ?, updated_at = NOW() 
            WHERE id = ?";

    $stmt = $GLOBALS['pdo']->prepare($sql);
    $result = $stmt->execute([
        $_POST['school_id'],
        $_POST['name'],
        isset($_POST['description']) ? $_POST['description'] : '',
        isset($_POST['grade_level']) ? $_POST['grade_level'] : '',
        isset($_POST['academic_year']) ? $_POST['academic_year'] : '',
        json_encode($subjects),
        json_encode($hours),
        $curriculum_id
    ]);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Учебный план успешно обновлен'));
    } else {
        throw new Exception('Ошибка при обновлении учебного плана');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>