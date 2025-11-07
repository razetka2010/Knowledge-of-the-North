<?php
class SuperAdminFunctions {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Генерация случайной строки для PHP 5.5
    private function generateRandomString($length = 8) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    // 1.0 - Добавление учебного заведения
    public function addSchool($data) {
        $sql = "INSERT INTO schools (full_name, short_name, inn, type, status, legal_address, physical_address, phone, email, website, director_name, license_number, license_date, license_issued_by, accreditation_number, accreditation_date, accreditation_valid_until) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(array(
            $data['full_name'],
            isset($data['short_name']) ? $data['short_name'] : '',
            $data['inn'],
            isset($data['type']) ? $data['type'] : 'общеобразовательная',
            isset($data['status']) ? $data['status'] : 'активная',
            isset($data['legal_address']) ? $data['legal_address'] : '',
            isset($data['physical_address']) ? $data['physical_address'] : '',
            isset($data['phone']) ? $data['phone'] : '',
            isset($data['email']) ? $data['email'] : '',
            isset($data['website']) ? $data['website'] : '',
            isset($data['director_name']) ? $data['director_name'] : '',
            isset($data['license_number']) ? $data['license_number'] : '',
            isset($data['license_date']) ? $data['license_date'] : null,
            isset($data['license_issued_by']) ? $data['license_issued_by'] : '',
            isset($data['accreditation_number']) ? $data['accreditation_number'] : '',
            isset($data['accreditation_date']) ? $data['accreditation_date'] : null,
            isset($data['accreditation_valid_until']) ? $data['accreditation_valid_until'] : null
        ));
    }

    // 2.0/2.1 - Добавление администратора школы
    public function addSchoolAdmin($data, $isManual = false) {
        if ($isManual && !empty($data['password'])) {
            // 2.1 - Ручное создание с логином и паролем
            $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
            $login = !empty($data['login']) ? $data['login'] : explode('@', $data['email'])[0];

            $sql = "INSERT INTO users (school_id, role_id, login, password, full_name, position, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            return $stmt->execute(array(
                isset($data['school_id']) ? $data['school_id'] : null,
                $data['role_id'],
                $login,
                $passwordHash,
                $data['full_name'],
                isset($data['position']) ? $data['position'] : '',
                $data['email'],
                isset($data['phone']) ? $data['phone'] : ''
            ));
        } else {
            // 2.0 - Автоматическое создание
            $login = explode('@', $data['email'])[0];
            $tempPassword = $this->generateRandomString(8);
            $passwordHash = password_hash($tempPassword, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users (school_id, role_id, login, password, full_name, position, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->pdo->prepare($sql);
            $result = $stmt->execute(array(
                isset($data['school_id']) ? $data['school_id'] : null,
                $data['role_id'],
                $login,
                $passwordHash,
                $data['full_name'],
                isset($data['position']) ? $data['position'] : '',
                $data['email'],
                isset($data['phone']) ? $data['phone'] : ''
            ));

            if ($result && isset($_POST['send_credentials'])) {
                $this->sendWelcomeEmail($data['email'], $login, $tempPassword);
            }

            return $result;
        }
    }

    // Сброс пароля пользователя
    public function resetUserPassword($userId) {
        $tempPassword = $this->generateRandomString(8);
        $passwordHash = password_hash($tempPassword, PASSWORD_DEFAULT);

        $sql = "UPDATE users SET password = ? WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute(array($passwordHash, $userId));

        if ($result) {
            $user = $this->getUserById($userId);
            if ($user && !empty($user['email'])) {
                $this->sendPasswordResetEmail($user['email'], $tempPassword);
            }
        }

        return $result;
    }

    // Получение всех пользователей
    public function getAllUsers($filters = array()) {
        $sql = "SELECT u.*, s.full_name as school_name, r.name as role_name 
                FROM users u 
                LEFT JOIN schools s ON u.school_id = s.id 
                LEFT JOIN roles r ON u.role_id = r.id 
                WHERE 1=1";

        $params = array();

        if (!empty($filters['school_id'])) {
            $sql .= " AND u.school_id = ?";
            $params[] = $filters['school_id'];
        }

        if (!empty($filters['role_id'])) {
            $sql .= " AND u.role_id = ?";
            $params[] = $filters['role_id'];
        }

        $sql .= " ORDER BY u.created_at DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    private function sendWelcomeEmail($email, $login, $password) {
        // Заглушка для отправки email
        error_log("Welcome email to: $email, Login: $login, Password: $password");
        return true;
    }

    private function sendPasswordResetEmail($email, $newPassword) {
        // Заглушка для отправки email
        error_log("Password reset email to: $email, New Password: $newPassword");
        return true;
    }

    private function getUserById($userId) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute(array($userId));
        return $stmt->fetch();
    }
}
?>