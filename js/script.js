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

// =========================================================================
// 4. MOTOR DE GALERÍA MIXTA (INDEX: MULTIPLES VIDEOS + FOTOS)
// =========================================================================
let trabajosPublicos = [];
let elementosMixtos = [];

function openMixedGallery(id) {
    const item = trabajosPublicos.find(t => t.id === id);
    if (!item) return;

    elementosMixtos = [];
    
    // 1. Agregar TODOS los Videos a la lista
    const videosStr = item.url_video ? item.url_video.trim() : '';
    if (videosStr !== '') {
        const videosArray = videosStr.split(',');
        videosArray.forEach(v => {
            const url = v.trim();
            if (url === '' || url.includes('instagram.com')) return; 
            
            const esMp4 = url.includes('.mp4') || url.includes('supabase.co');
            if (esMp4) {
                // Ya no pasamos link roto de placeholder, pasamos vacío para que el JS genere el cuadro
                elementosMixtos.push({ tipo: 'mp4', url: url, thumb: '' });
            } else {
                const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/);
                if (match && match[2].length === 11) {
                    elementosMixtos.push({ tipo: 'youtube', url: `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`, thumb: `https://img.youtube.com/vi/${match[2]}/default.jpg` });
                }
            }
        });
    }

    // 2. Agregar TODAS las Fotos a la lista
    const imagenesStr = item.imagenes ? item.imagenes.trim() : '';
    if (imagenesStr !== '') {
        imagenesStr.split(',').forEach(img => { 
            if (img.trim() !== '') elementosMixtos.push({ tipo: 'img', url: img.trim(), thumb: img.trim() }); 
        });
    }

    if (elementosMixtos.length === 0) return;

    const modal = document.getElementById('gallery-mixed-modal');
    const thumbsDiv = document.getElementById('mixed-thumbnails');
    
    // 3. Dibujar la tira de miniaturas abajo (¡Sin imágenes rotas!)
    thumbsDiv.innerHTML = '';
    let videoCount = 1; // Contador automático de videos
    elementosMixtos.forEach((el, index) => {
        let contenidoMiniatura = '';
        
        if (el.tipo === 'mp4') {
            // Diseño nativo para MP4 (Cuadro oscuro con ícono de Play cyan y Texto)
            contenidoMiniatura = `<div style="width: 100%; height: 100%; background: #1e293b; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #00F0FF;"><i class="fa-solid fa-play" style="font-size: 16px; margin-bottom: 4px;"></i><span style="font-size: 10px; font-weight: 700;">VIDEO ${videoCount}</span></div>`;
            videoCount++;
        } else if (el.tipo === 'youtube') {
            // Diseño para YouTube (Foto de portada con Play y Texto encima)
            contenidoMiniatura = `
                <img src="${el.thumb}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; flex-direction: column; align-items:center; justify-content:center; color:#fff;"><i class="fa-solid fa-play" style="font-size: 18px; margin-bottom: 4px;"></i><span style="font-size: 10px; font-weight: 700; color: #00F0FF;">VIDEO ${videoCount}</span></div>
            `;
            videoCount++;
        } else {
            // Diseño para Fotos normales
            contenidoMiniatura = `<img src="${el.thumb}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
        }

        thumbsDiv.innerHTML += `
            <div id="thumb-${index}" class="thumb-mix" onclick="setMixedMainView(${index})">
                ${contenidoMiniatura}
            </div>
        `;
    });

    modal.style.display = 'flex';
    setMixedMainView(0);
}

window.setMixedMainView = function(index) {
    const el = elementosMixtos[index];
    const mainView = document.getElementById('mixed-main-view');
    
    // 1. Forzamos el diseño de la caja para que no se deforme ni quede tapada
    mainView.style.cssText = "width: 100%; height: 60vh; max-height: 550px; background: #000; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 9999;";
    
    // 2. Inyectamos los videos con z-index alto y pointer-events forzado para que reciban los clics sí o sí
    if (el.tipo === 'mp4') {
        mainView.innerHTML = `<video src="${el.url}" controls autoplay playsinline style="width: 100%; height: 100%; object-fit: contain; outline: none; pointer-events: all !important; position: relative; z-index: 99999;"></video>`;
    } else if (el.tipo === 'youtube') {
        mainView.innerHTML = `<iframe src="${el.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%; outline: none; pointer-events: all !important; position: relative; z-index: 99999;"></iframe>`;
    } else {
        mainView.innerHTML = `<img src="${el.url}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px; pointer-events: all !important; position: relative; z-index: 99999;">`;
    }
    
    document.querySelectorAll('.thumb-mix').forEach(t => { t.classList.remove('active'); });
    const activeThumb = document.getElementById(`thumb-${index}`);
    if(activeThumb) { activeThumb.classList.add('active'); }
};

window.closeMixedGallery = function() {
    const modal = document.getElementById('gallery-mixed-modal');
    if (modal) modal.style.display = 'none';
    document.getElementById('mixed-main-view').innerHTML = ''; 
}

// --- RESTAURACIÓN DE EVENTOS DE CIERRE (Escape, Clic afuera, Deslizar) ---
window.addEventListener('keydown', function(event) {
    const modal = document.getElementById('gallery-mixed-modal');
    if (event.key === 'Escape' && modal && modal.style.display === 'flex') { closeMixedGallery(); }
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('gallery-mixed-modal');
    if (modal && event.target === modal) { closeMixedGallery(); }
});

const mixedModalSection = document.getElementById('gallery-mixed-modal');
let touchStartPointY = 0;
if (mixedModalSection) {
    mixedModalSection.addEventListener('touchstart', (e) => { touchStartPointY = e.touches[0].clientY; }, { passive: true });
    mixedModalSection.addEventListener('touchmove', (e) => {
        if (e.touches[0].clientY - touchStartPointY > 70) { closeMixedGallery(); }
    }, { passive: true });
}

// ==========================================
// 5. ANIMACIONES AL SCROLLEAR Y POSICION
// ==========================================
// Le devolvemos el control nativo al navegador para que recuerde el scroll en celulares al deslizar "Atrás"
if ('scrollRestoration' in history) { history.scrollRestoration = 'auto'; }

window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) { setTimeout(() => { targetSection.scrollIntoView({ behavior: 'smooth' }); }, 100); }
    }
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
        const { data, error } = await db.from('precios').select('*').eq('estado_registro', 'activo').order('id', { ascending: false });
        if (error) throw error;

        if (data.length === 0) {
            const msjVacio = '<tr><td colspan="3" style="text-align: center; color: #a0aec0; padding: 20px;">No hay precios cargados todavía. Agregalos desde tu Console.</td></tr>';
            if (tablaSoftware) tablaSoftware.innerHTML = msjVacio;
            if (tablaHardware) tablaHardware.innerHTML = msjVacio;
            return;
        }

        let htmlSoftware = ''; let htmlHardware = '';

        data.forEach(item => {
            const precioEfectivo = new Intl.NumberFormat('es-AR').format(item.precio);
            const precioTarjeta = new Intl.NumberFormat('es-AR').format(Math.round(item.precio * 1.15));
            
            const fila = `
                <tr>
                    <td>${item.servicio}</td>
                    <td>${item.compatibilidad}</td>
                    <td style="color: #22c55e; font-weight: 600;">$${precioEfectivo}</td>
                    <td style="color: #facc15; font-weight: 600;">$${precioTarjeta}</td>
                </tr>
            `;
            
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
        const { data, error } = await db.from('notebooks').select('*').eq('estado_registro', 'activo').order('id', { ascending: false });
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
            
            const mensajeWs = encodeURIComponent(`Hola Lei! Me interesa la notebook ${item.titulo} que publicaste a $${precioLindo}. ¿Tenés stock?`);

            const card = `
                <div class="product-card reveal active" style="animation-delay: ${index * 0.1}s;">
                    <a href="producto.php?id=${item.id}&cat=notebooks" style="text-decoration: none; color: inherit;">
                        <div class="prod-image-container">
                            <img src="${imagenPortada}" alt="${item.titulo}" class="main-prod-img">
                            <div class="img-overlay"><i class="fa-solid fa-eye"></i><span>Ver Detalles</span></div>
                        </div>
                        <h3>${item.titulo}</h3>
                    </a>
                    <ul style="text-align: left; color: #a0aec0; font-size: 0.95rem; margin-bottom: 25px; list-style: none; width: 100%; padding: 0 10px;">
                        <li style="margin-bottom: 8px;"><i class="fa-solid fa-microchip" style="width: 25px; color: #00F0FF;"></i> ${item.procesador}</li>
                        <li style="margin-bottom: 8px;"><i class="fa-solid fa-memory" style="width: 25px; color: #00F0FF;"></i> ${item.ram}</li>
                        <li style="margin-bottom: 8px;"><i class="fa-solid fa-hard-drive" style="width: 25px; color: #00F0FF;"></i> ${item.almacenamiento}</li>
                        <li><i class="fa-solid fa-battery-full" style="width: 25px; color: #00F0FF;"></i> ${item.bateria}</li>
                    </ul>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 20px;">
                        $${precioLindo} <span style="font-size: 0.8rem; font-weight: 400; color: #00ff66;">ARS</span>
                    </div>
                    <a href="producto.php?id=${item.id}&cat=notebooks" class="btn-primary" style="width: 100%; text-align: center; box-sizing: border-box;">
                        Ver Detalles
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
        cargarMemoriasDinamicas();
        cargarAccesoriosDinamicos();
        cargarVideosDinamicos();
    }
});


