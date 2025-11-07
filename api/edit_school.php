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
    $school_id = $_POST['id'];

    // Проверяем существование школы
    $check_stmt = $GLOBALS['pdo']->prepare("SELECT id FROM schools WHERE id = ?");
    $check_stmt->execute([$school_id]);
    if (!$check_stmt->fetch()) {
        throw new Exception('Школа не найдена');
    }

    $sql = "UPDATE schools SET 
            full_name = ?, short_name = ?, inn = ?, type = ?, status = ?, 
            legal_address = ?, physical_address = ?, phone = ?, email = ?, 
            website = ?, director_name = ?, license_number = ?, license_date = ?, 
            license_issued_by = ?, accreditation_number = ?, accreditation_date = ?, 
            accreditation_valid_until = ?, updated_at = NOW() 
            WHERE id = ?";

    $stmt = $GLOBALS['pdo']->prepare($sql);
    $result = $stmt->execute([
        $_POST['full_name'],
        isset($_POST['short_name']) ? $_POST['short_name'] : '',
        $_POST['inn'],
        isset($_POST['type']) ? $_POST['type'] : 'общеобразовательная',
        isset($_POST['status']) ? $_POST['status'] : 'активная',
        isset($_POST['legal_address']) ? $_POST['legal_address'] : '',
        isset($_POST['physical_address']) ? $_POST['physical_address'] : '',
        isset($_POST['phone']) ? $_POST['phone'] : '',
        isset($_POST['email']) ? $_POST['email'] : '',
        isset($_POST['website']) ? $_POST['website'] : '',
        isset($_POST['director_name']) ? $_POST['director_name'] : '',
        isset($_POST['license_number']) ? $_POST['license_number'] : '',
        isset($_POST['license_date']) ? $_POST['license_date'] : null,
        isset($_POST['license_issued_by']) ? $_POST['license_issued_by'] : '',
        isset($_POST['accreditation_number']) ? $_POST['accreditation_number'] : '',
        isset($_POST['accreditation_date']) ? $_POST['accreditation_date'] : null,
        isset($_POST['accreditation_valid_until']) ? $_POST['accreditation_valid_until'] : null,
        $school_id
    ]);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Школа успешно обновлена'));
    } else {
        throw new Exception('Ошибка при обновлении школы');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array('success' => false, 'message' => $e->getMessage()));
}
?>