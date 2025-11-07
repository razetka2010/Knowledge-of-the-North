<div id="editPeriodModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>📅 Редактировать учебный период</h3>
            <button class="modal-close" onclick="closeModal('editPeriodModal')">×</button>
        </div>
        <form id="editPeriodForm" onsubmit="updatePeriod(event)">
            <input type="hidden" id="edit_period_id" name="id">
            <div class="modal-body">
                <div class="form-group">
                    <label for="edit_periodName">📝 Название периода *</label>
                    <input type="text" id="edit_periodName" name="name" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit_periodStartDate">📅 Дата начала *</label>
                        <input type="date" id="edit_periodStartDate" name="start_date" required>
                    </div>
                    <div class="form-group">
                        <label for="edit_periodEndDate">📅 Дата окончания *</label>
                        <input type="date" id="edit_periodEndDate" name="end_date" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit_periodYear">🎓 Учебный год</label>
                    <input type="text" id="edit_periodYear" name="academic_year">
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="edit_isCurrentPeriod" name="is_current" value="1">
                        ⭐ Сделать текущим учебным периодом
                    </label>
                    <small style="display: block; color: #666; margin-top: 5px;">
                        Если отмечено, предыдущий текущий период будет сброшен
                    </small>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('editPeriodModal')">Отмена</button>
                <button type="submit" class="btn-primary">💾 Сохранить изменения</button>
            </div>
        </form>
    </div>
</div>