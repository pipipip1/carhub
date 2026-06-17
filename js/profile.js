document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    const isLoggedIn = localStorage.getItem('userLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userEmail = document.getElementById('userEmail');
    userEmail.textContent = user.email || 'Пользователь';

    const adminLink = document.getElementById('adminProfileLink');
    const userLicense = localStorage.getItem('userLicense');
    if (adminLink && userLicense === 'admin') {
        adminLink.style.display = 'block';
    }

    const demoRentals = [
        { carId: 1, date: '2026-05-10', days: 3 },
        { carId: 5, date: '2026-05-01', days: 2 },
        { carId: 8, date: '2026-04-20', days: 5 },
        { carId: 12, date: '2026-04-10', days: 1 },
        { carId: 3, date: '2026-03-25', days: 4 },
        { carId: 57, date: '2026-03-15', days: 2 },
        { carId: 33, date: '2026-02-20', days: 1 },
        { carId: 53, date: '2026-02-10', days: 3 }
    ];

    let totalRentals = demoRentals.length;
    let totalSpent = 0;
    let totalDays = 0;

    const rentalsList = document.getElementById('rentalsList');

    demoRentals.forEach(rental => {
        const car = carsData.find(c => c.id === rental.carId);
        if (!car) return;

        const rentalCost = car.price * rental.days;
        totalSpent += rentalCost;
        totalDays += rental.days;

        const rentalCard = document.createElement('div');
        rentalCard.className = 'rental-card';
        rentalCard.innerHTML = `
            <div class="rental-image">
                <img src="${car.images[0]}" alt="${car.brand} ${car.model}" onerror="this.style.display='none'; this.parentNode.innerHTML='<span style=color:#666>Фото</span>'">
            </div>
            <div class="rental-info">
                <span class="rental-car-name">${car.brand} ${car.model}</span>
                <span class="rental-date">${formatDate(rental.date)}</span>
            </div>
            <div class="rental-details">
                <div class="rental-price">${rentalCost.toLocaleString()} ₽</div>
                <div class="rental-days">${rental.days} дн.</div>
            </div>
        `;

        rentalCard.addEventListener('click', () => {
            window.location.href = `car.html?id=${car.id}`;
        });

        rentalsList.appendChild(rentalCard);
    });

    document.getElementById('totalRentals').textContent = totalRentals;
    document.getElementById('totalSpent').textContent = `${totalSpent.toLocaleString()} ₽`;
    document.getElementById('totalDays').textContent = totalDays;

    if (demoRentals.length === 0) {
        rentalsList.innerHTML = '<p class="no-rentals">У вас пока нет аренд</p>';
    }
});

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}
