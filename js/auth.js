document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const licenseNumber = document.getElementById('licenseNumber').value;
            const password = document.getElementById('password').value;
            
            if (licenseNumber && password) {
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userLicense', licenseNumber);
                if (licenseNumber === 'admin') {
                    const adminUser = { email: 'admin@carhub.ru', license: 'admin', createdAt: new Date().toISOString() };
                    localStorage.setItem('user', JSON.stringify(adminUser));
                    localStorage.setItem('carhub_user_admin', JSON.stringify(adminUser));
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'profile.html';
                }
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const licenseNumber = document.getElementById('licenseNumber').value;
            const password = document.getElementById('password').value;
            
            if (email && licenseNumber && password) {
                const user = {
                    email: email,
                    license: licenseNumber,
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('carhub_user_' + licenseNumber, JSON.stringify(user));
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userLicense', licenseNumber);
                window.location.href = 'profile.html';
            }
        });
    }
});
