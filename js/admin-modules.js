// Модули функциональности для админ-панели
class AdminModules {
    constructor() {
        this.db = realDB;
        this.currentModule = 'dashboard';
    }

    // Загрузка модуля
    loadModule(moduleName) {
        this.currentModule = moduleName;
        const content = document.getElementById('module-content');

        document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));

        const moduleElement = document.getElementById(moduleName);
        if (moduleElement) {
            moduleElement.classList.add('active');
        } else {
            this.renderModule(moduleName, content);
        }

        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-module') === moduleName) {
                item.classList.add('active');
            }
        });
    }

    // Рендер модуля
    renderModule(moduleName, container) {
        container.innerHTML = '';

        switch(moduleName) {
            case 'schools':
                this.renderSchoolsModule(container);
                break;
            case 'add-school':
                this.renderAddSchoolModule(container);
                break;
            case 'school-admins':
                this.renderSchoolAdminsModule(container);
                break;
            case 'system-admins':
                this.renderSystemAdminsModule(container);
                break;
            case 'users':
                this.renderUsersModule(container);
                break;
            case 'roles':
                this.renderRolesModule(container);
                break;
            default:
                container.innerHTML = this.getModuleNotImplemented(moduleName);
        }
    }

    // Модуль управления школами
    renderSchoolsModule(container) {
        const schools = this.db.getSchools();

        container.innerHTML = `
            <section id="schools" class="module active">
                <div class="module-header">
                    <h2>Управление учебными заведениями</h2>
                    <div class="module-actions">
                        <button class="btn btn-primary" onclick="adminModules.loadModule('add-school')">
                            <i class="fas fa-plus"></i>
                            Добавить школу
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Тип</th>
                                <th>Статус</th>
                                <th>Директор</th>
                                <th>Контакты</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${schools.map(school => `
                                <tr>
                                    <td>
                                        <strong>${school.name}</strong><br>
                                        <small class="text-muted">ИНН: ${school.inn}</small>
                                    </td>
                                    <td>${school.type}</td>
                                    <td>
                                        <span class="status-badge ${school.status === 'Активна' ? 'active' : 'inactive'}">
                                            ${school.status}
                                        </span>
                                    </td>
                                    <td>${school.director}</td>
                                    <td>
                                        <div>📞 ${school.phone}</div>
                                        <div>📧 ${school.email}</div>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn btn-sm btn-primary" onclick="adminModules.editSchool(${school.id})">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-secondary" onclick="adminModules.manageSchoolAdmins(${school.id})">
                                                <i class="fas fa-user-tie"></i>
                                            </button>
                                            <button class="btn btn-sm btn-info" onclick="adminModules.viewSchoolDetails(${school.id})">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    }

    // Модуль добавления школы (1.0)
    renderAddSchoolModule(container) {
        container.innerHTML = `
            <section id="add-school" class="module active">
                <div class="module-header">
                    <h2>Добавление учебного заведения (1.0)</h2>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <form id="addSchoolForm">
                            <div class="tabs">
                                <button type="button" class="tab active" data-tab="basic">Основные данные</button>
                                <button type="button" class="tab" data-tab="address">Адреса</button>
                                <button type="button" class="tab" data-tab="contacts">Контакты</button>
                                <button type="button" class="tab" data-tab="documents">Документы</button>
                            </div>
                            
                            <div class="tab-content active" id="basic-tab">
                                <div class="form-group">
                                    <label class="form-label">Полное название школы *</label>
                                    <input type="text" class="form-control" name="name" required>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">ИНН *</label>
                                        <input type="text" class="form-control" name="inn" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Тип учреждения *</label>
                                        <select class="form-control form-select" name="type" required>
                                            <option value="">Выберите тип</option>
                                            <option value="Школа">Школа</option>
                                            <option value="Лицей">Лицей</option>
                                            <option value="Гимназия">Гимназия</option>
                                            <option value="Интернат">Интернат</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Статус</label>
                                    <select class="form-control form-select" name="status">
                                        <option value="Активна">Активна</option>
                                        <option value="Неактивна">Неактивна</option>
                                        <option value="На модерации">На модерации</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="tab-content" id="address-tab">
                                <div class="form-group">
                                    <label class="form-label">Юридический адрес *</label>
                                    <input type="text" class="form-control" name="legalAddress" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Физический адрес *</label>
                                    <input type="text" class="form-control" name="physicalAddress" required>
                                </div>
                            </div>
                            
                            <div class="tab-content" id="contacts-tab">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Телефон *</label>
                                        <input type="tel" class="form-control" name="phone" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Электронная почта *</label>
                                        <input type="email" class="form-control" name="email" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Веб-сайт</label>
                                        <input type="url" class="form-control" name="website">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">ФИО директора *</label>
                                        <input type="text" class="form-control" name="director" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tab-content" id="documents-tab">
                                <div class="form-group">
                                    <label class="form-label">Лицензия</label>
                                    <input type="text" class="form-control" name="license" 
                                           placeholder="№[XXX] от [дд.мм.гггг] выдана [___]">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Аккредитация</label>
                                    <input type="text" class="form-control" name="accreditation"
                                           placeholder="№[YYY] от [дд.мм.гггг] действует до [дд.мм.гггг]">
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i>
                                    Сохранить школу
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="adminModules.loadModule('schools')">
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        `;

        this.initTabs();
        this.initSchoolForm();
    }

    // Вспомогательные методы
    initTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');

                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }

    initSchoolForm() {
        const form = document.getElementById('addSchoolForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const schoolData = Object.fromEntries(formData);

                try {
                    this.db.addSchool(schoolData);
                    this.showNotification('Школа успешно добавлена!', 'success');
                    this.loadModule('schools');
                } catch (error) {
                    this.showNotification('Ошибка при добавлении школы', 'error');
                }
            });
        }
    }

    getModuleNotImplemented(moduleName) {
        return `
            <section id="${moduleName}" class="module active">
                <div class="module-header">
                    <h2>${moduleName}</h2>
                </div>
                <div class="card">
                    <div class="card-body text-center">
                        <i class="fas fa-tools" style="font-size: 3rem; color: var(--gray); margin-bottom: 1rem;"></i>
                        <h3>Модуль в разработке</h3>
                        <p class="text-muted">Данный функционал будет доступен в ближайшее время</p>
                    </div>
                </div>
            </section>
        `;
    }

    // Уведомления
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.getElementById('notification').appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Методы для действий
    editSchool(schoolId) {
        this.showNotification(`Редактирование школы ID: ${schoolId}`, 'info');
    }

    manageSchoolAdmins(schoolId) {
        this.showNotification(`Управление администраторами школы ID: ${schoolId}`, 'info');
    }

    viewSchoolDetails(schoolId) {
        this.showNotification(`Просмотр деталей школы ID: ${schoolId}`, 'info');
    }

    // Заглушки для других модулей
    renderSchoolAdminsModule(container) {
        container.innerHTML = this.getModuleNotImplemented('school-admins');
    }

    renderSystemAdminsModule(container) {
        container.innerHTML = this.getModuleNotImplemented('system-admins');
    }

    renderUsersModule(container) {
        container.innerHTML = this.getModuleNotImplemented('users');
    }

    renderRolesModule(container) {
        container.innerHTML = this.getModuleNotImplemented('roles');
    }
}

// Создаем глобальный экземпляр модулей
const adminModules = new AdminModules();