<div id="addRoleModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>🎭 Добавить роль</h3>
            <button class="modal-close" onclick="closeModal('addRoleModal')">×</button>
        </div>
        <form id="roleForm" onsubmit="addRole(event)">
            <div class="modal-body">
                <div class="form-group">
                    <label for="roleName">Название роли *</label>
                    <input type="text" id="roleName" name="name" required placeholder="Например: учитель, классный руководитель">
                </div>

                <div class="form-group">
                    <label for="roleDescription">Описание роли</label>
                    <textarea id="roleDescription" name="description" rows="3" placeholder="Описание прав и возможностей роли"></textarea>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isSystemRole" name="is_system_role" value="1">
                        ⚙️ Системная роль (нельзя удалить)
                    </label>
                </div>

                <h4>🔐 Права доступа</h4>
                <div class="permissions-grid">
                    <div class="permission-category">
                        <h5>📖 Управление журналом</h5>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="journal_view"> Просмотр журнала
                        </label>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="journal_edit"> Редактирование журнала
                        </label>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="grades_manage"> Управление оценками
                        </label>
                    </div>

                    <div class="permission-category">
                        <h5>👨‍🎓 Управление учениками</h5>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="students_view"> Просмотр учеников
                        </label>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="students_edit"> Редактирование учеников
                        </label>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="attendance_manage"> Управление посещаемостью
                        </label>
                    </div>

                    <div class="permission-category">
                        <h5>📊 Отчетность</h5>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="reports_view"> Просмотр отчетов
                        </label>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="reports_generate"> Генерация отчетов
                        </label>
                    </div>

                    <div class="permission-category">
                        <h5>⚙️ Администрирование</h5>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="users_manage"> Управление пользователями
                        </label>
                        <label class="permission-item">
                            <input type="checkbox" name="permissions[]" value="settings_manage"> Управление настройками
                        </label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('addRoleModal')">Отмена</button>
                <button type="submit" class="btn-primary">🎭 Добавить роль</button>
            </div>
        </form>
    </div>
</div>