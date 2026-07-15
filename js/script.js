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
// 6. CONEXIÓN A SUPABASE (SEPARANDO SOFTWARE Y HARDWARE)
// =========================================================================
const SUPABASE_URL = 'https://xbsjjqrizxdinmzystfu.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_CNCfFsHb-yGfE45YhHoFHQ_mS1Cpi7C'; 

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cargarPreciosDinamicos() {
    const tablaSoftware = document.getElementById('tabla-software-dinamica');
    const tablaHardware = document.getElementById('tabla-hardware-dinamica');
    
    // Si no estamos en el index.html, salimos para que no tire error
    if (!tablaSoftware && !tablaHardware) return;

    try {
        const { data, error } = await db.from('precios').select('*').order('id', { ascending: false });

        if (error) throw error;

        // Si la base de datos está totalmente vacía
        if (data.length === 0) {
            const msjVacio = '<tr><td colspan="3" style="text-align: center; color: #a0aec0; padding: 20px;">No hay precios cargados todavía. Agregalos desde tu Console.</td></tr>';
            if (tablaSoftware) tablaSoftware.innerHTML = msjVacio;
            if (tablaHardware) tablaHardware.innerHTML = msjVacio;
            return;
        }

        let htmlSoftware = '';
        let htmlHardware = '';

        data.forEach(item => {
            const precioLindo = new Intl.NumberFormat('es-AR').format(item.precio);
            const fila = `
                <tr>
                    <td>${item.servicio}</td>
                    <td>${item.compatibilidad}</td>
                    <td class="price-cell">$${precioLindo}</td>
                </tr>
            `;
            
            // Reparcelamos cada fila a la bolsa que le corresponde
            if (item.categoria === 'hardware') {
                htmlHardware += fila;
            } else {
                htmlSoftware += fila;
            }
        });

        // Pintamos el HTML en la web. Si alguna bolsa quedó vacía, mostramos mensaje.
        if (tablaSoftware) {
            tablaSoftware.innerHTML = htmlSoftware !== '' ? htmlSoftware : '<tr><td colspan="3" style="text-align: center; color: #a0aec0; padding: 20px;">No hay servicios de software cargados.</td></tr>';
        }
        
        if (tablaHardware) {
            tablaHardware.innerHTML = htmlHardware !== '' ? htmlHardware : '<tr><td colspan="3" style="text-align: center; color: #a0aec0; padding: 20px;">No hay servicios de hardware cargados.</td></tr>';
        }

    } catch (err) {
        console.error("Error al traer los precios de Supabase:", err);
        const msjError = '<tr><td colspan="3" style="text-align: center; color: #ff4a4a; padding: 20px;">Error de conexión con la base de datos.</td></tr>';
        if (tablaSoftware) tablaSoftware.innerHTML = msjError;
        if (tablaHardware) tablaHardware.innerHTML = msjError;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof supabase !== 'undefined') {
        cargarPreciosDinamicos();
    }
});

