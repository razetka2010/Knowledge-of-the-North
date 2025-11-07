<div id="editUserModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>👥 Редактировать пользователя</h3>
            <button class="modal-close" onclick="closeModal('editUserModal')">×</button>
        </div>
        <form id="editUserForm" onsubmit="updateUser(event)">
            <input type="hidden" id="edit_user_id" name="id">
            <div class="modal-body">
                <div class="form-group">
                    <label for="edit_userFullName">ФИО *</label>
                    <input type="text" id="edit_userFullName" name="full_name" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_userPosition">Должность</label>
                        <input type="text" id="edit_userPosition" name="position">
                    </div>
                    <div class="form-group">
                        <label for="edit_userEmail">Email *</label>
                        <input type="email" id="edit_userEmail" name="email" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_userPhone">Телефон</label>
                        <input type="tel" id="edit_userPhone" name="phone">
                    </div>
                    <div class="form-group">
                        <label for="edit_userSchool">Школа</label>
                        <select id="edit_userSchool" name="school_id">
                            <option value="">Выберите школу</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_userRole">Роль *</label>
                        <select id="edit_userRole" name="role_id" required>
                            <option value="">Выберите роль</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_userLogin">Логин *</label>
                        <input type="text" id="edit_userLogin" name="login" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="edit_userActive" name="is_active" value="1">
                        ✅ Активный пользователь
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('editUserModal')">Отмена</button>
                <button type="submit" class="btn-primary">💾 Сохранить изменения</button>
            </div>
        </form>
    </div>
</div>