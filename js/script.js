console.log("Computadoras Lei - Consola de desarrollo iniciada.");

// ==========================================
// 1. MENÚ MÓVIL (NAVBAR) MEJORADO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    // Función maestra: Cierra el menú y resetea la "X" a las 3 rayitas
    function closeMobileMenu() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        }
    }

    if (menuToggle && navMenu) {
        // Cuando tocás el botón hamburguesa o la X
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Frena el click para que no active el "tocar afuera" accidentalmente
            navMenu.classList.toggle('active');
            
            // Cambia el ícono de rayitas a X y viceversa
            if (navMenu.classList.contains('active')) {
                menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }

    // Cierra al tocar cualquier enlace del menú
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cierra al tocar en cualquier parte de la pantalla (afuera del menú)
    document.addEventListener('click', (event) => {
        if (navMenu && navMenu.classList.contains('active')) {
            // Si tocaste en cualquier lado que NO sea el menú ni el botón, lo cierra
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMobileMenu();
            }
        }
    });

    // Cierra al deslizar la pantalla (scroll)
    window.addEventListener('scroll', () => {
        closeMobileMenu();
    });
});

// ==========================================
// 2. SISTEMA DE PESTAÑAS (TABS DE PRECIOS)
// ==========================================
function switchTab(category) {
    // Remover clase 'active' de todos los bloques de contenido
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
    });
    
    // Remover clase 'active' de todos los botones de pestañas
    document.querySelectorAll(".tab-btn").forEach(button => {
        button.classList.remove("active");
    });

    // Activar el bloque y el botón seleccionado
    document.getElementById(`tab-${category}`).classList.add("active");
    
    // Buscar el botón correspondiente mediante el evento para marcarlo activo
    const eventTarget = window.event.target;
    if(eventTarget) {
        eventTarget.classList.add("active");
    }
}

// ==========================================
// 3. GALERÍA DE IMÁGENES (LIGHTBOX PARA PRODUCTOS)
// ==========================================

// Acá guardamos las fotos reales de cada compu
const galleries = {
    'dell-5490': [
        'assets/img/dell-1.jpg',
        'assets/img/dell-2.jpg',
        'assets/img/dell-3.jpg'
    ],
    'hp-440': [
        'assets/img/dell-1.jpg', // (Acordate de cambiar estas fotos por las de la HP después)
        'assets/img/dell-2.jpg'
    ]
};

let currentGallery = [];
let currentIndex = 0;

// Abrir la galería
function openGallery(galleryId) {
    currentGallery = galleries[galleryId];
    if (!currentGallery || currentGallery.length === 0) return;
    
    currentIndex = 0;
    updateModalImage();
    document.getElementById('gallery-modal').style.display = 'flex';
}

// Cerrar la galería
function closeGallery() {
    document.getElementById('gallery-modal').style.display = 'none';
}

// Cambiar de imagen (flechas)
function changeImage(direction) {
    currentIndex += direction;
    
    if (currentIndex >= currentGallery.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = currentGallery.length - 1;
    }
    
    updateModalImage();
}

// Actualizar la foto en pantalla
function updateModalImage() {
    const modalImg = document.getElementById('modal-img');
    if (modalImg) {
        modalImg.src = currentGallery[currentIndex];
        document.getElementById('current-img-num').innerText = currentIndex + 1;
        document.getElementById('total-img-num').innerText = currentGallery.length;
    }
}

// Cerrar haciendo clic afuera
window.addEventListener('click', function(event) {
    const modal = document.getElementById('gallery-modal');
    if (event.target === modal) {
        closeGallery();
    }
});

// ==========================================
// EXTRAS: EXPERIENCIA DE USUARIO (UX)
// ==========================================

// Control de la galería con el teclado (Esc y Flechas)
window.addEventListener('keydown', function(event) {
    const modal = document.getElementById('gallery-modal');
    
    // Solo actuamos si el cuadro negro de la galería está abierto
    if (modal && modal.style.display === 'flex') {
        if (event.key === 'Escape') {
            closeGallery(); // Cierra con Esc
        } else if (event.key === 'ArrowRight') {
            changeImage(1); // Siguiente foto
        } else if (event.key === 'ArrowLeft')  {
            changeImage(-1); // Foto anterior
        }
    }
});