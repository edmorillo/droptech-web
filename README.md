# 💻 Computadoras Lei - Soporte Técnico Premium & Armado de PC

¡Bienvenido al repositorio oficial de **Computadoras Lei**! Esta es una landing page moderna, optimizada e interactiva desarrollada para un taller especializado en soporte técnico de software, mantenimiento profundo de hardware y ensamblado de PCs de alta gama en Lugano, CABA, Argentina.

Probalo en vivo acá: [computadoraslei.vercel.app](https://computadoraslei.vercel.app)

---

## 🚀 Características del Proyecto

El sitio fue diseñado desde cero enfocándose en una experiencia de usuario (UX) fluida, rápida y con una estética *Dark/Gamer* de alto impacto.

* **Diseño Premium e Interactivo:** Micro-interacciones con efectos de brillo neón cian (`#00F0FF`) y elevación 3D al pasar el mouse (*hover*) en todas las tarjetas de servicios, productos, botones y filas de las tablas.
* **Interfaz 100% Responsiva:** Adaptabilidad absoluta para una visualización perfecta en computadoras, tablets y teléfonos celulares.
* **Filtros Dinámicos de Precios:** Sistema de pestañas interactivas programado en JavaScript para alternar al toque entre servicios de *Software* y *Hardware*.
* **Descarga de PDF Optimizada:** Botón de descarga automatizada para el listado de precios completo, corregido con rutas estrictas (*case-sensitive*) para servidores Linux de producción.
* **Identidad de Marca Unificada:** Favicon SVG personalizado insertado directamente en el `<head>` y sección de marcas especializadas (Asus, Dell, HP, etc.) utilizando logos vectoriales fluidos.
* **Estructura de Conversión Comercial:** Secciones estratégicas de *"¿Por qué elegirnos?"*, *"Medios de Pago"* detallados con políticas de recargo y canales de contacto listos para producción.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5** - Estructuración semántica y accesible.
* **CSS3** - Estilos personalizados, variables globales, grillas dinámicas (Flexbox/Grid) y animaciones fluidas.
* **JavaScript (Vanilla)** - Lógica para el manejo del menú *mobile* y el control de pestañas de la tabla de precios.
* **Font Awesome** - Librería tipográfica para la iconografía gamer y tecnológica.
* **Simple Icons** - Integración de logos oficiales vectoriales desde la nube.
* **Vercel** - Plataforma de despliegue continuo (CI/CD) y hosting de alta velocidad.
* **Git & GitHub** - Control de versiones profesional.

---

## 🛡️ Flujo de Trabajo y Entorno Seguro (Git Flow)

Para este proyecto se implementó una estrategia de ramificación profesional para proteger el entorno de producción de posibles errores de código durante el desarrollo:

1.  **Rama `dev` (Desarrollo):** El entorno seguro de trabajo. Cada cambio, prueba estética o actualización de código se empuja primero aquí. Vercel genera de forma automática un enlace privado de **Preview** protegido por credenciales de GitHub para testear en dispositivos móviles de manera aislada.
2.  **Rama `main` (Producción):** La rama sagrada. Solo contiene código testeado y aprobado al 100%. Los cambios estables se fusionan mediante un `merge` desde `dev` y se suben a `main`, impactando instantáneamente en la web comercial de cara al cliente.

### Comandos diarios utilizados:
```bash
# Trabajando y subiendo a desarrollo
git checkout dev
git add .
git commit -m "feat: descripción del cambio visual"
git push

# Pasando los cambios limpios a producción
git checkout main
git merge dev
git push origin main
git checkout dev