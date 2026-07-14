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
    'dell-5490-equipo2': [
        'assets/img/dell-1.jpg', 
        'assets/img/dell-2.jpg'  
    ],

    'Asus-equipo3': [
        'assets/img/dell-1.jpg',
        'assets/img/dell-2.jpg',
        'assets/img/dell-3.jpg'
    ],
    'hp-440-equipo4': [
        'assets/img/dell-1.jpg', 
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

// ==========================================
// 4. MODAL DE VIDEOS (VERSIÓN DEFINITIVA MOBILE)
// ==========================================

function openVideoModal(videoSrc) {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('modal-video-player');
    
    if (modal && player) {
        player.src = videoSrc;
        modal.style.display = 'flex';
        
        // Forzamos el play de respaldo por si el navegador se duerme
        player.play().catch(e => console.log("Auto-reproducción asistida", e));
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('modal-video-player');
    
    if (modal && player) {
        player.pause();
        player.src = '';
        modal.style.display = 'none';
    }
}

// Cerrar con Escape en PC
window.addEventListener('keydown', function(event) {
    const videoModal = document.getElementById('video-modal');
    if (event.key === 'Escape' && videoModal && videoModal.style.display === 'flex') {
        closeVideoModal();
    }
});

// Cerrar tocando afuera del video (fondo negro)
window.addEventListener('click', function(event) {
    const videoModal = document.getElementById('video-modal');
    if (videoModal && event.target === videoModal) {
        closeVideoModal();
    }
});

// ==========================================
// SWIPE DOWN (Deslizar hacia abajo para cerrar)
// ==========================================
const videoModalSection = document.getElementById('video-modal');
let touchStartPointY = 0;

if (videoModalSection) {
    videoModalSection.addEventListener('touchstart', (e) => {
        touchStartPointY = e.touches[0].clientY;
    }, { passive: true });

    videoModalSection.addEventListener('touchmove', (e) => {
        let currentY = e.touches[0].clientY;
        
        // Si el usuario desliza el dedo hacia abajo más de 70px, se cierra
        if (currentY - touchStartPointY > 70) {
            closeVideoModal();
        }
    }, { passive: true });
}

// ==========================================
// FIX MEJORADO: Manejo de scroll entre páginas
// ==========================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    // 1. Si venimos de un enlace con # (ej: index.html#productos), vamos a esa sección
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            // Un micro-retraso para asegurar que la página ya dibujó todo antes de bajar
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    } 
    // 2. Si no hay #, restauramos el scroll PERO identificando de qué página es
    else {
        const pagePath = window.location.pathname;
        const currentScroll = sessionStorage.getItem('scroll_' + pagePath);
        if (currentScroll) {
            window.scrollTo(0, parseInt(currentScroll, 10));
        }
    }
});

// Guardamos la posición asociándola al nombre de la página actual
window.addEventListener('beforeunload', () => {
    const pagePath = window.location.pathname;
    sessionStorage.setItem('scroll_' + pagePath, window.scrollY);
});

// ==========================================
// 5. ANIMACIONES AL SCROLLEAR (EFECTO APPLE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Configuramos el observador
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento entra en la pantalla...
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // Arranca la animación
                observer.unobserve(entry.target);     // ¡CLAVE! Lo desvincula para que no vuelva a pasar
            }
        });
    }, {
        threshold: 0.15, // Se activa cuando asoma un 15% del elemento
        rootMargin: "0px 0px -50px 0px" // Le da un poco de respiro antes de aparecer
    });

    // Buscamos todo lo que tenga la clase 'reveal' y lo ponemos a observar
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
});

// =========================================================================
// 6. CONEXIÓN A SUPABASE (LA MAGIA DE LA BASE DE DATOS)
// =========================================================================

// ACÁ PEGÁ TUS CLAVES (Dejalas adentro de las comillas simples)
const SUPABASE_URL = 'https://xbsjjqrizxdinmzystfu.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_CNCfFsHb-yGfE45YhHoFHQ_mS1Cpi7C'; 

// Inicializamos el motor de la base de datos
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para ir a buscar los precios a tu tabla
async function cargarPreciosDinamicos() {
    const tabla = document.getElementById('tabla-precios-supabase');
    
    // Si no estamos en el index.html (donde está la tabla), no hacemos nada
    if (!tabla) return;

    try {
        // Pedimos todos los datos de la tabla 'precios' que creaste el otro día
        const { data, error } = await db.from('precios').select('*');

        if (error) throw error; // Si hay error, lo atajamos en el catch abajo

        // Si la tabla está vacía (todavía no cargaste nada en Supabase)
        if (data.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #a0aec0; padding: 20px;">No hay precios cargados todavía. Agregalos desde tu panel.</td></tr>';
            return;
        }

        // Si hay datos, limpiamos el "Cargando..." y dibujamos las filas reales
        tabla.innerHTML = ''; 

        data.forEach(item => {
            // Formateamos el número para que tenga el punto de miles (Ej: 19.877)
            const precioLindo = new Intl.NumberFormat('es-AR').format(item.precio);
            
            // Creamos la fila HTML idéntica a tu diseño
            const fila = `
                <tr>
                    <td>${item.servicio}</td>
                    <td>${item.compatibilidad}</td>
                    <td class="price-cell">$${precioLindo}</td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });

    } catch (err) {
        console.error("Error al traer los precios de Supabase:", err);
        tabla.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #ff4a4a; padding: 20px;">Error de conexión con la base de datos.</td></tr>';
    }
}

// Apenas la página carga, ejecutamos la función para que llene la tabla
document.addEventListener("DOMContentLoaded", () => {
    // Si el objeto 'supabase' existe (porque pusimos el link en el HTML), cargamos los precios
    if (typeof supabase !== 'undefined') {
        cargarPreciosDinamicos();
    }
});