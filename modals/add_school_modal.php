<div id="addSchoolModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>🏫 Добавить учебное заведение</h3>
            <button class="modal-close" onclick="closeModal('addSchoolModal')">×</button>
        </div>
        <form id="schoolForm" onsubmit="addSchool(event)">
            <div class="modal-body">
                <div class="form-group">
                    <label for="full_name">Полное название школы *</label>
                    <input type="text" id="full_name" name="full_name" required placeholder="Например: Средняя общеобразовательная школа №1">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="short_name">Краткое название</label>
                        <input type="text" id="short_name" name="short_name" placeholder="Например: СОШ №1">
                    </div>
                    <div class="form-group">
                        <label for="inn">ИНН *</label>
                        <input type="text" id="inn" name="inn" required placeholder="10-значный ИНН">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="type">Тип учреждения</label>
                        <select id="type" name="type">
                            <option value="общеобразовательная">Общеобразовательная школа</option>
                            <option value="гимназия">Гимназия</option>
                            <option value="лицей">Лицей</option>
                            <option value="интернат">Интернат</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status">Статус</label>
                        <select id="status" name="status">
                            <option value="активная">Активная</option>
                            <option value="неактивная">Неактивная</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="legal_address">Юридический адрес</label>
                    <textarea id="legal_address" name="legal_address" rows="2" placeholder="Полный юридический адрес"></textarea>
                </div>

                <div class="form-group">
                    <label for="physical_address">Физический адрес</label>
                    <textarea id="physical_address" name="physical_address" rows="2" placeholder="Фактический адрес расположения"></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="phone">Телефон</label>
                        <input type="tel" id="phone" name="phone" placeholder="+7 (XXX) XXX-XX-XX">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="school@example.ru">
                    </div>
                </div>

                <div class="form-group">
                    <label for="website">Сайт</label>
                    <input type="url" id="website" name="website" placeholder="https://school-example.ru">
                </div>

                <div class="form-group">
                    <label for="director_name">ФИО директора</label>
                    <input type="text" id="director_name" name="director_name" placeholder="Иванов Иван Иванович">
                </div>

                <h4>📄 Лицензия</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="license_number">Номер лицензии</label>
                        <input type="text" id="license_number" name="license_number" placeholder="№XXXXX">
                    </div>
                    <div class="form-group">
                        <label for="license_date">Дата выдачи</label>
                        <input type="date" id="license_date" name="license_date">
                    </div>
                </div>

                <div class="form-group">
                    <label for="license_issued_by">Кем выдана</label>
                    <input type="text" id="license_issued_by" name="license_issued_by" placeholder="Департамент образования">
                </div>

                <h4>🏆 Аккредитация</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="accreditation_number">Номер аккредитации</label>
                        <input type="text" id="accreditation_number" name="accreditation_number" placeholder="№XXXXX">
                    </div>
                    <div class="form-group">
                        <label for="accreditation_date">Дата выдачи</label>
                        <input type="date" id="accreditation_date" name="accreditation_date">
                    </div>
                </div>

                <div class="form-group">
                    <label for="accreditation_valid_until">Действует до</label>
                    <input type="date" id="accreditation_valid_until" name="accreditation_valid_until">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('addSchoolModal')">Отмена</button>
                <button type="submit" class="btn-primary">🏫 Добавить школу</button>
            </div>
        </form>
    </div>
</div>