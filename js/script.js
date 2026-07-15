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
            if (menuToggle) { menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>'; }
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

    document.querySelectorAll('.menu a').forEach(link => { link.addEventListener('click', closeMobileMenu); });

    document.addEventListener('click', (event) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) { closeMobileMenu(); }
        }
    });

    window.addEventListener('scroll', () => { closeMobileMenu(); });
});

// ==========================================
// 2. SISTEMA DE PESTAÑAS (TABS DE PRECIOS)
// ==========================================
function switchTab(category) {
    document.querySelectorAll(".tab-content").forEach(content => { content.classList.remove("active"); });
    document.querySelectorAll(".tab-btn").forEach(button => { button.classList.remove("active"); });
    document.getElementById(`tab-${category}`).classList.add("active");
    const eventTarget = window.event.target;
    if(eventTarget) { eventTarget.classList.add("active"); }
}

// ==========================================
// 3. GALERÍA DE IMÁGENES (LIGHTBOX MODIFICADO)
// ==========================================
let currentGallery = [];
let currentIndex = 0;

// Esta función ahora lee las imágenes que separamos con comas
function openGalleryDinamic(imgString) {
    // Si hay texto, lo partimos por la coma para crear un listado de fotos. Si no, ponemos la genérica.
    if (imgString && imgString.trim() !== '') {
        currentGallery = imgString.split(',');
    } else {
        currentGallery = ['https://via.placeholder.com/1280x960/0b0f17/00F0FF?text=Equipo+Premium'];
    }
    
    currentIndex = 0;
    updateModalImage();
    document.getElementById('gallery-modal').style.display = 'flex';
}

function closeGallery() { document.getElementById('gallery-modal').style.display = 'none'; }

function changeImage(direction) {
    currentIndex += direction;
    if (currentIndex >= currentGallery.length) { currentIndex = 0; } 
    else if (currentIndex < 0) { currentIndex = currentGallery.length - 1; }
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
    if (event.target === modal) { closeGallery(); }
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
        player.pause(); player.src = ''; modal.style.display = 'none';
    }
}

window.addEventListener('keydown', function(event) {
    const videoModal = document.getElementById('video-modal');
    if (event.key === 'Escape' && videoModal && videoModal.style.display === 'flex') { closeVideoModal(); }
});

window.addEventListener('click', function(event) {
    const videoModal = document.getElementById('video-modal');
    if (videoModal && event.target === videoModal) { closeVideoModal(); }
});

const videoModalSection = document.getElementById('video-modal');
let touchStartPointY = 0;

if (videoModalSection) {
    videoModalSection.addEventListener('touchstart', (e) => { touchStartPointY = e.touches[0].clientY; }, { passive: true });
    videoModalSection.addEventListener('touchmove', (e) => {
        let currentY = e.touches[0].clientY;
        if (currentY - touchStartPointY > 70) { closeVideoModal(); }
    }, { passive: true });
}

// ==========================================
// 5. ANIMACIONES AL SCROLLEAR Y POSICION
// ==========================================
if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }

window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) { setTimeout(() => { targetSection.scrollIntoView({ behavior: 'smooth' }); }, 100); }
    } else {
        const pagePath = window.location.pathname;
        const currentScroll = sessionStorage.getItem('scroll_' + pagePath);
        if (currentScroll) { window.scrollTo(0, parseInt(currentScroll, 10)); }
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

    document.querySelectorAll('.reveal').forEach(el => { observer.observe(el); });
});

