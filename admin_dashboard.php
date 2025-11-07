<?php
session_start();
require_once 'config/database.php';
require_once 'includes/auth_check.php';

// Проверка прав главного администратора
if ($_SESSION['user_role'] != 'super_admin') {
    header('Location: access_denied.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель главного администратора - Знание Севера</title>
    <link rel="stylesheet" href="css/admin.css">
</head>
<body>
<div class="admin-container">
    <header class="admin-header">
        <h1>Панель главного администратора</h1>
        <div class="user-info">
            <span><?php echo htmlspecialchars($_SESSION['user_full_name']); ?></span>
            <a href="logout.php" class="logout-btn">Выйти</a>
        </div>
    </header>

    <nav class="admin-nav">
        <ul>
            <li><a href="#schools" class="nav-link active">🏫 Учебные заведения</a></li>
            <li><a href="#users" class="nav-link">👥 Пользователи</a></li>
            <li><a href="#curriculum" class="nav-link">📚 Учебные планы</a></li>
            <li><a href="#roles" class="nav-link">🎭 Роли</a></li>
            <li><a href="#periods" class="nav-link">📅 Учебные периоды</a></li>
            <li><a href="#reports" class="nav-link">📊 Отчёты</a></li>
            <li><a href="#settings" class="nav-link">⚙️ Настройки</a></li>
        </ul>
    </nav>

    <main class="admin-main">
        <!-- Секция учебных заведений -->
        <section id="schools" class="content-section active">
            <div class="section-header">
                <h2>🏫 Учебные заведения</h2>
                <button class="btn-primary" onclick="openAddSchoolModal()">+ Добавить школу</button>
            </div>
            <div class="schools-list" id="schoolsList">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка школ...</p>
                </div>
            </div>
        </section>

        <!-- Секция пользователей -->
        <section id="users" class="content-section">
            <div class="section-header">
                <h2>👥 Пользователи системы</h2>
                <button class="btn-primary" onclick="openAddUserModal()">+ Добавить пользователя</button>
            </div>
            <div class="users-list" id="usersList">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка пользователей...</p>
                </div>
            </div>
        </section>

        <!-- Секция учебных планов -->
        <section id="curriculum" class="content-section">
            <div class="section-header">
                <h2>📚 Учебные планы</h2>
                <button class="btn-primary" onclick="openAddCurriculumModal()">+ Добавить учебный план</button>
            </div>
            <div class="curriculum-list" id="curriculumList">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка учебных планов...</p>
                </div>
            </div>
        </section>

        <!-- Секция ролей -->
        <section id="roles" class="content-section">
            <div class="section-header">
                <h2>🎭 Роли системы</h2>
                <button class="btn-primary" onclick="openAddRoleModal()">+ Добавить роль</button>
            </div>
            <div class="roles-list" id="rolesList">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка ролей...</p>
                </div>
            </div>
        </section>

        <!-- Секция учебных периодов -->
        <section id="periods" class="content-section">
            <div class="section-header">
                <h2>📅 Учебные периоды</h2>
                <button class="btn-primary" onclick="openAddPeriodModal()">+ Добавить период</button>
            </div>
            <div class="periods-list" id="periodsList">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка учебных периодов...</p>
                </div>
            </div>
        </section>

        <!-- Секция отчетов -->
        <section id="reports" class="content-section">
            <div class="section-header">
                <h2>📊 Системные отчеты</h2>
            </div>
            <div class="reports-content" id="reportsContent">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Формирование отчетов...</p>
                </div>
            </div>
        </section>

        <!-- Секция настроек -->
        <section id="settings" class="content-section">
            <div class="section-header">
                <h2>⚙️ Системные настройки</h2>
            </div>
            <div class="settings-content" id="settingsContent">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Загрузка настроек...</p>
                </div>
            </div>
        </section>
    </main>
</div>

<?php include 'modals/add_school_modal.php'; ?>
<?php include 'modals/add_user_modal.php'; ?>
<?php include 'modals/add_role_modal.php'; ?>
<?php include 'modals/add_curriculum_modal.php'; ?>
<?php include 'modals/add_period_modal.php'; ?>

<!-- Модальные окна редактирования -->
<?php include 'modals/edit_school_modal.php'; ?>
<?php include 'modals/edit_user_modal.php'; ?>
<?php include 'modals/edit_role_modal.php'; ?>
<?php include 'modals/edit_curriculum_modal.php'; ?>
<?php include 'modals/edit_period_modal.php'; ?>

<script src="js/admin_dashboard.js"></script>
</body>
</html>