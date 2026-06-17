document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('tab-' + tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });

    let cars = [];
    try {
        const stored = localStorage.getItem('carhub_cars');
        if (stored) {
            cars = JSON.parse(stored);
        } else {
            cars = [...carsData];
            localStorage.setItem('carhub_cars', JSON.stringify(cars));
        }
    } catch {
        cars = [...carsData];
    }

    function saveCars() {
        localStorage.setItem('carhub_cars', JSON.stringify(cars));
        window.dispatchEvent(new CustomEvent('carhubCarsUpdated', { detail: { cars } }));
    }

    function getNextId() {
        return cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1;
    }

    function renderCarsTable() {
        const tbody = document.getElementById('carsList');
        if (!tbody) return;
        if (cars.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Автомобили не найдены</td></tr>';
            return;
        }
        tbody.innerHTML = cars.map(car => `
            <tr>
                <td>${car.id}</td>
                <td>${car.brand}</td>
                <td>${car.model}</td>
                <td>${car.year}</td>
                <td>${car.price.toLocaleString()} руб/день</td>
                <td>${car.type}</td>
                <td>
                    <div class="actions">
                        <button class="admin-btn admin-btn-primary admin-btn-small edit-car" data-id="${car.id}">Ред.</button>
                        <button class="admin-btn admin-btn-danger admin-btn-small delete-car" data-id="${car.id}">Уд.</button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.edit-car').forEach(btn => {
            btn.addEventListener('click', () => openCarModal(parseInt(btn.dataset.id)));
        });
        tbody.querySelectorAll('.delete-car').forEach(btn => {
            btn.addEventListener('click', () => deleteCar(parseInt(btn.dataset.id)));
        });
    }

    const modal = document.getElementById('carModal');
    const modalTitle = document.getElementById('modalTitle');

    document.getElementById('addCarBtn').addEventListener('click', () => openCarModal(null));
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCancel').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function openCarModal(id) {
        modal.classList.add('active');
        document.getElementById('carForm').reset();
        document.getElementById('carId').value = '';

        if (id) {
            modalTitle.textContent = 'Редактировать автомобиль';
            const car = cars.find(c => c.id === id);
            if (car) {
                document.getElementById('carId').value = car.id;
                document.getElementById('formBrand').value = car.brand;
                document.getElementById('formModel').value = car.model;
                document.getElementById('formYear').value = car.year;
                document.getElementById('formPrice').value = car.price;
                document.getElementById('formHp').value = car.hp;
                document.getElementById('formType').value = car.type;
                document.getElementById('formEngine').value = car.engine;
                document.getElementById('formTransmission').value = car.transmission;
                document.getElementById('formColor').value = car.color;
                document.getElementById('formDescription').value = car.description;
                document.getElementById('formImages').value = (car.images || []).join('\n');
            }
        } else {
            modalTitle.textContent = 'Добавить автомобиль';
        }
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    document.getElementById('carForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('carId').value;
        const imagesRaw = document.getElementById('formImages').value.trim();
        const images = imagesRaw ? imagesRaw.split('\n').map(s => s.trim()).filter(Boolean) : ['images/placeholder.jpg'];

        const carData = {
            brand: document.getElementById('formBrand').value.trim(),
            model: document.getElementById('formModel').value.trim(),
            year: parseInt(document.getElementById('formYear').value),
            price: parseInt(document.getElementById('formPrice').value),
            hp: parseInt(document.getElementById('formHp').value),
            type: document.getElementById('formType').value,
            engine: document.getElementById('formEngine').value.trim(),
            transmission: document.getElementById('formTransmission').value.trim(),
            color: document.getElementById('formColor').value.trim(),
            description: document.getElementById('formDescription').value.trim(),
            images: images
        };

        if (id) {
            const idx = cars.findIndex(c => c.id === parseInt(id));
            if (idx !== -1) {
                carData.id = parseInt(id);
                cars[idx] = carData;
            }
        } else {
            carData.id = getNextId();
            cars.push(carData);
        }

        saveCars();
        renderCarsTable();
        closeModal();
    });

    function deleteCar(id) {
        if (!confirm('Удалить автомобиль?')) return;
        cars = cars.filter(c => c.id !== id);
        saveCars();
        renderCarsTable();
    }

    function renderUsers() {
        const tbody = document.getElementById('usersList');
        if (!tbody) return;
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('carhub_user_')) {
                try {
                    users.push(JSON.parse(localStorage.getItem(key)));
                } catch {}
            }
        }

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Нет зарегистрированных пользователей</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.email || '-'}</td>
                <td>${u.license || '-'}</td>
                <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                <td><span class="status-badge ${u.blocked ? 'status-blocked' : 'status-active'}">${u.blocked ? 'Заблокирован' : 'Активен'}</span></td>
                <td>
                    <div class="actions">
                        <button class="admin-btn ${u.blocked ? 'admin-btn-success' : 'admin-btn-danger'} admin-btn-small toggle-block" data-license="${u.license}">
                            ${u.blocked ? 'Разблокировать' : 'Заблокировать'}
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.toggle-block').forEach(btn => {
            btn.addEventListener('click', () => {
                const license = btn.dataset.license;
                const key = 'carhub_user_' + license;
                try {
                    const user = JSON.parse(localStorage.getItem(key));
                    user.blocked = !user.blocked;
                    localStorage.setItem(key, JSON.stringify(user));
                    renderUsers();
                } catch {}
            });
        });
    }

    function renderBookings() {
        const tbody = document.getElementById('bookingsList');
        if (!tbody) return;
        let bookings = [];
        try {
            const stored = localStorage.getItem('carhub_bookings');
            if (stored) bookings = JSON.parse(stored);
        } catch {}

        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Нет бронирований</td></tr>';
            return;
        }

        tbody.innerHTML = bookings.map(b => {
            const car = cars.find(c => c.id === b.carId);
            return `
                <tr>
                    <td>${b.id}</td>
                    <td>${car ? car.brand + ' ' + car.model : '-'}</td>
                    <td>${b.userLicense || '-'}</td>
                    <td>${b.startDate || '-'} — ${b.endDate || '-'}</td>
                    <td>${b.total ? b.total.toLocaleString() + ' руб' : '-'}</td>
                    <td><span class="status-badge status-${b.status || 'pending'}">${getStatusText(b.status)}</span></td>
                    <td>
                        <div class="actions">
                            ${b.status === 'pending' ? '<button class="admin-btn admin-btn-success admin-btn-small approve-booking" data-id="' + b.id + '">Подтв.</button>' : ''}
                            ${b.status !== 'cancelled' && b.status !== 'completed' ? '<button class="admin-btn admin-btn-danger admin-btn-small cancel-booking" data-id="' + b.id + '">Отм.</button>' : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('.approve-booking').forEach(btn => {
            btn.addEventListener('click', () => updateBookingStatus(parseInt(btn.dataset.id), 'active'));
        });
        tbody.querySelectorAll('.cancel-booking').forEach(btn => {
            btn.addEventListener('click', () => updateBookingStatus(parseInt(btn.dataset.id), 'cancelled'));
        });
    }

    function getStatusText(status) {
        const map = { pending: 'Ожидание', active: 'Активно', completed: 'Завершено', cancelled: 'Отменено' };
        return map[status] || status;
    }

    function updateBookingStatus(id, newStatus) {
        let bookings = [];
        try {
            const stored = localStorage.getItem('carhub_bookings');
            if (stored) bookings = JSON.parse(stored);
        } catch {}
        const idx = bookings.findIndex(b => b.id === id);
        if (idx !== -1) {
            bookings[idx].status = newStatus;
            localStorage.setItem('carhub_bookings', JSON.stringify(bookings));
            renderBookings();
        }
    }

    document.getElementById('saveContactBtn').addEventListener('click', () => {
        const data = {
            address: document.getElementById('contentAddress').value,
            phone: document.getElementById('contentPhone').value,
            email: document.getElementById('contentEmail').value
        };
        localStorage.setItem('carhub_contact', JSON.stringify(data));
        alert('Контакты сохранены');
    });

    document.getElementById('saveContentBtn').addEventListener('click', () => {
        const data = {
            banner: document.getElementById('contentBanner').value,
            promo: document.getElementById('contentPromo').value
        };
        localStorage.setItem('carhub_content', JSON.stringify(data));
        alert('Контент сохранён');
    });

    const savedContact = localStorage.getItem('carhub_contact');
    if (savedContact) {
        try {
            const c = JSON.parse(savedContact);
            document.getElementById('contentAddress').value = c.address || '';
            document.getElementById('contentPhone').value = c.phone || '';
            document.getElementById('contentEmail').value = c.email || '';
        } catch {}
    }
    const savedContent = localStorage.getItem('carhub_content');
    if (savedContent) {
        try {
            const c = JSON.parse(savedContent);
            document.getElementById('contentBanner').value = c.banner || '';
            document.getElementById('contentPromo').value = c.promo || '';
        } catch {}
    }

    renderCarsTable();
    renderUsers();
    renderBookings();
});
