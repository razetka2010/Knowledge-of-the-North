// Основные функции админ-панели
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});

// Инициализация админ-панели
function initializeAdminDashboard() {
    loadSchools();
    loadUsers();
    loadRoles();
    loadCurriculum();
    loadAcademicPeriods();
    loadReports();
    loadSettings();
    initNavigation();
    initEventListeners();
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Закрытие модальных окон при нажатии Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });

    // Автозаполнение дат для учебных периодов
    const periodYear = document.getElementById('periodYear');
    if (periodYear) {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        periodYear.value = currentYear + '-' + nextYear;
    }
}

// Навигация между разделами
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Убираем активный класс у всех ссылок и секций
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Добавляем активный класс текущей ссылке и секции
            this.classList.add('active');
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.animation = 'fadeIn 0.5s ease-in-out';
            }

            // Загружаем данные для выбранного раздела
            const sectionId = this.getAttribute('href').substring(1);
            loadSectionData(sectionId);
        });
    });
}

// Загрузка данных для раздела
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'schools':
            loadSchools();
            break;
        case 'users':
            loadUsers();
            break;
        case 'curriculum':
            loadCurriculum();
            break;
        case 'roles':
            loadRoles();
            break;
        case 'periods':
            loadAcademicPeriods();
            break;
        case 'reports':
            loadReports();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ==================== РЕДАКТИРОВАНИЕ РОЛЕЙ ====================

function editRole(roleId) {
    showLoadingModal('Загрузка данных роли...');

    fetch(`api/get_role.php?id=${roleId}`)
        .then(response => response.json())
        .then(role => {
            if (role.error) {
                throw new Error(role.error);
            }

            // Заполняем форму данными
            document.getElementById('edit_role_id').value = role.id;
            document.getElementById('edit_roleName').value = role.name || '';
            document.getElementById('edit_roleDescription').value = role.description || '';

            // Устанавливаем permissions
            const permissions = role.permissions || [];
            document.querySelectorAll('#editRoleForm input[name="permissions[]"]').forEach(checkbox => {
                checkbox.checked = permissions.includes(checkbox.value);
            });

            closeLoadingModal();
            document.getElementById('editRoleModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading role:', error);
            closeLoadingModal();
            showNotification('❌ Ошибка загрузки данных роли: ' + error.message, 'error');
        });
}

