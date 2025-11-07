<?php
// Конфигурация базы данных
$host = 'localhost';
$dbname = 'knowledge_north';
$username = 'root';
$password = '';

try {
    $GLOBALS['pdo'] = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $GLOBALS['pdo']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $GLOBALS['pdo']->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Ошибка подключения: " . $e->getMessage());
}
?>