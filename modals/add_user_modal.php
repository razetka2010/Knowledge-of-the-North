<div id="addUserModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>👥 Добавить пользователя</h3>
            <button class="modal-close" onclick="closeModal('addUserModal')">×</button>
        </div>
        <form id="userForm" onsubmit="addUser(event)">
            <div class="modal-body">
                <div class="form-group">
                    <label for="userFullName">ФИО *</label>
                    <input type="text" id="userFullName" name="full_name" required placeholder="Иванов Иван Иванович">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="userPosition">Должность</label>
                        <input type="text" id="userPosition" name="position" placeholder="Учитель математики">
                    </div>
                    <div class="form-group">
                        <label for="userEmail">Email *</label>
                        <input type="email" id="userEmail" name="email" required placeholder="user@school.ru">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="userPhone">Телефон</label>
                        <input type="tel" id="userPhone" name="phone" placeholder="+7 (XXX) XXX-XX-XX">
                    </div>
                    <div class="form-group">
                        <label for="userSchool">Школа</label>
                        <select id="userSchool" name="school_id">
                            <option value="">Выберите школу</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="userRole">Роль *</label>
                        <select id="userRole" name="role_id" required>
                            <option value="">Выберите роль</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="userLogin">Логин (если отличается от email)</label>
                        <input type="text" id="userLogin" name="login" placeholder="Логин для входа">
                    </div>
                </div>

                <div class="form-group">
                    <label for="userPassword">Пароль (оставьте пустым для автоматической генерации)</label>
                    <input type="password" id="userPassword" name="password" placeholder="Пароль пользователя">
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" name="send_credentials" value="1" checked>
                        📧 Отправить учетные данные на email
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('addUserModal')">Отмена</button>
                <button type="submit" class="btn-primary">👥 Добавить пользователя</button>
            </div>
        </form>
    </div>
</div>