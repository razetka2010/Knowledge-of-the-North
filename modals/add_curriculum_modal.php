<div id="addCurriculumModal" class="modal">
    <div class="modal-content" style="max-width: 800px;">
        <div class="modal-header">
            <h3>📚 Добавить учебный план</h3>
            <button class="modal-close" onclick="closeModal('addCurriculumModal')">×</button>
        </div>
        <form id="curriculumForm" onsubmit="addCurriculum(event)">
            <div class="modal-body">
                <div class="form-row">
                    <div class="form-group">
                        <label for="curriculumSchool">🏫 Школа *</label>
                        <select id="curriculumSchool" name="school_id" required>
                            <option value="">Выберите школу</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="curriculumName">📝 Название плана *</label>
                        <input type="text" id="curriculumName" name="name" required placeholder="Например: Учебный план 5 класс">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="curriculumGrade">🎓 Класс/Уровень</label>
                        <input type="text" id="curriculumGrade" name="grade_level" placeholder="Например: 5 класс, 10-11 классы">
                    </div>
                    <div class="form-group">
                        <label for="curriculumYear">📅 Учебный год</label>
                        <input type="text" id="curriculumYear" name="academic_year" placeholder="Например: 2024-2025">
                    </div>
                </div>

                <div class="form-group">
                    <label for="curriculumDescription">📋 Описание плана</label>
                    <textarea id="curriculumDescription" name="description" rows="3" placeholder="Краткое описание учебного плана"></textarea>
                </div>

                <h4>📖 Предметы и часы</h4>
                <div id="subjectsContainer">
                    <div class="subject-item">
                        <div class="form-row">
                            <div class="form-group" style="flex: 2;">
                                <input type="text" name="subjects[]" placeholder="Название предмета" class="subject-name">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <input type="number" name="hours[]" placeholder="Часов в неделю" min="0" step="0.5" class="subject-hours">
                            </div>
                            <div class="form-group" style="flex: 0; min-width: 50px;">
                                <button type="button" class="btn-danger" onclick="removeSubject(this)" style="padding: 0.5rem;">×</button>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" class="btn-secondary" onclick="addSubject()" style="margin-top: 10px;">
                    + Добавить предмет
                </button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('addCurriculumModal')">Отмена</button>
                <button type="submit" class="btn-primary">📚 Сохранить учебный план</button>
            </div>
        </form>
    </div>
</div>