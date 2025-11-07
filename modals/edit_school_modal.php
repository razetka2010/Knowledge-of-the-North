<div id="editSchoolModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>🏫 Редактировать учебное заведение</h3>
            <button class="modal-close" onclick="closeModal('editSchoolModal')">×</button>
        </div>
        <form id="editSchoolForm" onsubmit="updateSchool(event)">
            <input type="hidden" id="edit_school_id" name="id">
            <div class="modal-body">
                <div class="form-group">
                    <label for="edit_full_name">Полное название школы *</label>
                    <input type="text" id="edit_full_name" name="full_name" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_short_name">Краткое название</label>
                        <input type="text" id="edit_short_name" name="short_name">
                    </div>
                    <div class="form-group">
                        <label for="edit_inn">ИНН *</label>
                        <input type="text" id="edit_inn" name="inn" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_type">Тип учреждения</label>
                        <select id="edit_type" name="type">
                            <option value="общеобразовательная">Общеобразовательная школа</option>
                            <option value="гимназия">Гимназия</option>
                            <option value="лицей">Лицей</option>
                            <option value="интернат">Интернат</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_status">Статус</label>
                        <select id="edit_status" name="status">
                            <option value="активная">Активная</option>
                            <option value="неактивная">Неактивная</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit_legal_address">Юридический адрес</label>
                    <textarea id="edit_legal_address" name="legal_address" rows="2"></textarea>
                </div>

                <div class="form-group">
                    <label for="edit_physical_address">Физический адрес</label>
                    <textarea id="edit_physical_address" name="physical_address" rows="2"></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_phone">Телефон</label>
                        <input type="tel" id="edit_phone" name="phone">
                    </div>
                    <div class="form-group">
                        <label for="edit_email">Email</label>
                        <input type="email" id="edit_email" name="email">
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit_website">Сайт</label>
                    <input type="url" id="edit_website" name="website">
                </div>

                <div class="form-group">
                    <label for="edit_director_name">ФИО директора</label>
                    <input type="text" id="edit_director_name" name="director_name">
                </div>

                <h4>📄 Лицензия</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_license_number">Номер лицензии</label>
                        <input type="text" id="edit_license_number" name="license_number">
                    </div>
                    <div class="form-group">
                        <label for="edit_license_date">Дата выдачи</label>
                        <input type="date" id="edit_license_date" name="license_date">
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit_license_issued_by">Кем выдана</label>
                    <input type="text" id="edit_license_issued_by" name="license_issued_by">
                </div>

                <h4>🏆 Аккредитация</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_accreditation_number">Номер аккредитации</label>
                        <input type="text" id="edit_accreditation_number" name="accreditation_number">
                    </div>
                    <div class="form-group">
                        <label for="edit_accreditation_date">Дата выдачи</label>
                        <input type="date" id="edit_accreditation_date" name="accreditation_date">
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit_accreditation_valid_until">Действует до</label>
                    <input type="date" id="edit_accreditation_valid_until" name="accreditation_valid_until">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('editSchoolModal')">Отмена</button>
                <button type="submit" class="btn-primary">💾 Сохранить изменения</button>
            </div>
        </form>
    </div>
</div>