// =========================================================================
// 6. CONEXIÓN A SUPABASE (PRECIOS Y NOTEBOOKS)
// =========================================================================
const SUPABASE_URL = 'https://xbsjjqrizxdinmzystfu.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_CNCfFsHb-yGfE45YhHoFHQ_mS1Cpi7C'; 

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// A) CARGAR PRECIOS EN EL INDEX
async function cargarPreciosDinamicos() {
    const tablaSoftware = document.getElementById('tabla-software-dinamica');
    const tablaHardware = document.getElementById('tabla-hardware-dinamica');
    if (!tablaSoftware && !tablaHardware) return; // Si no estoy en el index, no hago nada

    try {
        const { data, error } = await db.from('precios').select('*').order('id', { ascending: false });
        if (error) throw error;

        if (data.length === 0) {
            const msjVacio = '<tr><td colspan="3" style="text-align: center; color: #a0aec0; padding: 20px;">No hay precios cargados todavía. Agregalos desde tu Console.</td></tr>';
            if (tablaSoftware) tablaSoftware.innerHTML = msjVacio;
            if (tablaHardware) tablaHardware.innerHTML = msjVacio;
            return;
        }

        let htmlSoftware = ''; let htmlHardware = '';

        data.forEach(item => {
            const precioLindo = new Intl.NumberFormat('es-AR').format(item.precio);
            const fila = `<tr><td>${item.servicio}</td><td>${item.compatibilidad}</td><td class="price-cell">$${precioLindo}</td></tr>`;
            
            if (item.categoria === 'hardware') htmlHardware += fila;
            else htmlSoftware += fila;
        });

        if (tablaSoftware) tablaSoftware.innerHTML = htmlSoftware !== '' ? htmlSoftware : '<tr><td colspan="3" style="text-align: center; color: #a0aec0; padding: 20px;">No hay servicios de software cargados.</td></tr>';
        if (tablaHardware) tablaHardware.innerHTML = htmlHardware !== '' ? htmlHardware : '<tr><td colspan="3" style="text-align: center; color: #a0aec0; padding: 20px;">No hay servicios de hardware cargados.</td></tr>';

    } catch (err) {
        console.error("Error al traer los precios:", err);
        const msjError = '<tr><td colspan="3" style="text-align: center; color: #ff4a4a; padding: 20px;">Error de conexión con la base de datos.</td></tr>';
        if (tablaSoftware) tablaSoftware.innerHTML = msjError;
        if (tablaHardware) tablaHardware.innerHTML = msjError;
    }
}

// B) CARGAR NOTEBOOKS EN LA TIENDA
async function cargarNotebooksDinamicas() {
    const grid = document.getElementById('grid-notebooks');
    if (!grid) return; // Si no estoy en la página notebooks.html, no hago nada

    try {
        const { data, error } = await db.from('notebooks').select('*').order('id', { ascending: false });
        if (error) throw error;

        if (data.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #a0aec0; padding: 40px; font-size: 18px;">No hay notebooks en stock por el momento. ¡Consultanos por WhatsApp!</div>';
            return;
        }

        grid.innerHTML = ''; // Limpiar el "Cargando..."

        data.forEach((item, index) => {
            const precioLindo = new Intl.NumberFormat('es-AR').format(item.precio);
            
            // Extraemos la primera foto para que sea la portada (Si subió muchas)
            let imagenPortada = 'https://via.placeholder.com/1280x960/0b0f17/00F0FF?text=Equipo+Premium';
            if (item.imagen && item.imagen.trim() !== '') {
                imagenPortada = item.imagen.split(',')[0];
            }
            
            const mensajeWs = encodeURIComponent(`Hola Lei! 👋 Me interesa la notebook ${item.titulo} que publicaste a $${precioLindo}. ¿Tenés stock?`);

            const card = `
                <div class="product-card reveal active" style="animation-delay: ${index * 0.1}s;">
                    <div class="prod-image-container" onclick="openGalleryDinamic('${item.imagen || ''}')">
                        <img src="${imagenPortada}" alt="${item.titulo}" class="main-prod-img">
                        <div class="img-overlay">
                            <i class="fa-solid fa-expand"></i>
                            <span>Ver galería</span>
                        </div>
                    </div>
                    
                    <h3>${item.titulo}</h3>
                    <ul style="text-align: left; color: #a0aec0; font-size: 0.95rem; margin-bottom: 25px; list-style: none; width: 100%; padding: 0 10px;">
                        <li style="margin-bottom: 8px;"><i class="fa-solid fa-microchip" style="width: 25px; color: #00F0FF;"></i> ${item.procesador}</li>
                        <li style="margin-bottom: 8px;"><i class="fa-solid fa-memory" style="width: 25px; color: #00F0FF;"></i> ${item.ram}</li>
                        <li style="margin-bottom: 8px;"><i class="fa-solid fa-hard-drive" style="width: 25px; color: #00F0FF;"></i> ${item.almacenamiento}</li>
                        <li><i class="fa-solid fa-battery-full" style="width: 25px; color: #00F0FF;"></i> ${item.bateria}</li>
                    </ul>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 20px;">
                        $${precioLindo} <span style="font-size: 0.8rem; font-weight: 400; color: #00ff66;">ARS</span>
                    </div>
                    <a href="https://wa.me/5491100000000?text=${mensajeWs}" target="_blank" class="btn-primary" style="width: 100%; text-align: center; box-sizing: border-box;">
                        <i class="fa-brands fa-whatsapp"></i> Consultar Disponibilidad
                    </a>
                </div>
            `;
            grid.innerHTML += card;
        });

    } catch (err) {
        console.error("Error al traer notebooks:", err);
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #ff4a4a; padding: 40px;">Hubo un error de conexión al cargar el stock.</div>';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof supabase !== 'undefined') {
        cargarPreciosDinamicos();
        cargarNotebooksDinamicas();
    }
});