function updateRole(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Сохранение...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('editRoleForm'));

    // Собираем permissions в JSON
    const permissions = [];
    document.querySelectorAll('#editRoleForm input[name="permissions[]"]:checked').forEach(checkbox => {
        permissions.push(checkbox.value);
    });
    formData.append('permissions_json', JSON.stringify(permissions));

    fetch('api/edit_role.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Роль успешно обновлена', 'success');
                closeModal('editRoleModal');
                loadRoles();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error updating role:', error);
            showNotification('❌ Ошибка обновления роли', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

function deleteRole(roleId) {
    if (confirm('❓ Вы уверены, что хотите удалить эту роль? Это действие нельзя отменить.')) {
        showNotification('⏳ Удаление роли...', 'info');

        fetch(`api/delete_role.php?id=${roleId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('🎉 Роль успешно удалена', 'success');
                    loadRoles();
                } else {
                    showNotification('❌ Ошибка: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting role:', error);
                showNotification('❌ Ошибка удаления роли', 'error');
            });
    }
}

// ==================== РЕДАКТИРОВАНИЕ УЧЕБНЫХ ПЛАНОВ ====================

function editCurriculum(curriculumId) {
    showLoadingModal('Загрузка данных учебного плана...');

    fetch(`api/get_curriculum_single.php?id=${curriculumId}`)
        .then(response => response.json())
        .then(curriculum => {
            if (curriculum.error) {
                throw new Error(curriculum.error);
            }

            // Заполняем форму данными
            document.getElementById('edit_curriculum_id').value = curriculum.id;
            document.getElementById('edit_curriculumName').value = curriculum.name || '';
            document.getElementById('edit_curriculumGrade').value = curriculum.grade_level || '';
            document.getElementById('edit_curriculumYear').value = curriculum.academic_year || '';
            document.getElementById('edit_curriculumDescription').value = curriculum.description || '';

            // Загружаем школы для выпадающего списка
            loadSchoolsForCurriculumEdit().then(() => {
                document.getElementById('edit_curriculumSchool').value = curriculum.school_id || '';

                // Загружаем предметы
                loadEditSubjects(curriculum.subjects, curriculum.hours_per_week);

                closeLoadingModal();
                document.getElementById('editCurriculumModal').style.display = 'block';
            });
        })
        .catch(error => {
            console.error('Error loading curriculum:', error);
            closeLoadingModal();
            showNotification('❌ Ошибка загрузки данных учебного плана: ' + error.message, 'error');
        });
}

function loadEditSubjects(subjects, hours) {
    const container = document.getElementById('edit_subjectsContainer');
    container.innerHTML = '';

    editSubjectCount = 0;

    if (subjects && subjects.length > 0) {
        subjects.forEach((subject, index) => {
            addEditSubject(subject, hours[index] || 0);
        });
    } else {
        addEditSubject();
    }
}

let editSubjectCount = 0;

function addEditSubject(subjectName = '', hours = 0) {
    editSubjectCount++;
    const container = document.getElementById('edit_subjectsContainer');
    const subjectItem = document.createElement('div');
    subjectItem.className = 'subject-item';
    subjectItem.innerHTML = `
        <div class="form-row">
            <div class="form-group" style="flex: 2;">
                <input type="text" name="subjects[]" placeholder="Название предмета" 
                       class="subject-name" value="${escapeHtml(subjectName)}">
            </div>
            <div class="form-group" style="flex: 1;">
                <input type="number" name="hours[]" placeholder="Часов в неделю" 
                       min="0" step="0.5" class="subject-hours" value="${hours}">
            </div>
            <div class="form-group" style="flex: 0; min-width: 50px;">
                <button type="button" class="btn-danger" onclick="removeEditSubject(this)" style="padding: 0.5rem;">×</button>
            </div>
        </div>
    `;
    container.appendChild(subjectItem);
}

function removeEditSubject(button) {
    if (editSubjectCount > 1) {
        button.closest('.subject-item').remove();
        editSubjectCount--;
    }
}

function updateCurriculum(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Сохранение...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('editCurriculumForm'));

    // Собираем предметы и часы
    const subjects = [];
    const hours = [];

    document.querySelectorAll('#editCurriculumForm .subject-name').forEach((input, index) => {
        if (input.value.trim()) {
            subjects.push(input.value.trim());
            const hourInput = document.querySelectorAll('#editCurriculumForm .subject-hours')[index];
            const hourValue = parseFloat(hourInput.value);
            hours.push(isNaN(hourValue) ? 0 : hourValue);
        }
    });

    // Проверяем что есть хотя бы один предмет
    if (subjects.length === 0) {
        showNotification('❌ Добавьте хотя бы один предмет', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    formData.append('subjects_json', JSON.stringify(subjects));
    formData.append('hours_json', JSON.stringify(hours));

    fetch('api/edit_curriculum.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Учебный план успешно обновлен', 'success');
                closeModal('editCurriculumModal');
                loadCurriculum();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error updating curriculum:', error);
            showNotification('❌ Ошибка обновления учебного плана', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

function deleteCurriculum(curriculumId) {
    if (confirm('❓ Вы уверены, что хотите удалить этот учебный план? Это действие нельзя отменить.')) {
        showNotification('⏳ Удаление учебного плана...', 'info');

        fetch(`api/delete_curriculum.php?id=${curriculumId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('🎉 Учебный план успешно удален', 'success');
                    loadCurriculum();
                } else {
                    showNotification('❌ Ошибка: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting curriculum:', error);
                showNotification('❌ Ошибка удаления учебного плана', 'error');
            });
    }
}

// ==================== РЕДАКТИРОВАНИЕ УЧЕБНЫХ ПЕРИОДОВ ====================

function editPeriod(periodId) {
    showLoadingModal('Загрузка данных учебного периода...');

    fetch(`api/get_period.php?id=${periodId}`)
        .then(response => response.json())
        .then(period => {
            if (period.error) {
                throw new Error(period.error);
            }

            // Заполняем форму данными
            document.getElementById('edit_period_id').value = period.id;
            document.getElementById('edit_periodName').value = period.name || '';
            document.getElementById('edit_periodStartDate').value = period.start_date || '';
            document.getElementById('edit_periodEndDate').value = period.end_date || '';
            document.getElementById('edit_periodYear').value = period.academic_year || '';
            document.getElementById('edit_isCurrentPeriod').checked = period.is_current == 1;

            closeLoadingModal();
            document.getElementById('editPeriodModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading period:', error);
            closeLoadingModal();
            showNotification('❌ Ошибка загрузки данных периода: ' + error.message, 'error');
        });
}

function updatePeriod(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Сохранение...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('editPeriodForm'));

    // Проверяем даты
    const startDate = new Date(document.getElementById('edit_periodStartDate').value);
    const endDate = new Date(document.getElementById('edit_periodEndDate').value);

    if (startDate >= endDate) {
        showNotification('❌ Дата начала должна быть раньше даты окончания', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    fetch('api/edit_period.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Учебный период успешно обновлен', 'success');
                closeModal('editPeriodModal');
                loadAcademicPeriods();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error updating period:', error);
            showNotification('❌ Ошибка обновления учебного периода', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

function deletePeriod(periodId) {
    if (confirm('❓ Вы уверены, что хотите удалить этот учебный период? Это действие нельзя отменить.')) {
        showNotification('⏳ Удаление учебного периода...', 'info');

        fetch(`api/delete_period.php?id=${periodId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('🎉 Учебный период успешно удален', 'success');
                    loadAcademicPeriods();
                } else {
                    showNotification('❌ Ошибка: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting period:', error);
                showNotification('❌ Ошибка удаления учебного периода', 'error');
            });
    }
}

function setCurrentPeriod(periodId) {
    if (confirm('⭐ Сделать этот период текущим? Все остальные периоды будут сброшены.')) {
        showNotification('⏳ Установка текущего периода...', 'info');

        fetch(`api/set_current_period.php?id=${periodId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('🎉 Учебный период установлен как текущий', 'success');
                    loadAcademicPeriods();
                } else {
                    showNotification('❌ Ошибка: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error setting current period:', error);
                showNotification('❌ Ошибка установки текущего периода', 'error');
            });
    }
}

// ==================== СБРОС НАСТРОЕК ====================

function resetSettings() {
    if (confirm('🔄 Сбросить все настройки к значениям по умолчанию? Все текущие настройки будут потеряны.')) {
        showNotification('⏳ Сброс настроек...', 'info');

        fetch('api/reset_settings.php', {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('🎉 Настройки успешно сброшены к значениям по умолчанию', 'success');
                    loadSettings();
                } else {
                    showNotification('❌ Ошибка: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error resetting settings:', error);
                showNotification('❌ Ошибка сброса настроек', 'error');
            });
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function loadSchoolsForCurriculumEdit() {
    return fetch('api/get_schools.php')
        .then(response => response.json())
        .then(schools => {
            const select = document.getElementById('edit_curriculumSchool');
            if (select) {
                select.innerHTML = '<option value="">Выберите школу</option>';
                schools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school.id;
                    option.textContent = school.full_name;
                    select.appendChild(option);
                });
            }
        });
}

// ==================== ШКОЛЫ ====================

// Загрузка списка школ
function loadSchools() {
    showLoading('schoolsList', 'Загрузка школ...');

    fetch('api/get_schools.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            const schoolsList = document.getElementById('schoolsList');
            schoolsList.innerHTML = '';

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.length === 0) {
                schoolsList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🏫</div>
                        <h3>Нет учебных заведений</h3>
                        <p>Добавьте первую школу, чтобы начать работу</p>
                        <button class="btn-primary" onclick="openAddSchoolModal()">Добавить школу</button>
                    </div>
                `;
                return;
            }

            data.forEach(school => {
                const schoolCard = createSchoolCard(school);
                schoolsList.appendChild(schoolCard);
            });
        })
        .catch(error => {
            console.error('Error loading schools:', error);
            showNotification('Ошибка загрузки школ: ' + error.message, 'error');
            document.getElementById('schoolsList').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Ошибка загрузки</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="loadSchools()">Повторить попытку</button>
                </div>
            `;
        });
}

// Создание карточки школы
function createSchoolCard(school) {
    const card = document.createElement('div');
    card.className = 'school-card';
    card.innerHTML = `
        <div class="card-header">
            <h3>${escapeHtml(school.full_name)}</h3>
            <span class="status-badge status-${school.status}">${school.status}</span>
        </div>
        <div class="card-body">
            <p><strong>ИНН:</strong> ${escapeHtml(school.inn || 'Не указан')}</p>
            <p><strong>Тип:</strong> ${escapeHtml(school.type || 'Не указан')}</p>
            <p><strong>Директор:</strong> ${escapeHtml(school.director_name || 'Не указан')}</p>
            <p><strong>Телефон:</strong> ${escapeHtml(school.phone || 'Не указан')}</p>
            <p><strong>Email:</strong> ${escapeHtml(school.email || 'Не указан')}</p>
        </div>
        <div class="card-footer">
            <button class="btn-secondary" onclick="editSchool(${school.id})">✏️ Редактировать</button>
            <button class="btn-danger" onclick="deleteSchool(${school.id})">🗑️ Удалить</button>
            <button class="btn-primary" onclick="addAdminToSchool(${school.id})">👨‍💼 Добавить администратора</button>
        </div>
    `;
    return card;
}

// ==================== ПОЛЬЗОВАТЕЛИ ====================

// Загрузка списка пользователей
function loadUsers() {
    showLoading('usersList', 'Загрузка пользователей...');

    fetch('api/get_users.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.length === 0) {
                usersList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">👥</div>
                        <h3>Нет пользователей</h3>
                        <p>Добавьте первого пользователя в систему</p>
                        <button class="btn-primary" onclick="openAddUserModal()">Добавить пользователя</button>
                    </div>
                `;
                return;
            }

            const table = document.createElement('table');
            table.className = 'users-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>ФИО</th>
                        <th>Логин</th>
                        <th>Роль</th>
                        <th>Школа</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(user => `
                        <tr>
                            <td>${escapeHtml(user.full_name)}</td>
                            <td>${escapeHtml(user.login)}</td>
                            <td>${escapeHtml(user.role_name || 'Не назначена')}</td>
                            <td>${escapeHtml(user.school_name || 'Не назначена')}</td>
                            <td><span class="status-badge status-${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Активен' : 'Неактивен'}</span></td>
                            <td class="actions">
                                <button class="btn-secondary" onclick="editUser(${user.id})">✏️ Редакт.</button>
                                <button class="btn-warning" onclick="resetPassword(${user.id})">🔐 Сброс</button>
                                <button class="btn-danger" onclick="deleteUser(${user.id})">🗑️ Удалить</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            usersList.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading users:', error);
            showNotification('Ошибка загрузки пользователей: ' + error.message, 'error');
            document.getElementById('usersList').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Ошибка загрузки</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="loadUsers()">Повторить попытку</button>
                </div>
            `;
        });
}

// ==================== РОЛИ ====================

// Загрузка списка ролей
function loadRoles() {
    const rolesList = document.getElementById('rolesList');
    if (!rolesList) return;

    showLoading('rolesList', 'Загрузка ролей...');

    fetch('api/get_roles.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            rolesList.innerHTML = '';

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.length === 0) {
                rolesList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🎭</div>
                        <h3>Нет ролей</h3>
                        <p>Создайте первую роль для системы</p>
                        <button class="btn-primary" onclick="openAddRoleModal()">Добавить роль</button>
                    </div>
                `;
                return;
            }

            const table = document.createElement('table');
            table.className = 'users-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Тип</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(role => `
                        <tr>
                            <td>${escapeHtml(role.name)}</td>
                            <td>${escapeHtml(role.description || 'Нет описания')}</td>
                            <td><span class="status-badge ${role.is_system_role ? 'status-активная' : 'status-архив'}">${role.is_system_role ? 'Системная' : 'Пользовательская'}</span></td>
                            <td class="actions">
                                <button class="btn-secondary" onclick="editRole(${role.id})">✏️ Редакт.</button>
                                ${!role.is_system_role ? `<button class="btn-danger" onclick="deleteRole(${role.id})">🗑️ Удалить</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            rolesList.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading roles:', error);
            showNotification('Ошибка загрузки ролей: ' + error.message, 'error');
            rolesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Ошибка загрузки</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="loadRoles()">Повторить попытку</button>
                </div>
            `;
        });
}

// ==================== УЧЕБНЫЕ ПЛАНЫ ====================

function loadCurriculum() {
    const curriculumList = document.getElementById('curriculumList');
    if (!curriculumList) return;

    showLoading('curriculumList', 'Загрузка учебных планов...');

    fetch('api/get_curriculum.php')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            return response.json();
        })
        .then(data => {
            curriculumList.innerHTML = '';

            if (data.error) throw new Error(data.error);

            if (data.length === 0) {
                curriculumList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📚</div>
                        <h3>Нет учебных планов</h3>
                        <p>Создайте первый учебный план для школы</p>
                        <button class="btn-primary" onclick="openAddCurriculumModal()">Добавить учебный план</button>
                    </div>
                `;
                return;
            }

            data.forEach(plan => {
                const planCard = createCurriculumCard(plan);
                curriculumList.appendChild(planCard);
            });
        })
        .catch(error => {
            console.error('Error loading curriculum:', error);
            curriculumList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Ошибка загрузки</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="loadCurriculum()">Повторить попытку</button>
                </div>
            `;
        });
}

function createCurriculumCard(plan) {
    // Проверяем что subjects и hours_per_week являются массивами
    const subjects = Array.isArray(plan.subjects) ? plan.subjects : [];
    const hours = Array.isArray(plan.hours_per_week) ? plan.hours_per_week : [];

    const subjectsList = subjects.length > 0
        ? subjects.map((subject, index) =>
            `<li>${escapeHtml(subject)} - ${hours[index] || 0} ч/нед</li>`
        ).join('')
        : '<li>Нет предметов</li>';

    const card = document.createElement('div');
    card.className = 'school-card';
    card.innerHTML = `
        <div class="card-header">
            <h3>${escapeHtml(plan.name)}</h3>
            <span class="status-badge status-активная">${escapeHtml(plan.grade_level || 'Все классы')}</span>
        </div>
        <div class="card-body">
            <p><strong>Школа:</strong> ${escapeHtml(plan.school_name || 'Не указана')}</p>
            <p><strong>Учебный год:</strong> ${escapeHtml(plan.academic_year || 'Не указан')}</p>
            <p><strong>Описание:</strong> ${escapeHtml(plan.description || 'Нет описания')}</p>
            <div class="subjects-list">
                <strong>Предметы:</strong>
                <ul>${subjectsList}</ul>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn-secondary" onclick="editCurriculum(${plan.id})">✏️ Редактировать</button>
            <button class="btn-danger" onclick="deleteCurriculum(${plan.id})">🗑️ Удалить</button>
        </div>
    `;
    return card;
}

// ==================== УЧЕБНЫЕ ПЕРИОДЫ ====================

function loadAcademicPeriods() {
    const periodsList = document.getElementById('periodsList');
    if (!periodsList) return;

    showLoading('periodsList', 'Загрузка учебных периодов...');

    fetch('api/get_periods.php')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            return response.json();
        })
        .then(data => {
            periodsList.innerHTML = '';

            if (data.error) throw new Error(data.error);

            if (data.length === 0) {
                periodsList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📅</div>
                        <h3>Нет учебных периодов</h3>
                        <p>Создайте первый учебный период</p>
                        <button class="btn-primary" onclick="openAddPeriodModal()">Добавить период</button>
                    </div>
                `;
                return;
            }

            const table = document.createElement('table');
            table.className = 'users-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Дата начала</th>
                        <th>Дата окончания</th>
                        <th>Учебный год</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(period => `
                        <tr>
                            <td>${escapeHtml(period.name)}</td>
                            <td>${formatDate(period.start_date)}</td>
                            <td>${formatDate(period.end_date)}</td>
                            <td>${escapeHtml(period.academic_year || 'Не указан')}</td>
                            <td>
                                <span class="status-badge ${period.is_current ? 'status-активная' : 'status-архив'}">
                                    ${period.is_current ? 'Текущий' : 'Архивный'}
                                </span>
                            </td>
                            <td class="actions">
                                <button class="btn-secondary" onclick="editPeriod(${period.id})">✏️ Редакт.</button>
                                <button class="btn-danger" onclick="deletePeriod(${period.id})">🗑️ Удалить</button>
                                ${!period.is_current ? `<button class="btn-primary" onclick="setCurrentPeriod(${period.id})">⭐ Сделать текущим</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            periodsList.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading periods:', error);
            periodsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Ошибка загрузки</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="loadAcademicPeriods()">Повторить попытку</button>
                </div>
            `;
        });
}

// ==================== ОТЧЕТЫ ====================

function loadReports() {
    const reportsContent = document.getElementById('reportsContent');
    if (!reportsContent) return;

    showLoading('reportsContent', 'Формирование отчетов...');

    fetch('api/get_reports.php')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            return response.json();
        })
        .then(data => {
            if (data.error) throw new Error(data.error);

            const report = data.data;
            reportsContent.innerHTML = `
                <div class="reports-grid">
                    <div class="school-card">
                        <div class="card-header">
                            <h3>🏫 Статистика школ</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Всего школ:</strong> ${report.schools.total}</p>
                            <p><strong>Активных школ:</strong> ${report.schools.active}</p>
                            <p><strong>Неактивных школ:</strong> ${report.schools.inactive}</p>
                        </div>
                    </div>
                    
                    <div class="school-card">
                        <div class="card-header">
                            <h3>👥 Статистика пользователей</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Всего пользователей:</strong> ${report.users.total}</p>
                            <p><strong>Активных пользователей:</strong> ${report.users.active}</p>
                            <p><strong>Уникальных ролей:</strong> ${report.users.roles_count}</p>
                        </div>
                    </div>
                    
                    <div class="school-card">
                        <div class="card-header">
                            <h3>🎭 Распределение по ролям</h3>
                        </div>
                        <div class="card-body">
                            ${report.roles.map(role =>
                `<p><strong>${escapeHtml(role.name)}:</strong> ${role.user_count} пользователей</p>`
            ).join('')}
                        </div>
                    </div>
                    
                    <div class="school-card">
                        <div class="card-header">
                            <h3>📈 Активность системы</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Входов за 30 дней:</strong> ${report.activity.recent_logins}</p>
                            <p><strong>Отчет сформирован:</strong> ${formatDateTime(report.generated_at)}</p>
                        </div>
                    </div>
                </div>
                
                <div class="section-header" style="margin-top: 2rem;">
                    <h3>Экспорт отчетов</h3>
                </div>
                <div class="card-footer">
                    <button class="btn-primary" onclick="exportReport('pdf')">📄 Экспорт в PDF</button>
                    <button class="btn-primary" onclick="exportReport('excel')">📊 Экспорт в Excel</button>
                    <button class="btn-secondary" onclick="loadReports()">🔄 Обновить отчет</button>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error loading reports:', error);
            reportsContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Ошибка загрузки отчетов</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="loadReports()">Повторить попытку</button>
                </div>
            `;
        });
}

