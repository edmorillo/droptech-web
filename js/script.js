console.log("Computadoras Lei - Consola de desarrollo iniciada.");

// ==========================================
// 1. MENÚ MÓVIL (NAVBAR) MEJORADO
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    function closeMobileMenu() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        }
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); 
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }

    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (event) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMobileMenu();
            }
        }
    });

    window.addEventListener('scroll', () => {
        closeMobileMenu();
    });
});

// ==========================================
// 2. SISTEMA DE PESTAÑAS (TABS DE PRECIOS)
// ==========================================
function switchTab(category) {
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
    });
    
    document.querySelectorAll(".tab-btn").forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(`tab-${category}`).classList.add("active");
    
    const eventTarget = window.event.target;
    if(eventTarget) {
        eventTarget.classList.add("active");
    }
}

// ==========================================
// 3. GALERÍA DE IMÁGENES (LIGHTBOX)
// ==========================================
const galleries = {
    'dell-5490': ['assets/img/dell-1.jpg', 'assets/img/dell-2.jpg', 'assets/img/dell-3.jpg'],
    'dell-5490-equipo2': ['assets/img/dell-1.jpg', 'assets/img/dell-2.jpg'],
    'Asus-equipo3': ['assets/img/dell-1.jpg', 'assets/img/dell-2.jpg', 'assets/img/dell-3.jpg'],
    'hp-440-equipo4': ['assets/img/dell-1.jpg', 'assets/img/dell-2.jpg']
};

let currentGallery = [];
let currentIndex = 0;

function openGallery(galleryId) {
    currentGallery = galleries[galleryId];
    if (!currentGallery || currentGallery.length === 0) return;
    
    currentIndex = 0;
    updateModalImage();
    document.getElementById('gallery-modal').style.display = 'flex';
}

function closeGallery() {
    document.getElementById('gallery-modal').style.display = 'none';
}

function changeImage(direction) {
    currentIndex += direction;
    if (currentIndex >= currentGallery.length) currentIndex = 0;
    else if (currentIndex < 0) currentIndex = currentGallery.length - 1;
    updateModalImage();
}

function updateModalImage() {
    const modalImg = document.getElementById('modal-img');
    if (modalImg) {
        modalImg.src = currentGallery[currentIndex];
        document.getElementById('current-img-num').innerText = currentIndex + 1;
        document.getElementById('total-img-num').innerText = currentGallery.length;
    }
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('gallery-modal');
    if (event.target === modal) closeGallery();
});

window.addEventListener('keydown', function(event) {
    const modal = document.getElementById('gallery-modal');
    if (modal && modal.style.display === 'flex') {
        if (event.key === 'Escape') closeGallery();
        else if (event.key === 'ArrowRight') changeImage(1);
        else if (event.key === 'ArrowLeft') changeImage(-1);
    }
});

// ==========================================
// 4. MODAL DE VIDEOS
// ==========================================
function openVideoModal(videoSrc) {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('modal-video-player');
    if (modal && player) {
        player.src = videoSrc;
        modal.style.display = 'flex';
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

window.addEventListener('keydown', function(event) {
    const videoModal = document.getElementById('video-modal');
    if (event.key === 'Escape' && videoModal && videoModal.style.display === 'flex') {
        closeVideoModal();
    }
});

window.addEventListener('click', function(event) {
    const videoModal = document.getElementById('video-modal');
    if (videoModal && event.target === videoModal) closeVideoModal();
});

const videoModalSection = document.getElementById('video-modal');
let touchStartPointY = 0;
if (videoModalSection) {
    videoModalSection.addEventListener('touchstart', (e) => { touchStartPointY = e.touches[0].clientY; }, { passive: true });
    videoModalSection.addEventListener('touchmove', (e) => {
        let currentY = e.touches[0].clientY;
        if (currentY - touchStartPointY > 70) closeVideoModal();
    }, { passive: true });
}

// ==========================================
// MANEJO DE SCROLL & ANIMACIONES
// ==========================================
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) setTimeout(() => { targetSection.scrollIntoView({ behavior: 'smooth' }); }, 100);
    } else {
        const pagePath = window.location.pathname;
        const currentScroll = sessionStorage.getItem('scroll_' + pagePath);
        if (currentScroll) window.scrollTo(0, parseInt(currentScroll, 10));
    }
});

window.addEventListener('beforeunload', () => {
    const pagePath = window.location.pathname;
    sessionStorage.setItem('scroll_' + pagePath, window.scrollY);
});

