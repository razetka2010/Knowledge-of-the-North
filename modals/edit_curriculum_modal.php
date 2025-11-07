<div id="editCurriculumModal" class="modal">
    <div class="modal-content" style="max-width: 800px;">
        <div class="modal-header">
            <h3>📚 Редактировать учебный план</h3>
            <button class="modal-close" onclick="closeModal('editCurriculumModal')">×</button>
        </div>
        <form id="editCurriculumForm" onsubmit="updateCurriculum(event)">
            <input type="hidden" id="edit_curriculum_id" name="id">
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_curriculumSchool">🏫 Школа *</label>
                        <select id="edit_curriculumSchool" name="school_id" required>
                            <option value="">Выберите школу</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit_curriculumName">📝 Название плана *</label>
                        <input type="text" id="edit_curriculumName" name="name" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_curriculumGrade">🎓 Класс/Уровень</label>
                        <input type="text" id="edit_curriculumGrade" name="grade_level">
                    </div>
                    <div class="form-group">
                        <label for="edit_curriculumYear">📅 Учебный год</label>
                        <input type="text" id="edit_curriculumYear" name="academic_year">
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit_curriculumDescription">📋 Описание плана</label>
                    <textarea id="edit_curriculumDescription" name="description" rows="3"></textarea>
                </div>

                <h4>📖 Предметы и часы</h4>
                <div id="edit_subjectsContainer">
                    <!-- Subjects will be loaded dynamically -->
                </div>

                <button type="button" class="btn-secondary" onclick="addEditSubject()" style="margin-top: 10px;">
                    + Добавить предмет
                </button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('editCurriculumModal')">Отмена</button>
                <button type="submit" class="btn-primary">💾 Сохранить изменения</button>
            </div>
        </form>
    </div>
</div>