// =========================================================================
// C) CARGAR MEMORIAS EN LA TIENDA (CON FILTRO)
// =========================================================================
let memoriasPublicas = [];

async function cargarMemoriasDinamicas() {
    const grid = document.getElementById('grid-memorias');
    if (!grid) return; 

    try {
        const { data, error } = await db.from('memorias').select('*').eq('estado_registro', 'activo').order('id', { ascending: false });
        if (error) throw error;

        memoriasPublicas = data || [];
        renderizarMemoriasPublicas('TODOS'); // Dibuja todo al principio
    } catch (err) {
        console.error("Error al traer memorias:", err);
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #ff4a4a; padding: 40px;">Hubo un error al cargar el stock.</div>';
    }
}

function renderizarMemoriasPublicas(filtro) {
    const grid = document.getElementById('grid-memorias');
    if (!grid) return;

    const datosFiltrados = memoriasPublicas.filter(item => {
        if (filtro === 'TODOS') return true;
        return item.tipo === filtro;
    });

    if (datosFiltrados.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #a0aec0; padding: 40px; font-size: 18px;">No hay stock para esta categoría por el momento. ¡Consultanos por WhatsApp!</div>';
        return;
    }

    grid.innerHTML = ''; 

    datosFiltrados.forEach((item, index) => {
        const precioLindo = new Intl.NumberFormat('es-AR').format(item.precio);
        let imagenPortada = 'https://via.placeholder.com/1280x960/0b0f17/00F0FF?text=Componente';
        if (item.imagen && item.imagen.trim() !== '') { imagenPortada = item.imagen.split(',')[0]; }
        
        const mensajeWs = encodeURIComponent("Hola Lei! Me interesa el componente " + item.titulo + " (" + item.capacidad + ") que publicaste a $" + precioLindo + ". Tenes stock?");

        let listaCaracteristicas = '';
        if (item.tipo === 'Memoria RAM') {
            listaCaracteristicas = `
                <li style="margin-bottom: 8px;"><i class="fa-solid fa-memory" style="width: 25px; color: #00F0FF;"></i> Capacidad: ${item.capacidad}</li>
                <li style="margin-bottom: 8px;"><i class="fa-solid fa-bolt" style="width: 25px; color: #00F0FF;"></i> Frecuencia: ${item.detalle_1}</li>
                <li style="margin-bottom: 8px;"><i class="fa-solid fa-desktop" style="width: 25px; color: #00F0FF;"></i> Formato: ${item.detalle_2}</li>
                <li><i class="fa-solid fa-circle-check" style="width: 25px; color: #00F0FF;"></i> Estado: ${item.estado}</li>
            `;
        } else {
            listaCaracteristicas = `
                <li style="margin-bottom: 8px;"><i class="fa-solid fa-hard-drive" style="width: 25px; color: #00F0FF;"></i> Capacidad: ${item.capacidad}</li>
                <li style="margin-bottom: 8px;"><i class="fa-solid fa-microchip" style="width: 25px; color: #00F0FF;"></i> Tipo: ${item.detalle_1}</li>
                <li style="margin-bottom: 8px;"><i class="fa-solid fa-rocket" style="width: 25px; color: #00F0FF;"></i> Velocidad: ${item.detalle_2}</li>
                <li><i class="fa-solid fa-circle-check" style="width: 25px; color: #00F0FF;"></i> Instalación: ${item.estado}</li>
            `;
        }

        const card = `
            <div class="product-card reveal active" style="animation-delay: ${index * 0.05}s;">
                <a href="producto.php?id=${item.id}&cat=memorias" style="text-decoration: none; color: inherit;">
                    <div class="prod-image-container">
                        <img src="${imagenPortada}" alt="${item.titulo}" class="main-prod-img">
                        <div class="img-overlay"><i class="fa-solid fa-eye"></i><span>Ver Detalles</span></div>
                    </div>
                    <h3>${item.titulo}</h3>
                </a>
                <ul style="text-align: left; color: #a0aec0; font-size: 0.95rem; margin-bottom: 25px; list-style: none; width: 100%; padding: 0 10px;">
                    ${listaCaracteristicas}
                </ul>
                <div style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 20px;">
                    $${precioLindo} <span style="font-size: 0.8rem; font-weight: 400; color: #00ff66;">ARS</span>
                </div>
                <a href="producto.php?id=${item.id}&cat=memorias" class="btn-primary" style="width: 100%; text-align: center; box-sizing: border-box;">
                    Ver Detalles
                </a>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function filtrarMemoriasPublicas() {
    const filtro = document.getElementById('filtro-memorias-publico').value;
    renderizarMemoriasPublicas(filtro);
}

// =========================================================================
// D) CARGAR ACCESORIOS EN LA TIENDA (CON FILTRO)
// =========================================================================
let accesoriosPublicos = [];

async function cargarAccesoriosDinamicos() {
    const grid = document.getElementById('grid-accesorios');
    if (!grid) return; 

    try {
        const { data, error } = await db.from('accesorios').select('*').eq('estado_registro', 'activo').order('id', { ascending: false });
        if (error) throw error;

        accesoriosPublicos = data || [];
        renderizarAccesoriosPublicos('TODOS');
    } catch (err) {
        console.error("Error al traer accesorios:", err);
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #ff4a4a; padding: 40px;">Hubo un error al cargar el stock.</div>';
    }
}

function renderizarAccesoriosPublicos(filtro) {
    const grid = document.getElementById('grid-accesorios');
    if (!grid) return;

    const datosFiltrados = accesoriosPublicos.filter(item => {
        if (filtro === 'TODOS') return true;
        return item.tipo === filtro;
    });

    if (datosFiltrados.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #a0aec0; padding: 40px; font-size: 18px;">No hay stock para esta categoría por el momento. ¡Consultanos por WhatsApp!</div>';
        return;
    }

    grid.innerHTML = ''; 

    datosFiltrados.forEach((item, index) => {
        const precioLindo = new Intl.NumberFormat('es-AR').format(item.precio);
        let imagenPortada = 'https://via.placeholder.com/1280x960/0b0f17/00F0FF?text=Accesorio';
        if (item.imagen && item.imagen.trim() !== '') { imagenPortada = item.imagen.split(',')[0]; }
        
        const mensajeWs = encodeURIComponent("Hola Lei! Me interesa el accesorio " + item.titulo + " que publicaste a $" + precioLindo + ". Tenes stock?");

        let listaCaracteristicas = `
            <li style="margin-bottom: 8px;"><i class="fa-solid fa-tag" style="width: 25px; color: #00F0FF;"></i> Tipo: ${item.tipo}</li>
            <li style="margin-bottom: 8px;"><i class="fa-solid fa-circle-info" style="width: 25px; color: #00F0FF;"></i> ${item.detalle_1}</li>
            <li style="margin-bottom: 8px;"><i class="fa-solid fa-star" style="width: 25px; color: #00F0FF;"></i> ${item.detalle_2}</li>
            <li><i class="fa-solid fa-circle-check" style="width: 25px; color: #00F0FF;"></i> Estado: ${item.estado}</li>
        `;

        const card = `
            <div class="product-card reveal active" style="animation-delay: ${index * 0.05}s;">
                <a href="producto.php?id=${item.id}&cat=accesorios" style="text-decoration: none; color: inherit;">
                    <div class="prod-image-container">
                        <img src="${imagenPortada}" alt="${item.titulo}" class="main-prod-img">
                        <div class="img-overlay"><i class="fa-solid fa-eye"></i><span>Ver Detalles</span></div>
                    </div>
                    <h3>${item.titulo}</h3>
                </a>
                <ul style="text-align: left; color: #a0aec0; font-size: 0.95rem; margin-bottom: 25px; list-style: none; width: 100%; padding: 0 10px;">
                    ${listaCaracteristicas}
                </ul>
                <div style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 20px;">
                    $${precioLindo} <span style="font-size: 0.8rem; font-weight: 400; color: #00ff66;">ARS</span>
                </div>
                <a href="producto.php?id=${item.id}&cat=accesorios" class="btn-primary" style="width: 100%; text-align: center; box-sizing: border-box;">
                    Ver Detalles
                </a>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function filtrarAccesoriosPublicos() {
    const filtro = document.getElementById('filtro-accesorios-publico').value;
    renderizarAccesoriosPublicos(filtro);
}

// =========================================================================
// E) CARGAR TRABAJOS EN EL INDEX (CON LÓGICA DE PORTADA AUTOMÁTICA)
// =========================================================================
async function cargarVideosDinamicos() {
    const grid = document.getElementById('grid-videos');
    if (!grid) return; 

    try {
        const { data, error } = await db.from('videos').select('*').eq('estado_registro', 'activo').order('id', { ascending: false });
        if (error) throw error;
        trabajosPublicos = data || [];

        if (trabajosPublicos.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #a0aec0; padding: 40px; font-size: 18px;">Próximamente nuevos trabajos.</div>';
            return;
        }

        grid.innerHTML = ''; 

        trabajosPublicos.forEach((item, index) => {
            const videosArray = item.url_video ? item.url_video.split(',').map(v => v.trim()).filter(v => v !== '') : [];
            const imagenesArray = item.imagenes ? item.imagenes.split(',').map(i => i.trim()).filter(i => i !== '') : [];
            
            const totalContenido = videosArray.length + imagenesArray.length;
            
            let fondoVideo = '';
            let videoId = null;
            let esMp4 = false;
            let primerVideoUrl = videosArray.length > 0 ? videosArray[0] : '';
            
            if (primerVideoUrl !== '') {
                esMp4 = primerVideoUrl.includes('.mp4') || primerVideoUrl.includes('supabase.co');
                if (!esMp4) {
                    try {
                        const urlObj = new URL(primerVideoUrl);
                        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                            if (urlObj.searchParams.has('v')) videoId = urlObj.searchParams.get('v');
                            else if (urlObj.pathname.includes('/shorts/')) videoId = urlObj.pathname.split('/shorts/')[1];
                            else if (urlObj.pathname.includes('/embed/')) videoId = urlObj.pathname.split('/embed/')[1];
                            else if (urlObj.hostname === 'youtu.be') videoId = urlObj.pathname.substring(1);
                            if (videoId) videoId = videoId.split('?')[0].split('&')[0].split('/')[0];
                        }
                    } catch(e) {}
                }
                
                if (esMp4) {
                    fondoVideo = `<video src="${primerVideoUrl}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; pointer-events: none;"></video>`;
                } else if (videoId) {
                    fondoVideo = `<img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">`;
                } else if (primerVideoUrl.includes('instagram.com')) {
                    fondoVideo = `<div style="width:100%; height:100%; background: radial-gradient(circle, #1e293b 0%, #0b0f17 100%); display:flex; align-items:center; justify-content:center; position: absolute; top: 0; left: 0;"><i class="fa-brands fa-instagram" style="font-size: 60px; color: #E1306C; opacity: 0.9;"></i></div>`;
                } else {
                    fondoVideo = `<div style="width:100%; height:100%; background: #1e293b; display:flex; align-items:center; justify-content:center; position: absolute; top: 0; left: 0;"><i class="fa-solid fa-link" style="font-size: 50px; color: rgba(255, 255, 255, 0.1);"></i></div>`;
                }
            } else if (imagenesArray.length > 0) {
                fondoVideo = `<img src="${imagenesArray[0]}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">`;
            }

            let txtBadge = '';
            if (videosArray.length > 0 && imagenesArray.length > 0) txtBadge = `<i class="fa-solid fa-layer-group"></i> ${totalContenido} ítems`;
            else if (videosArray.length > 1) txtBadge = `<i class="fa-solid fa-video"></i> ${videosArray.length} videos`;
            else if (imagenesArray.length > 0) txtBadge = `<i class="fa-solid fa-images"></i> ${imagenesArray.length} fotos`;

            let badgeHTML = txtBadge !== '' ? `<div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #00F0FF; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; z-index: 2;">${txtBadge}</div>` : '';
            
            let esModal = (esMp4 || videoId || imagenesArray.length > 0);
            let accionClick = esModal ? `onclick="openMixedGallery(${item.id})"` : `onclick="window.open('${primerVideoUrl}', '_blank')"`;
            
            let txtBoton = totalContenido > 1 ? 'Ver Galería' : (esModal && videosArray.length > 0 ? 'Ver Video' : 'Abrir Enlace');
            let iconBoton = totalContenido > 1 ? 'fa-images' : (esModal && videosArray.length > 0 ? 'fa-play' : 'fa-arrow-up-right-from-square');

            const card = `
                <div class="video-card reveal active" style="animation-delay: ${index * 0.1}s;">
                    <div class="video-wrapper" ${accionClick} style="position: relative; cursor: pointer;">
                        ${fondoVideo}
                        ${badgeHTML}
                        <div class="img-overlay">
                            <i class="fa-solid ${iconBoton}"></i>
                            <span>${txtBoton}</span>
                        </div>
                    </div>
                    <div class="video-info">
                        <h4>${item.titulo}</h4>
                        <p>${item.descripcion}</p>
                    </div>
                </div>
            `;
            grid.innerHTML += card;
        });

    } catch (err) {
        console.error("Error al traer videos:", err);
    }
}

// =========================================================================
// 7. GENERADOR AUTOMÁTICO DE PDF (CORREGIDO - 4 COLUMNAS)
// =========================================================================
async function generarPDF(event) {
    event.preventDefault(); 
    
    const btnPdf = event.currentTarget;
    const textoOriginal = btnPdf.innerHTML;
    btnPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF...';
    btnPdf.style.pointerEvents = 'none';

    try {
        const { data, error } = await db.from('precios').select('*').eq('estado_registro', 'activo').order('id', { ascending: false });
        if (error) throw error;

        // Armamos la data con las 4 columnas ya calculadas
        const softwareData = data.filter(item => item.categoria !== 'hardware').map(item => [
            item.servicio, 
            item.compatibilidad, 
            '$' + new Intl.NumberFormat('es-AR').format(item.precio),
            '$' + new Intl.NumberFormat('es-AR').format(Math.round(item.precio * 1.15))
        ]);
        const hardwareData = data.filter(item => item.categoria === 'hardware').map(item => [
            item.servicio, 
            item.compatibilidad, 
            '$' + new Intl.NumberFormat('es-AR').format(item.precio),
            '$' + new Intl.NumberFormat('es-AR').format(Math.round(item.precio * 1.15))
        ]);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setProperties({ title: 'Listado_Precios_Computadoras_Lei.pdf', author: 'Computadoras Lei' });

        // Dibujo del Logo
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

        // Textos del Cabezal
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
        
        // Estructura de anchos y colores de las 4 columnas
        const columnasDiseño = {
            0: { halign: 'left', cellWidth: 80 },
            1: { halign: 'left', cellWidth: 42 },
            2: { halign: 'center', cellWidth: 30, fontStyle: 'bold', textColor: [34, 197, 94] },
            3: { halign: 'center', cellWidth: 30, fontStyle: 'bold', textColor: [200, 160, 0] }
        };

        if (softwareData.length > 0) {
            doc.setTextColor(0, 150, 170); 
            doc.setFontSize(12); 
            doc.setFont("helvetica", "bold");
            doc.text("Software y Sistemas", 14, posicionY);
            
            doc.autoTable({
                startY: posicionY + 3, 
                head: [['SERVICIO / SOLUCIÓN TÉCNICA', 'COMPATIBILIDAD', 'EFECTIVO / TRANSF.', 'TARJETA (+15%)']],
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
                head: [['SERVICIO / SOLUCIÓN TÉCNICA', 'COMPATIBILIDAD', 'EFECTIVO / TRANSF.', 'TARJETA (+15%)']],
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

// ==========================================
// 8. MODAL DE MEDIOS DE PAGO
// ==========================================
function abrirModalPagos() {
    const modal = document.getElementById('modal-pagos');
    if(modal) modal.style.display = 'flex';
}

function cerrarModalPagos() {
    const modal = document.getElementById('modal-pagos');
    if(modal) modal.style.display = 'none';
}

// Cerrar el modal tocando afuera
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal-pagos');
    if (event.target === modal) {
        cerrarModalPagos();
    }
});

// ==========================================
// 9. NAVEGACIÓN LIMPIA (SIN '#' EN LA URL)
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return; // Evita errores si hay enlaces vacíos
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault(); // Bloquea la acción normal que escribe el '#' en la barra
            
            // Hace el deslizamiento suave hacia la sección
            targetElement.scrollIntoView({ behavior: 'smooth' });
            
            // Limpia la barra de direcciones para que quede inmaculada
            history.replaceState(null, null, window.location.pathname);
        }
    });
});