document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
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
// 7. GENERADOR AUTOMÁTICO DE PDF (jsPDF + AutoTable)
// =========================================================================
async function generarPDF(event) {
    event.preventDefault(); 
    
    const btnPdf = event.currentTarget;
    const textoOriginal = btnPdf.innerHTML;
    btnPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF...';
    btnPdf.style.pointerEvents = 'none';

    const pdfWindow = window.open("", "_blank");
    if (pdfWindow) {
        // Le forzamos el nombre a la pestaña para que quede más pro
        pdfWindow.document.title = "Listado de Precios - Computadoras Lei";
        pdfWindow.document.write('<h2 style="font-family:sans-serif; text-align:center; margin-top:50px; color:#333;">Generando tu lista de precios... ⏳</h2>');
    }

    try {
        const { data, error } = await db.from('precios').select('*').order('id', { ascending: false });
        if (error) throw error;

        const softwareData = data.filter(item => item.categoria !== 'hardware').map(item => [item.servicio, item.compatibilidad, '$' + new Intl.NumberFormat('es-AR').format(item.precio)]);
        const hardwareData = data.filter(item => item.categoria === 'hardware').map(item => [item.servicio, item.compatibilidad, '$' + new Intl.NumberFormat('es-AR').format(item.precio)]);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Le pasamos el título interno al archivo
        doc.setProperties({
            title: 'Listado_Precios_Computadoras_Lei.pdf',
            author: 'Computadoras Lei'
        });

        // 3. NUEVO DISEÑO DEL ENCABEZADO (Clean & Neon)
        
        // Línea superior cyan para darle el toque premium
        doc.setFillColor(0, 240, 255);
        doc.rect(0, 0, 210, 6, 'F');
        
        // Título Principal
        doc.setTextColor(0, 0, 0); // Texto negro
        doc.setFontSize(26);
        doc.setFont("helvetica", "bold");
        doc.text("COMPUTADORAS LEI", 105, 24, { align: "center" });
        
        // Subtítulo
        doc.setTextColor(100, 100, 100); // Gris elegante
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Soporte Técnico Premium & Armado de PC", 105, 32, { align: "center" });

        // Fecha (centrada abajo del título)
        const fechaHoy = new Date().toLocaleDateString('es-AR');
        doc.setFontSize(10);
        doc.text(`Lista actualizada automáticamente el: ${fechaHoy}`, 105, 40, { align: "center" });

        let posicionY = 55; 

        // 4. TABLA DE SOFTWARE
        if (softwareData.length > 0) {
            // Título de la categoría afuera de la tabla
            doc.setTextColor(0, 200, 220); // Cyan oscurecido para leerse bien en fondo blanco
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Software y Sistemas", 105, posicionY, { align: "center" });
            
            doc.autoTable({
                startY: posicionY + 5, // Damos espacio debajo del título
                head: [['Servicio', 'Compatibilidad', 'Precio (ARS)']], // <-- Cambiado a Servicio
                body: softwareData,
                theme: 'grid',
                headStyles: { fillColor: [0, 240, 255], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
                columnStyles: { 0: { halign: 'left' }, 1: { halign: 'center' }, 2: { halign: 'center', fontStyle: 'bold' } },
                styles: { fontSize: 10, cellPadding: 6 },
                alternateRowStyles: { fillColor: [248, 255, 255] }
            });
            posicionY = doc.lastAutoTable.finalY + 20; 
        }

        // 5. TABLA DE HARDWARE
        if (hardwareData.length > 0) {
            // Título de la categoría afuera de la tabla
            doc.setTextColor(0, 200, 220);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Hardware, Limpieza y Armado", 105, posicionY, { align: "center" });
            
            doc.autoTable({
                startY: posicionY + 5,
                head: [['Servicio', 'Compatibilidad', 'Precio (ARS)']], // <-- Cambiado a Servicio
                body: hardwareData,
                theme: 'grid',
                headStyles: { fillColor: [0, 240, 255], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
                columnStyles: { 0: { halign: 'left' }, 1: { halign: 'center' }, 2: { halign: 'center', fontStyle: 'bold' } },
                styles: { fontSize: 10, cellPadding: 6 },
                alternateRowStyles: { fillColor: [248, 255, 255] }
            });
        }

        if (pdfWindow) {
            pdfWindow.location.href = doc.output('bloburl');
        } else {
            doc.save('Listado_Precios_Computadoras_Lei.pdf');
        }

    } catch (err) {
        console.error("Error al generar PDF:", err);
        if (pdfWindow) pdfWindow.close();
        alert("Hubo un error al generar el PDF. Revisá tu conexión a internet.");
    } finally {
        btnPdf.innerHTML = textoOriginal;
        btnPdf.style.pointerEvents = 'auto';
    }
}