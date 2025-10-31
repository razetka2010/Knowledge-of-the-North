// Полная база данных для системы "Сетевой город"
class RealDatabase {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.isOnline = false;
        this.init();
    }

    init() {
        if (!localStorage.getItem('schools')) {
            this.initializeDemoData();
        }
        this.checkConnection();
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            this.isOnline = response.ok;
        } catch (error) {
            this.isOnline = false;
            console.log('Используется локальное хранилище');
        }
    }

    initializeDemoData() {
        const demoData = {
            schools: [
                {
                    id: 1,
                    name: "МБОУ Лицей №1",
                    inn: "1234567890",
                    type: "Лицей",
                    status: "Активна",
                    legalAddress: "г. Москва, ул. Ленина, д. 1",
                    physicalAddress: "г. Москва, ул. Ленина, д. 1",
                    phone: "+7 (495) 123-45-67",
                    email: "licey1@edu.ru",
                    website: "www.licey1.ru",
                    director: "Петров Иван Сергеевич",
                    license: "№123 от 15.08.2020 выдана Департаментом образования",
                    accreditation: "№456 от 20.09.2020 действует до 20.09.2025",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ],
            users: [
                {
                    id: 1,
                    username: 'admin',
                    email: 'admin@sgo.ru',
                    password: 'admin123',
                    fullName: 'Иванов Александр Сергеевич',
                    role: 'super_admin',
                    position: 'Главный администратор',
                    phone: '+7 (495) 111-22-33',
                    schoolId: null,
                    isActive: true,
                    permissions: ['all'],
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                },
                {
                    id: 2,
                    username: 'school_admin1',
                    email: 'admin@licey1.ru',
                    password: 'admin123',
                    fullName: 'Сидорова Мария Петровна',
                    role: 'school_admin',
                    position: 'Заместитель директора',
                    phone: '+7 (495) 123-45-67',
                    schoolId: 1,
                    isActive: true,
                    permissions: ['school_management', 'user_management'],
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                }
            ],
            roles: [
                {
                    id: 1,
                    name: "Учитель",
                    code: "teacher",
                    permissions: ["view_students", "add_grades", "view_schedule", "manage_attendance"],
                    description: "Основная роль для преподавателей"
                },
                {
                    id: 2,
                    name: "Классный руководитель",
                    code: "class_teacher",
                    permissions: ["view_students", "add_grades", "view_schedule", "manage_class", "parent_communication"],
                    description: "Учитель с дополнительными правами классного руководства"
                },
                {
                    id: 3,
                    name: "Администратор школы",
                    code: "school_admin",
                    permissions: ["manage_teachers", "manage_students", "view_reports", "school_settings", "user_management"],
                    description: "Администратор учебного заведения"
                }
            ],
            studyPlans: [],
            systemSettings: {
                academicYear: "2024-2025",
                currentPeriod: "1 четверть",
                globalSettings: {}
            }
        };

        Object.keys(demoData).forEach(key => {
            localStorage.setItem(key, JSON.stringify(demoData[key]));
        });
    }

    // Аутентификация
    async authenticateUser(username, password) {
        if (this.isOnline) {
            try {
                const response = await fetch(`${this.baseURL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error('Ошибка аутентификации');
                }

                const data = await response.json();
                return data;
            } catch (error) {
                throw new Error('Сервер недоступен');
            }
        } else {
            return this.localAuthenticate(username, password);
        }
    }

    localAuthenticate(username, password) {
        const users = this.getUsers();
        const user = users.find(u =>
            (u.username === username || u.email === username) &&
            u.password === password &&
            u.isActive
        );

        if (user) {
            user.lastLogin = new Date().toISOString();
            this.updateUser(user.id, user);

            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    position: user.position,
                    schoolId: user.schoolId,
                    permissions: user.permissions
                },
                token: 'demo-token-' + Date.now()
            };
        } else {
            throw new Error('Неверный логин или пароль');
        }
    }

    // Школы
    getSchools() {
        return JSON.parse(localStorage.getItem('schools') || '[]');
    }

    async addSchool(schoolData) {
        if (this.isOnline) {
            try {
                const response = await fetch(`${this.baseURL}/schools`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getToken()}`
                    },
                    body: JSON.stringify(schoolData)
                });
                return await response.json();
            } catch (error) {
                throw new Error('Ошибка добавления школы');
            }
        } else {
            return this.addLocalSchool(schoolData);
        }
    }

    addLocalSchool(schoolData) {
        const schools = this.getSchools();
        const newSchool = {
            id: Date.now(),
            ...schoolData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        schools.push(newSchool);
        localStorage.setItem('schools', JSON.stringify(schools));
        return newSchool;
    }

    // Пользователи
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    async addUser(userData) {
        if (this.isOnline) {
            try {
                const response = await fetch(`${this.baseURL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getToken()}`
                    },
                    body: JSON.stringify(userData)
                });
                return await response.json();
            } catch (error) {
                throw new Error('Ошибка добавления пользователя');
            }
        } else {
            return this.addLocalUser(userData);
        }
    }

    addLocalUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    async updateUser(id, userData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = {
                ...users[index],
                ...userData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('users', JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    // Администраторы школ (2.0)
    async addSchoolAdmin(adminData) {
        const userData = {
            ...adminData,
            role: 'school_admin',
            username: this.generateUsername(adminData.fullName),
            password: this.generateTempPassword()
        };
        return await this.addUser(userData);
    }

    // Системные администраторы (2.1)
    async addSystemAdmin(adminData) {
        const userData = {
            ...adminData,
            role: 'super_admin',
            schoolId: null
        };
        return await this.addUser(userData);
    }

    // Роли (2.2)
    getRoles() {
        return JSON.parse(localStorage.getItem('roles') || '[]');
    }

    async addRole(roleData) {
        if (this.isOnline) {
            try {
                const response = await fetch(`${this.baseURL}/roles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getToken()}`
                    },
                    body: JSON.stringify(roleData)
                });
                return await response.json();
            } catch (error) {
                throw new Error('Ошибка добавления роли');
            }
        } else {
            return this.addLocalRole(roleData);
        }
    }

    addLocalRole(roleData) {
        const roles = this.getRoles();
        const newRole = {
            id: Date.now(),
            ...roleData
        };
        roles.push(newRole);
        localStorage.setItem('roles', JSON.stringify(roles));
        return newRole;
    }

    // Утилиты
    generateTempPassword() {
        return Math.random().toString(36).slice(-8);
    }

    generateUsername(fullName) {
        const names = fullName.toLowerCase().split(' ');
        return (names[0] + '_' + names[1]).slice(0, 15);
    }

    getToken() {
        return localStorage.getItem('authToken');
    }

    setToken(token) {
        localStorage.setItem('authToken', token);
    }

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Статистика
    getSystemStats() {
        const schools = this.getSchools();
        const users = this.getUsers();

        return {
            schoolsCount: schools.length,
            usersCount: users.length,
            adminsCount: users.filter(u => u.role === 'school_admin' || u.role === 'super_admin').length,
            activeUsersCount: users.filter(u => u.isActive).length,
            activityPercent: Math.round((users.filter(u => u.lastLogin).length / users.length) * 100) || 0
        };
    }

    // Управление паролями
    async resetPassword(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            const newPassword = this.generateTempPassword();
            user.password = newPassword;
            user.passwordChanged = false;
            localStorage.setItem('users', JSON.stringify(users));
            return newPassword;
        }
        return null;
    }

    // Выход
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        if (this.isOnline) {
            fetch(`${this.baseURL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
        }
    }
}

// Создаем глобальный экземпляр базы данных
const realDB = new RealDatabase();