// ==================== НАСТРОЙКИ ====================

function loadSettings() {
    const settingsContent = document.getElementById('settingsContent');
    if (!settingsContent) return;

    showLoading('settingsContent', 'Загрузка настроек...');

    fetch('api/get_settings.php')
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            return response.json();
        })
        .then(settings => {
            if (settings.error) throw new Error(settings.error);

            settingsContent.innerHTML = `
                <div class="school-card">
                    <div class="card-header">
                        <h3>⚙️ Системные настройки</h3>
                    </div>
                    <div class="card-body">
                        <form id="settingsForm">
                            ${settings.map(setting => `
                                <div class="form-group">
                                    <label for="setting_${setting.setting_key}">
                                        ${escapeHtml(setting.description || setting.setting_key)}
                                    </label>
                                    <input type="text" 
                                           id="setting_${setting.setting_key}" 
                                           name="${setting.setting_key}" 
                                           value="${escapeHtml(setting.setting_value || '')}"
                                           class="setting-input">
                                </div>
                            `).join('')}
                        </form>
                    </div>
                    <div class="card-footer">
                        <button class="btn-primary" onclick="saveSettings()">💾 Сохранить настройки</button>
                        <button class="btn-secondary" onclick="resetSettings()">🔄 Сбросить к默认ным</button>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error loading settings:', error);
            settingsContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <h3>Ошибка загрузки настроек</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="loadSettings()">Повторить попытку</button>
                </div>
            `;
        });
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================

