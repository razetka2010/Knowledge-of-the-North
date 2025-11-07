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

    $schoolData = array(
        'full_name' => $_POST['full_name'],
        'short_name' => isset($_POST['short_name']) ? $_POST['short_name'] : '',
        'inn' => $_POST['inn'],
        'type' => isset($_POST['type']) ? $_POST['type'] : 'общеобразовательная',
        'status' => isset($_POST['status']) ? $_POST['status'] : 'активная',
        'legal_address' => isset($_POST['legal_address']) ? $_POST['legal_address'] : '',
        'physical_address' => isset($_POST['physical_address']) ? $_POST['physical_address'] : '',
        'phone' => isset($_POST['phone']) ? $_POST['phone'] : '',
        'email' => isset($_POST['email']) ? $_POST['email'] : '',
        'website' => isset($_POST['website']) ? $_POST['website'] : '',
        'director_name' => isset($_POST['director_name']) ? $_POST['director_name'] : '',
        'license_number' => isset($_POST['license_number']) ? $_POST['license_number'] : '',
        'license_date' => isset($_POST['license_date']) ? $_POST['license_date'] : null,
        'license_issued_by' => isset($_POST['license_issued_by']) ? $_POST['license_issued_by'] : '',
        'accreditation_number' => isset($_POST['accreditation_number']) ? $_POST['accreditation_number'] : '',
        'accreditation_date' => isset($_POST['accreditation_date']) ? $_POST['accreditation_date'] : null,
        'accreditation_valid_until' => isset($_POST['accreditation_valid_until']) ? $_POST['accreditation_valid_until'] : null
    );

    $result = $adminFunctions->addSchool($schoolData);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Школа успешно добавлена'));
    } else {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => 'Ошибка при добавлении школы'));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка базы данных: ' . $e->getMessage()));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Ошибка: ' . $e->getMessage()));
}
?>