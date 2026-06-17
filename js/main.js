document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilter = document.getElementById('closeFilter');
    const applyFilter = document.getElementById('applyFilter');
    const resetFilter = document.getElementById('resetFilter');
    const carsGrid = document.getElementById('carsGrid');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    const carsPerPage = 20;
    let filteredCars = [...carsData];

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
        filterPanel.classList.remove('active');
    });

    if (filterBtn) {
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            filterPanel.classList.toggle('active');
        });
    }

    if (closeFilter) {
        closeFilter.addEventListener('click', () => {
            filterPanel.classList.remove('active');
        });
    }

    renderCars();

    if (applyFilter) {
        applyFilter.addEventListener('click', () => {
            const brand = document.getElementById('filterBrand').value;
            const maxPrice = document.getElementById('filterPrice').value;
            const maxHp = document.getElementById('filterHp').value;
            const type = document.getElementById('filterType').value;

            filteredCars = [...carsData];

            if (brand) {
                filteredCars = filteredCars.filter(car => car.brand === brand);
            }
            if (maxPrice) {
                filteredCars = filteredCars.filter(car => car.price <= parseInt(maxPrice));
            }
            if (maxHp) {
                filteredCars = filteredCars.filter(car => car.hp <= parseInt(maxHp));
            }
            if (type) {
                filteredCars = filteredCars.filter(car => car.type === type);
            }

            currentPage = 1;
            renderCars();
            filterPanel.classList.remove('active');
        });
    }

    if (resetFilter) {
        resetFilter.addEventListener('click', () => {
            document.getElementById('filterBrand').value = '';
            document.getElementById('filterPrice').value = '';
            document.getElementById('filterHp').value = '';
            document.getElementById('filterType').value = '';
            filteredCars = [...carsData];
            currentPage = 1;
            renderCars();
            filterPanel.classList.remove('active');
        });
    }

    function renderCars() {
        carsGrid.innerHTML = '';
        pagination.innerHTML = '';

        const totalPages = Math.ceil(filteredCars.length / carsPerPage);
        const start = (currentPage - 1) * carsPerPage;
        const end = start + carsPerPage;
        const carsToShow = filteredCars.slice(start, end);

        if (carsToShow.length === 0) {
            carsGrid.innerHTML = '<p class="no-results">Автомобили не найдены</p>';
            return;
        }

        carsToShow.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            card.innerHTML = `
                <div class="car-card-image">
                    <img src="${car.images[0]}" alt="${car.brand} ${car.model}" onerror="this.style.display='none'; this.parentNode.innerHTML='<span>Фото</span>'">
                </div>
                <div class="car-card-info">
                    <div class="car-card-name">${car.brand} ${car.model}</div>
                    <div class="car-card-brand">${car.year} • ${car.type}</div>
                    <div class="car-card-price">${car.price.toLocaleString()} руб/день</div>
                </div>
            `;
            card.addEventListener('click', () => {
                window.location.href = `car.html?id=${car.id}`;
            });
            carsGrid.appendChild(card);
        });

        if (totalPages > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'pagination-btn';
            prevBtn.innerHTML = '&#8592; Назад';
            prevBtn.disabled = currentPage === 1;
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderCars();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            pagination.appendChild(prevBtn);

            const pagesContainer = document.createElement('div');
            pagesContainer.className = 'pagination-pages';

            for (let i = 1; i <= totalPages; i++) {
                const pageNum = document.createElement('button');
                pageNum.className = `page-number ${i === currentPage ? 'active' : ''}`;
                pageNum.textContent = i;
                pageNum.addEventListener('click', () => {
                    currentPage = i;
                    renderCars();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                pagesContainer.appendChild(pageNum);
            }

            pagination.appendChild(pagesContainer);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'pagination-btn';
            nextBtn.innerHTML = 'Вперед &#8594;';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderCars();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            pagination.appendChild(nextBtn);
        }
    }
});
