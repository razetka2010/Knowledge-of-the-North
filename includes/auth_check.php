<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] != 'super_admin') {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(array('error' => 'Доступ запрещен'));
    exit();
}
?>