// =========================================================================
// 7. GENERADOR AUTOMÁTICO DE PDF
// =========================================================================
async function generarPDF(event) {
    event.preventDefault(); 
    
    const btnPdf = event.currentTarget;
    const textoOriginal = btnPdf.innerHTML;
    btnPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF...';
    btnPdf.style.pointerEvents = 'none';

    try {
        const { data, error } = await db.from('precios').select('*').order('id', { ascending: false });
        if (error) throw error;

        const softwareData = data.filter(item => item.categoria !== 'hardware').map(item => [item.servicio, item.compatibilidad, '$' + new Intl.NumberFormat('es-AR').format(item.precio)]);
        const hardwareData = data.filter(item => item.categoria === 'hardware').map(item => [item.servicio, item.compatibilidad, '$' + new Intl.NumberFormat('es-AR').format(item.precio)]);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setProperties({ title: 'Listado_Precios_Computadoras_Lei.pdf', author: 'Computadoras Lei' });

        doc.setDrawColor(0, 180, 200); 
        doc.setLineWidth(0.8);
        doc.roundedRect(14, 12, 16, 11, 1.5, 1.5, 'S'); 
        doc.line(18, 23, 16, 28); 
        doc.line(16, 28, 28, 28); 
        doc.line(28, 28, 26, 23); 
        doc.roundedRect(33, 10, 8, 18, 1.5, 1.5, 'S');
        doc.line(36, 13, 38, 13); 
        doc.line(36, 16, 38, 16); 
        doc.setDrawColor(150, 150, 150);
        doc.line(19, 17.5, 25, 17.5);
        doc.line(22, 14.5, 22, 20.5);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("COMPUTADORAS LEI", 48, 19);
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Soporte Técnico Premium & Armado de PC", 48, 25);

        const fechaHoy = new Date().toLocaleDateString('es-AR');
        doc.setFontSize(9);
        doc.text(`Actualizado el: ${fechaHoy}`, 196, 20, { align: "right" });

        let posicionY = 34; 
        const columnasDiseño = {
            0: { halign: 'left', cellWidth: 90 },
            1: { halign: 'left', cellWidth: 55 },
            2: { halign: 'center', cellWidth: 37, fontStyle: 'bold', textColor: [0, 130, 150] }
        };

        if (softwareData.length > 0) {
            doc.setTextColor(0, 150, 170); 
            doc.setFontSize(12); 
            doc.setFont("helvetica", "bold");
            doc.text("Software y Sistemas", 14, posicionY);
            
            doc.autoTable({
                startY: posicionY + 3, 
                head: [['SERVICIO / SOLUCIÓN TÉCNICA', 'COMPATIBILIDAD', 'PRECIO (ARS)']],
                body: softwareData,
                theme: 'grid',
                headStyles: { fillColor: [23, 30, 44], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
                columnStyles: columnasDiseño,
                styles: { fontSize: 8.5, cellPadding: 2.5 }, 
                alternateRowStyles: { fillColor: [248, 250, 252] }
            });
            posicionY = doc.lastAutoTable.finalY + 10; 
        }

        if (hardwareData.length > 0) {
            doc.setTextColor(0, 150, 170);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Hardware, Limpieza y Armado", 14, posicionY);
            
            doc.autoTable({
                startY: posicionY + 3,
                head: [['SERVICIO / SOLUCIÓN TÉCNICA', 'COMPATIBILIDAD', 'PRECIO (ARS)']],
                body: hardwareData,
                theme: 'grid',
                headStyles: { fillColor: [23, 30, 44], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
                columnStyles: columnasDiseño,
                styles: { fontSize: 8.5, cellPadding: 2.5 }, 
                alternateRowStyles: { fillColor: [248, 250, 252] }
            });
        }

        doc.save('Listado_Precios_Computadoras_Lei.pdf');

        btnPdf.innerHTML = '<i class="fa-solid fa-check"></i> ¡Descarga Exitosa!';
        btnPdf.style.background = '#00ff66';
        btnPdf.style.color = '#000';
        btnPdf.style.borderColor = '#00ff66';
        
    } catch (err) {
        console.error("Error al generar PDF:", err);
        alert("Hubo un error al generar el PDF. Revisá tu conexión a internet.");
    } finally {
        setTimeout(() => {
            btnPdf.innerHTML = textoOriginal;
            btnPdf.style.pointerEvents = 'auto';
            btnPdf.style.background = '';
            btnPdf.style.color = '';
            btnPdf.style.borderColor = '';
        }, 2500);
    }
}