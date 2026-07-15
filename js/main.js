/**
 * main.js – Funcionalidades base de la landing page
 * - Smooth scrolling para enlaces internos
 * - Menú de navegación responsive (hamburguesa para móviles)
 * - Animaciones de entrada suaves para las secciones al hacer scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. Smooth scrolling para enlaces internos
  // ============================================================
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return; // ignorar enlaces vacíos

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      // Cerrar menú móvil si está abierto
      const nav = document.querySelector('.top-nav');
      const hamburger = document.querySelector('.hamburger');
      if (nav && nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        if (hamburger) {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }

      // Desplazamiento suave
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: targetId === '#footer' ? 'end' : 'start',
      });
    });
  });

  // ============================================================
  // 2. Menú de navegación responsive (hamburguesa)
  // ============================================================
  const topbar = document.querySelector('.topbar');
  const nav = document.querySelector('.top-nav');
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = `
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  `;

  // Insertar hamburguesa al inicio del topbar (antes del nav)
  if (topbar && nav) {
    topbar.insertBefore(hamburger, nav);

    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', (e) => {
      if (!topbar.contains(e.target) && nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    });
  }

  // ============================================================
  // 3. Animaciones de entrada suaves al hacer scroll
  // ============================================================
  const animatedSections = document.querySelectorAll('.section-block, .hero, .cta-block');

  // Crear un IntersectionObserver para detectar cuando las secciones entran en el viewport
  const observerOptions = {
    root: null,       // viewport del navegador
    rootMargin: '0px 0px -50px 0px', // activar un poco antes de que la sección esté completamente visible
    threshold: 0.1,   // al menos 10% visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        // Una vez visible, dejar de observar para no repetir la animación
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedSections.forEach(section => {
    // Añadir clase inicial para ocultar (se definirá en CSS)
    section.classList.add('section-hidden');
    observer.observe(section);
  });

  // ============================================================
  // 4. Menú lateral flotante
  // ============================================================
  const sideToggle = document.getElementById('sideMenuToggle');
  const sidePanel = document.getElementById('sideMenuPanel');
  const sideLinks = sidePanel ? sidePanel.querySelectorAll('a') : [];

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'side-menu-overlay';
  document.body.appendChild(overlay);

  function openSideMenu() {
    if (!sideToggle || !sidePanel) return;
    sidePanel.classList.add('open');
    sideToggle.classList.add('active');
    sideToggle.setAttribute('aria-expanded', 'true');
    sideToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    overlay.classList.add('visible');
  }

  function closeSideMenu() {
    if (!sideToggle || !sidePanel) return;
    sidePanel.classList.remove('open');
    sideToggle.classList.remove('active');
    sideToggle.setAttribute('aria-expanded', 'false');
    sideToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    overlay.classList.remove('visible');
  }

  if (sideToggle && sidePanel) {
    sideToggle.addEventListener('click', () => {
      if (sidePanel.classList.contains('open')) {
        closeSideMenu();
      } else {
        openSideMenu();
      }
    });

    // Cerrar al hacer clic en un enlace
    sideLinks.forEach(link => {
      link.addEventListener('click', closeSideMenu);
    });

    // Cerrar al hacer clic en el overlay
    overlay.addEventListener('click', closeSideMenu);

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidePanel.classList.contains('open')) {
        closeSideMenu();
      }
    });
  }

  // ============================================================
  // 5. Lightbox para ampliación de imágenes en tarjetas
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(imgElement) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    const card = imgElement.closest('.card');
    const heading = card ? card.querySelector('h4') : null;
    lightboxCaption.textContent = heading ? heading.textContent : imgElement.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Delegación de eventos: escuchar clicks en todo el documento
  document.addEventListener('click', (e) => {
    // Abrir lightbox si el clic fue en una imagen de tarjeta o del hero
    const cardImage = e.target.closest('.card-image, .hero-img');
    if (cardImage) {
      e.preventDefault();
      openLightbox(cardImage);
      return;
    }

    // Cerrar lightbox si el clic fue en el fondo (no en la imagen ni en el botón close)
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    }
  });

  // Botón cerrar
  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // ============================================================
  // 6. (Opcional) Añadir estilos CSS para las animaciones
  //    Se inyectan dinámicamente para no depender de un archivo externo
  // ============================================================
  const style = document.createElement('style');
  style.textContent = `
    /* Estado inicial oculto */
    .section-hidden {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    /* Estado visible */
    .section-visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Estilos del botón hamburguesa */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 1000;
    }

    .hamburger-line {
      display: block;
      width: 24px;
      height: 3px;
      background-color: #1a2a3a;
      border-radius: 2px;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .hamburger-line + .hamburger-line {
      margin-top: 5px;
    }

    /* Transformación a "X" cuando está activo */
    .hamburger.active .hamburger-line:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    .hamburger.active .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active .hamburger-line:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }

    /* Mostrar hamburguesa solo en móviles */
    @media (max-width: 768px) {
      .hamburger {
        display: flex;
      }

      .top-nav {
        display: none;
        flex-direction: column;
        width: 100%;
        background-color: #ffffff;
        border-top: 1px solid #dce4ec;
        padding: 1rem 0;
      }

      .top-nav.nav-open {
        display: flex;
      }

      .top-nav a {
        padding: 0.75rem 1.5rem;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);
});
