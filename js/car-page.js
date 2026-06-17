document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        menu.classList.toggle('active');
    });

    const urlParams = new URLSearchParams(window.location.search);
    const carId = parseInt(urlParams.get('id'));
    const car = carsData.find(c => c.id === carId);

    if (!car) {
        document.querySelector('.car-main').innerHTML = '<h1>Автомобиль не найден</h1>';
        return;
    }

    let currentImageIndex = 0;

    const carImage = document.getElementById('carImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const galleryDots = document.getElementById('galleryDots');

    document.getElementById('carTitle').textContent = `${car.brand} ${car.model}`;
    document.getElementById('carPrice').textContent = `${car.price.toLocaleString()} руб/день`;
    document.getElementById('carDescription').textContent = car.description;

    document.getElementById('specBrand').textContent = car.brand;
    document.getElementById('specModel').textContent = car.model;
    document.getElementById('specYear').textContent = car.year;
    document.getElementById('specType').textContent = car.type;
    document.getElementById('specEngine').textContent = car.engine;
    document.getElementById('specHp').textContent = `${car.hp} л.с.`;
    document.getElementById('specTransmission').textContent = car.transmission;
    document.getElementById('specColor').textContent = car.color;

    car.images.forEach((img, index) => {
        const dot = document.createElement('div');
        dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToImage(index));
        galleryDots.appendChild(dot);
    });

    function updateImage() {
        carImage.src = car.images[currentImageIndex];
        carImage.alt = `${car.brand} ${car.model}`;
        carImage.onerror = function() {
            this.style.display = 'none';
            this.parentNode.innerHTML = '<span style="color: #666; font-size: 1.2rem;">Фото ' + (currentImageIndex + 1) + '</span>';
        };
        
        document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentImageIndex);
        });
    }

    function goToImage(index) {
        currentImageIndex = index;
        updateImage();
    }

    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + car.images.length) % car.images.length;
        updateImage();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % car.images.length;
        updateImage();
    });

    updateImage();

    const rentBtn = document.getElementById('rentBtn');
    rentBtn.addEventListener('click', () => {
        alert('Автомобиль забронирован!');
    });
});