// Открытие модальных окон
function openAddSchoolModal() {
    document.getElementById('addSchoolModal').style.display = 'block';
}

function openAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
    loadSchoolsForSelect();
    loadRolesForSelect();
}

function openAddRoleModal() {
    document.getElementById('addRoleModal').style.display = 'block';
}

function openAddCurriculumModal() {
    document.getElementById('addCurriculumModal').style.display = 'block';
    loadSchoolsForCurriculum();
}

function openAddPeriodModal() {
    document.getElementById('addPeriodModal').style.display = 'block';
    setDefaultPeriodDates();
}

// Закрытие модальных окон
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.animation = 'modalSlideOut 0.3s ease';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.animation = '';
        }, 300);
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Загрузка школ для выпадающих списков
function loadSchoolsForSelect() {
    fetch('api/get_schools.php')
        .then(response => response.json())
        .then(schools => {
            const select = document.getElementById('userSchool');
            if (select) {
                select.innerHTML = '<option value="">Выберите школу</option>';
                schools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school.id;
                    option.textContent = school.full_name;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading schools for select:', error);
        });
}

function loadSchoolsForCurriculum() {
    fetch('api/get_schools.php')
        .then(response => response.json())
        .then(schools => {
            const select = document.getElementById('curriculumSchool');
            if (select) {
                select.innerHTML = '<option value="">Выберите школу</option>';
                schools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school.id;
                    option.textContent = school.full_name;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading schools for curriculum:', error);
        });
}

// Загрузка ролей для выпадающего списка
function loadRolesForSelect() {
    fetch('api/get_roles.php')
        .then(response => response.json())
        .then(roles => {
            const select = document.getElementById('userRole');
            if (select) {
                select.innerHTML = '<option value="">Выберите роль</option>';
                roles.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.id;
                    option.textContent = role.name;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading roles for select:', error);
        });
}

// Установка дат по умолчанию для учебных периодов
function setDefaultPeriodDates() {
    const currentYear = new Date().getFullYear();
    const september1 = new Date(currentYear, 8, 1); // 1 сентября
    const may31 = new Date(currentYear + 1, 4, 31); // 31 мая следующего года

    const startDate = document.getElementById('periodStartDate');
    const endDate = document.getElementById('periodEndDate');
    const year = document.getElementById('periodYear');

    if (startDate) startDate.value = september1.toISOString().split('T')[0];
    if (endDate) endDate.value = may31.toISOString().split('T')[0];
    if (year) year.value = currentYear + '-' + (currentYear + 1);
}

// ==================== ОСНОВНЫЕ ОПЕРАЦИИ ====================

// Добавление школы
function addSchool(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Добавление...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('schoolForm'));

    fetch('api/add_school.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Школа успешно добавлена', 'success');
                closeModal('addSchoolModal');
                loadSchools();
                document.getElementById('schoolForm').reset();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error adding school:', error);
            showNotification('❌ Ошибка добавления школы', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// Добавление пользователя
function addUser(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Добавление...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('userForm'));

    fetch('api/add_user.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Пользователь успешно добавлен', 'success');
                closeModal('addUserModal');
                loadUsers();
                document.getElementById('userForm').reset();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error adding user:', error);
            showNotification('❌ Ошибка добавления пользователя', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// Добавление учебного плана
function addCurriculum(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Создание...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('curriculumForm'));

    // Собираем предметы и часы
    const subjects = [];
    const hours = [];

    document.querySelectorAll('.subject-name').forEach((input, index) => {
        if (input.value.trim()) {
            subjects.push(input.value.trim());
            const hourInput = document.querySelectorAll('.subject-hours')[index];
            const hourValue = parseFloat(hourInput.value);
            hours.push(isNaN(hourValue) ? 0 : hourValue);
        }
    });

    // Проверяем что есть хотя бы один предмет
    if (subjects.length === 0) {
        showNotification('❌ Добавьте хотя бы один предмет', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    formData.append('subjects_json', JSON.stringify(subjects));
    formData.append('hours_json', JSON.stringify(hours));

    fetch('api/add_curriculum.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Учебный план успешно создан', 'success');
                closeModal('addCurriculumModal');
                loadCurriculum();
                document.getElementById('curriculumForm').reset();
                // Сбрасываем предметы до одного
                const container = document.getElementById('subjectsContainer');
                container.innerHTML = container.children[0].outerHTML;
                subjectCount = 1;
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error adding curriculum:', error);
            showNotification('❌ Ошибка создания учебного плана', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// Добавление учебного периода
function addPeriod(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Создание...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('periodForm'));

    // Проверяем даты
    const startDate = new Date(document.getElementById('periodStartDate').value);
    const endDate = new Date(document.getElementById('periodEndDate').value);

    if (startDate >= endDate) {
        showNotification('❌ Дата начала должна быть раньше даты окончания', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    fetch('api/add_period.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Учебный период успешно создан', 'success');
                closeModal('addPeriodModal');
                loadAcademicPeriods();
                document.getElementById('periodForm').reset();
                setDefaultPeriodDates();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error adding period:', error);
            showNotification('❌ Ошибка создания учебного периода', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// Добавление роли
function addRole(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Создание...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('roleForm'));

    // Собираем permissions в JSON
    const permissions = [];
    document.querySelectorAll('input[name="permissions[]"]:checked').forEach(checkbox => {
        permissions.push(checkbox.value);
    });
    formData.append('permissions_json', JSON.stringify(permissions));

    fetch('api/add_role.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Роль успешно создана', 'success');
                closeModal('addRoleModal');
                loadRoles();
                document.getElementById('roleForm').reset();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error adding role:', error);
            showNotification('❌ Ошибка создания роли', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// Сохранение настроек
function saveSettings() {
    const form = document.getElementById('settingsForm');
    const formData = new FormData(form);
    const saveBtn = document.querySelector('#settingsContent .btn-primary');
    const originalText = saveBtn.innerHTML;

    saveBtn.innerHTML = '⏳ Сохранение...';
    saveBtn.disabled = true;

    const promises = [];
    for (let [key, value] of formData.entries()) {
        const settingData = new FormData();
        settingData.append('setting_key', key);
        settingData.append('setting_value', value);

        promises.push(
            fetch('api/update_setting.php', {
                method: 'POST',
                body: settingData
            }).then(response => response.json())
        );
    }

    Promise.all(promises)
        .then(results => {
            const hasErrors = results.some(result => !result.success);
            if (hasErrors) {
                showNotification('❌ Некоторые настройки не удалось сохранить', 'error');
            } else {
                showNotification('🎉 Настройки успешно сохранены', 'success');
            }
        })
        .catch(error => {
            console.error('Error saving settings:', error);
            showNotification('❌ Ошибка сохранения настроек', 'error');
        })
        .finally(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        });
}

// Удаление школы
function deleteSchool(schoolId) {
    if (confirm('❓ Вы уверены, что хотите удалить эту школу? Это действие нельзя отменить.')) {
        showNotification('⏳ Удаление школы...', 'info');

        fetch(`api/delete_school.php?id=${schoolId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('🎉 Школа успешно удалена', 'success');
                    loadSchools();
                } else {
                    showNotification('❌ Ошибка: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting school:', error);
                showNotification('❌ Ошибка удаления школы', 'error');
            });
    }
}

// Удаление пользователя
function deleteUser(userId) {
    if (confirm('❓ Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.')) {
        showNotification('⏳ Удаление пользователя...', 'info');

        fetch(`api/delete_user.php?id=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('🎉 Пользователь успешно удален', 'success');
                    loadUsers();
                } else {
                    showNotification('❌ Ошибка: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                showNotification('❌ Ошибка удаления пользователя', 'error');
            });
    }
}

// Сброс пароля
function resetPassword(userId) {
    if (confirm('🔐 Сбросить пароль пользователя? Будет сгенерирован новый временный пароль и отправлен на email.')) {
        showNotification('⏳ Сброс пароля...', 'info');

        fetch(`api/reset_password.php?id=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('🎉 Пароль успешно сброшен. Новый пароль отправлен на email пользователя.', 'success');
                } else {
                    showNotification('❌ Ошибка: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error resetting password:', error);
                showNotification('❌ Ошибка сброса пароля', 'error');
            });
    }
}

// ==================== РЕДАКТИРОВАНИЕ ШКОЛ ====================

function editSchool(schoolId) {
    showLoadingModal('Загрузка данных школы...');

    fetch(`api/get_school.php?id=${schoolId}`)
        .then(response => response.json())
        .then(school => {
            if (school.error) {
                throw new Error(school.error);
            }

            // Заполняем форму данными
            document.getElementById('edit_school_id').value = school.id;
            document.getElementById('edit_full_name').value = school.full_name || '';
            document.getElementById('edit_short_name').value = school.short_name || '';
            document.getElementById('edit_inn').value = school.inn || '';
            document.getElementById('edit_type').value = school.type || 'общеобразовательная';
            document.getElementById('edit_status').value = school.status || 'активная';
            document.getElementById('edit_legal_address').value = school.legal_address || '';
            document.getElementById('edit_physical_address').value = school.physical_address || '';
            document.getElementById('edit_phone').value = school.phone || '';
            document.getElementById('edit_email').value = school.email || '';
            document.getElementById('edit_website').value = school.website || '';
            document.getElementById('edit_director_name').value = school.director_name || '';
            document.getElementById('edit_license_number').value = school.license_number || '';
            document.getElementById('edit_license_date').value = school.license_date || '';
            document.getElementById('edit_license_issued_by').value = school.license_issued_by || '';
            document.getElementById('edit_accreditation_number').value = school.accreditation_number || '';
            document.getElementById('edit_accreditation_date').value = school.accreditation_date || '';
            document.getElementById('edit_accreditation_valid_until').value = school.accreditation_valid_until || '';

            closeLoadingModal();
            document.getElementById('editSchoolModal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading school:', error);
            closeLoadingModal();
            showNotification('❌ Ошибка загрузки данных школы: ' + error.message, 'error');
        });
}

function updateSchool(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Сохранение...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('editSchoolForm'));

    fetch('api/edit_school.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Школа успешно обновлена', 'success');
                closeModal('editSchoolModal');
                loadSchools();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error updating school:', error);
            showNotification('❌ Ошибка обновления школы', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// ==================== РЕДАКТИРОВАНИЕ ПОЛЬЗОВАТЕЛЕЙ ====================

function editUser(userId) {
    showLoadingModal('Загрузка данных пользователя...');

    fetch(`api/get_user.php?id=${userId}`)
        .then(response => response.json())
        .then(user => {
            if (user.error) {
                throw new Error(user.error);
            }

            // Заполняем форму данными
            document.getElementById('edit_user_id').value = user.id;
            document.getElementById('edit_userFullName').value = user.full_name || '';
            document.getElementById('edit_userPosition').value = user.position || '';
            document.getElementById('edit_userEmail').value = user.email || '';
            document.getElementById('edit_userPhone').value = user.phone || '';
            document.getElementById('edit_userLogin').value = user.login || '';
            document.getElementById('edit_userActive').checked = user.is_active == 1;

            // Загружаем школы и роли для выпадающих списков
            Promise.all([
                loadSchoolsForEditSelect(),
                loadRolesForEditSelect()
            ]).then(() => {
                document.getElementById('edit_userSchool').value = user.school_id || '';
                document.getElementById('edit_userRole').value = user.role_id || '';

                closeLoadingModal();
                document.getElementById('editUserModal').style.display = 'block';
            });
        })
        .catch(error => {
            console.error('Error loading user:', error);
            closeLoadingModal();
            showNotification('❌ Ошибка загрузки данных пользователя: ' + error.message, 'error');
        });
}

function updateUser(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '⏳ Сохранение...';
    submitBtn.disabled = true;

    const formData = new FormData(document.getElementById('editUserForm'));

    fetch('api/edit_user.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('🎉 Пользователь успешно обновлен', 'success');
                closeModal('editUserModal');
                loadUsers();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            showNotification('❌ Ошибка обновления пользователя', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// ==================== ДОБАВЛЕНИЕ АДМИНИСТРАТОРА К ШКОЛЕ ====================

function addAdminToSchool(schoolId) {
    showLoadingModal('Загрузка данных школы...');

    fetch(`api/get_school.php?id=${schoolId}`)
        .then(response => response.json())
        .then(school => {
            if (school.error) {
                throw new Error(school.error);
            }

            // Устанавливаем выбранную школу в форме добавления пользователя
            Promise.all([
                loadSchoolsForSelect(),
                loadRolesForSelect()
            ]).then(() => {
                document.getElementById('userSchool').value = schoolId;

                // Автозаполняем email на основе названия школы
                const email = generateSchoolEmail(school.full_name);
                document.getElementById('userEmail').value = email;
                document.getElementById('userLogin').value = email.split('@')[0];

                closeLoadingModal();
                document.getElementById('addUserModal').style.display = 'block';

                showNotification(`🏫 Создание администратора для школы: ${school.full_name}`, 'info');
            });
        })
        .catch(error => {
            console.error('Error loading school:', error);
            closeLoadingModal();
            showNotification('❌ Ошибка загрузки данных школы: ' + error.message, 'error');
        });
}

// ==================== ЭКСПОРТ ОТЧЕТОВ ====================

function exportReport(format) {
    showLoadingModal(`Подготовка экспорта в ${format.toUpperCase()}...`);

    // В реальном проекте здесь был бы вызов API для генерации файла
    setTimeout(() => {
        closeLoadingModal();

        if (format === 'pdf') {
            // Генерация PDF (заглушка)
            const pdfBlob = new Blob(['PDF content would be here'], { type: 'application/pdf' });
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `system_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showNotification('📄 PDF отчет успешно сгенерирован и скачан', 'success');
        } else if (format === 'excel') {
            // Генерация Excel (заглушка)
            const excelBlob = new Blob(['Excel content would be here'], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(excelBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `system_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showNotification('📊 Excel отчет успешно сгенерирован и скачан', 'success');
        }
    }, 2000);
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function loadSchoolsForEditSelect() {
    return fetch('api/get_schools.php')
        .then(response => response.json())
        .then(schools => {
            const select = document.getElementById('edit_userSchool');
            if (select) {
                select.innerHTML = '<option value="">Выберите школу</option>';
                schools.forEach(school => {
                    const option = document.createElement('option');
                    option.value = school.id;
                    option.textContent = school.full_name;
                    select.appendChild(option);
                });
            }
        });
}

function loadRolesForEditSelect() {
    return fetch('api/get_roles.php')
        .then(response => response.json())
        .then(roles => {
            const select = document.getElementById('edit_userRole');
            if (select) {
                select.innerHTML = '<option value="">Выберите роль</option>';
                roles.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.id;
                    option.textContent = role.name;
                    select.appendChild(option);
                });
            }
        });
}

function generateSchoolEmail(schoolName) {
    // Генерация email на основе названия школы
    const baseName = schoolName
        .toLowerCase()
        .replace(/[^a-zа-я0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 20);

    return `${baseName}@school.local`;
}

function showLoadingModal(message) {
    let loadingModal = document.getElementById('loadingModal');
    if (!loadingModal) {
        loadingModal = document.createElement('div');
        loadingModal.id = 'loadingModal';
        loadingModal.className = 'modal';
        loadingModal.innerHTML = `
            <div class="modal-content" style="max-width: 300px; text-align: center;">
                <div class="modal-body">
                    <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                    <p>${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(loadingModal);
    }
    loadingModal.style.display = 'block';
}

function closeLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
        loadingModal.style.display = 'none';
    }
}

// ==================== УТИЛИТЫ ====================

// Показать уведомление
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notification => {
        if (notification.parentElement) {
            notification.remove();
        }
    });

    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = `
        <span class="notification-text">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(notification);

    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Показать загрузку
function showLoading(containerId, message = 'Загрузка...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }
}

// Экранирование HTML
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'Не указано';
    const date = new Date(dateTimeString);
    return date.toLocaleString('ru-RU');
}

// Переменные для управления предметами
let subjectCount = 1;

function addSubject() {
    subjectCount++;
    const container = document.getElementById('subjectsContainer');
    const subjectItem = document.createElement('div');
    subjectItem.className = 'subject-item';
    subjectItem.innerHTML = `
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
    `;
    container.appendChild(subjectItem);
}

function removeSubject(button) {
    if (subjectCount > 1) {
        button.closest('.subject-item').remove();
        subjectCount--;
    }
}

// Добавление CSS анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
        }
    }
    
    @keyframes notificationSlideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .loading-state {
        text-align: center;
        padding: 3rem;
        color: var(--gray-600);
    }
    
    .loading-spinner {
        border: 3px solid var(--gray-300);
        border-top: 3px solid var(--primary);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.7;
    }
    
    .subjects-list ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .subjects-list li {
        padding: 0.25rem 0;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .subjects-list li:last-child {
        border-bottom: none;
    }
    
    .reports-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
    }
    
    .setting-input {
        font-family: 'Courier New', monospace;
        background: var(--gray-100);
    }
    
    .subject-item {
        margin-bottom: 0.75rem;
        padding: 1rem;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: var(--border-radius);
        border: 1px solid var(--gray-200);
        transition: var(--transition);
    }
    
    .subject-item:hover {
        border-color: var(--primary-light);
    }
`;
document.head.appendChild(style);