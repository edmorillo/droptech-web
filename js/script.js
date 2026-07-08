console.log("DropTech iniciado correctamente de manera profesional.");

// Código para controlar el menú hamburguesa en celulares
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        
        // Cambia el icono de barras a una 'X' cuando está activo
        const icon = menuToggle.querySelector("i");
        if (navMenu.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Cerrar el menú automáticamente al hacer clic en un enlace (en móviles)
    const menuLinks = document.querySelectorAll(".menu a");
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                menuToggle.querySelector("i").className = "fa-solid fa-bars";
            }
        });
    });
});