// =========================================================================
// 7. GENERADOR AUTOMÁTICO DE PDF V3 (Limpió y Descarga Directa)
// =========================================================================
async function generarPDF(event) {
    event.preventDefault(); 
    
    const btnPdf = event.currentTarget;
    const textoOriginal = btnPdf.innerHTML;
    // Efecto visual de carga
    btnPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF...';
    btnPdf.style.pointerEvents = 'none';

    try {
        const { data, error } = await db.from('precios').select('*').order('id', { ascending: false });
        if (error) throw error;

        const softwareData = data.filter(item => item.categoria !== 'hardware').map(item => [item.servicio, item.compatibilidad, '$' + new Intl.NumberFormat('es-AR').format(item.precio)]);
        const hardwareData = data.filter(item => item.categoria === 'hardware').map(item => [item.servicio, item.compatibilidad, '$' + new Intl.NumberFormat('es-AR').format(item.precio)]);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Propiedades del archivo
        doc.setProperties({
            title: 'Listado_Precios_Computadoras_Lei.pdf',
            author: 'Computadoras Lei'
        });

        // --- DISEÑO DEL ENCABEZADO LIMPIO ---
        
        // 1. Dibujamos el Logo SVG con código puro (para que sea ultra nítido)
        doc.setDrawColor(0, 180, 200); // Color cyan oscurecido para impresión
        doc.setLineWidth(0.8);
        
        // Monitor
        doc.roundedRect(14, 12, 16, 11, 1.5, 1.5, 'S'); 
        doc.line(18, 23, 16, 28); // Pata izquierda
        doc.line(16, 28, 28, 28); // Base
        doc.line(28, 28, 26, 23); // Pata derecha
        
        // Gabinete
        doc.roundedRect(33, 10, 8, 18, 1.5, 1.5, 'S');
        doc.line(36, 13, 38, 13); // Botón
        doc.line(36, 16, 38, 16); // Línea detalle
        
        // Cruz en el monitor (opcional detalle técnico)
        doc.setDrawColor(150, 150, 150);
        doc.line(19, 17.5, 25, 17.5);
        doc.line(22, 14.5, 22, 20.5);

        // 2. Título Principal (Alineado a la derecha del logo)
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("COMPUTADORAS LEI", 48, 19);
        
        // 3. Subtítulo
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Soporte Técnico Premium & Armado de PC", 48, 25);

        // 4. Fecha Actualizada (Alineada a la derecha de la hoja)
        const fechaHoy = new Date().toLocaleDateString('es-AR');
        doc.setFontSize(9);
        doc.text(`Actualizado el: ${fechaHoy}`, 196, 20, { align: "right" });

        let posicionY = 38; // Arrancamos las tablas más arriba para ahorrar espacio

        // Configuración unificada para que las columnas siempre midan lo mismo
        const columnasDiseño = {
            0: { halign: 'left', cellWidth: 90 },
            1: { halign: 'left', cellWidth: 55 },
            2: { halign: 'center', cellWidth: 37, fontStyle: 'bold', textColor: [0, 130, 150] } // El precio en color oscuro
        };

        // --- TABLA DE SOFTWARE ---
        if (softwareData.length > 0) {
            doc.setTextColor(0, 150, 170); // Título de categoría Cyan
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.text("Software y Sistemas", 14, posicionY);
            
            doc.autoTable({
                startY: posicionY + 4,
                head: [['SERVICIO / SOLUCIÓN TÉCNICA', 'COMPATIBILIDAD', 'PRECIO (ARS)']],
                body: softwareData,
                theme: 'grid',
                headStyles: { fillColor: [23, 30, 44], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
                columnStyles: columnasDiseño,
                styles: { fontSize: 9, cellPadding: 4 }, // Menos padding para ahorrar altura
                alternateRowStyles: { fillColor: [248, 250, 252] } // Gris hiper claro
            });
            posicionY = doc.lastAutoTable.finalY + 15; 
        }

        // --- TABLA DE HARDWARE ---
        if (hardwareData.length > 0) {
            doc.setTextColor(0, 150, 170);
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.text("Hardware, Limpieza y Armado", 14, posicionY);
            
            doc.autoTable({
                startY: posicionY + 4,
                head: [['SERVICIO / SOLUCIÓN TÉCNICA', 'COMPATIBILIDAD', 'PRECIO (ARS)']],
                body: hardwareData,
                theme: 'grid',
                headStyles: { fillColor: [23, 30, 44], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
                columnStyles: columnasDiseño,
                styles: { fontSize: 9, cellPadding: 4 },
                alternateRowStyles: { fillColor: [248, 250, 252] }
            });
        }

        // 5. DESCARGA DIRECTA (La solución definitiva al nombre raro)
        doc.save('Listado_Precios_Computadoras_Lei.pdf');

        // Mostramos un éxito temporal en el botón
        btnPdf.innerHTML = '<i class="fa-solid fa-check"></i> ¡Descarga Exitosa!';
        btnPdf.style.background = '#00ff66';
        btnPdf.style.color = '#000';
        btnPdf.style.borderColor = '#00ff66';
        
    } catch (err) {
        console.error("Error al generar PDF:", err);
        alert("Hubo un error al generar el PDF. Revisá tu conexión a internet.");
    } finally {
        // Restauramos el botón a la normalidad después de 2.5 segundos
        setTimeout(() => {
            btnPdf.innerHTML = textoOriginal;
            btnPdf.style.pointerEvents = 'auto';
            btnPdf.style.background = '';
            btnPdf.style.color = '';
            btnPdf.style.borderColor = '';
        }, 2500);
    }
}