<div id="addPeriodModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>📅 Добавить учебный период</h3>
            <button class="modal-close" onclick="closeModal('addPeriodModal')">×</button>
        </div>
        <form id="periodForm" onsubmit="addPeriod(event)">
            <div class="modal-body">
                <div class="form-group">
                    <label for="periodName">📝 Название периода *</label>
                    <input type="text" id="periodName" name="name" required placeholder="Например: I четверть, Осенний семестр">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="periodStartDate">📅 Дата начала *</label>
                        <input type="date" id="periodStartDate" name="start_date" required>
                    </div>
                    <div class="form-group">
                        <label for="periodEndDate">📅 Дата окончания *</label>
                        <input type="date" id="periodEndDate" name="end_date" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="periodYear">🎓 Учебный год</label>
                    <input type="text" id="periodYear" name="academic_year" placeholder="Например: 2024-2025">
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="isCurrentPeriod" name="is_current" value="1">
                        ⭐ Сделать текущим учебным периодом
                    </label>
                    <small style="display: block; color: #666; margin-top: 5px;">
                        Если отмечено, предыдущий текущий период будет сброшен
                    </small>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal('addPeriodModal')">Отмена</button>
                <button type="submit" class="btn-primary">📅 Добавить период</button>
            </div>
        </form>
    </div>
</div>