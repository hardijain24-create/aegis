import { initHeroCanvas } from './hero-canvas.js';
import { initGuardianVisual, initCorePulseVisual, initTechVisual } from './products.js';
document.addEventListener('DOMContentLoaded', () => {
  const PRODUCT_LINKS = {
    guardian: "https://aegis.tech/products/guardian",
    corepulse: "https://aegis.tech/products/corepulse"
  };

  const guardianCta = document.getElementById('ctaGuardian');
  const corepulseCta = document.getElementById('ctaCorePulse');
  if (guardianCta) guardianCta.setAttribute('href', PRODUCT_LINKS.guardian);
  if (corepulseCta) corepulseCta.setAttribute('href', PRODUCT_LINKS.corepulse);

  let destroyHero = null;
  let destroyGuardian = null;
  let destroyCorePulse = null;
  let destroyTech = null;

  // Custom Cursor
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    const hoverable = document.querySelectorAll('a, button, input, textarea, .system-switch-btn, .product-visual-container');
    hoverable.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // Mobile Navigation Menu Overlay
  const menuTrigger = document.querySelector('.menu-trigger');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');

  if (menuTrigger && mobileOverlay) {
    menuTrigger.addEventListener('click', () => {
      const isOpen = mobileOverlay.classList.toggle('open');
      menuTrigger.textContent = isOpen ? 'CLOSE' : 'MENU';
    });

    // Close menu when clicking link
    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
        menuTrigger.textContent = 'MENU';
      });
    });
  }

  // Client-side Router
  const views = {
    '/': document.getElementById('home-view'),
    '/products': document.getElementById('products-view')
  };

  function cleanupCanvases() {
    if (destroyHero) { destroyHero(); destroyHero = null; }
    if (destroyGuardian) { destroyGuardian(); destroyGuardian = null; }
    if (destroyCorePulse) { destroyCorePulse(); destroyCorePulse = null; }
    if (destroyTech) { destroyTech(); destroyTech = null; }
  }

  function handleRoute(path) {
    cleanupCanvases();

    // Toggle pages
    Object.keys(views).forEach(route => {
      if (views[route]) {
        if (route === path) {
          views[route].classList.add('active');
        } else {
          views[route].classList.remove('active');
        }
      }
    });

    // Active Navbar states
    document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Init canvases depending on view
    if (path === '/') {
      destroyHero = initHeroCanvas();
      destroyGuardian = initGuardianVisual();
      destroyCorePulse = initCorePulseVisual();
      destroyTech = initTechVisual();
      initHomeInteractions();
    } else if (path === '/products') {
      destroyGuardian = initGuardianVisual('productsGuardianCanvas');
      destroyCorePulse = initCorePulseVisual('productsCorepulseCanvas');
    }
    // Scroll to top
    window.scrollTo(0, 0);
    initScrollObserver();
  }

  // Set up click handlers on local anchor links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    
    // Check if it's a client router path
    if (href && (href === '/' || href === '/products')) {
      e.preventDefault();
      if (window.location.pathname !== href) {
        window.history.pushState(null, '', href);
        handleRoute(href);
      }
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    handleRoute(window.location.pathname);
  });

  // Scroll entrance reveals
  function initScrollObserver() {
    const scrollElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    scrollElements.forEach(el => observer.observe(el));
  }

  // Switch between Safety & Healthcare systems on home page
  function initHomeInteractions() {
    const safetyBtn = document.getElementById('switchSafety');
    const healthcareBtn = document.getElementById('switchHealthcare');
    const safetyView = document.getElementById('viewSafety');
    const healthcareView = document.getElementById('viewHealthcare');

    if (safetyBtn && healthcareBtn && safetyView && healthcareView) {
      safetyBtn.addEventListener('click', () => {
        safetyBtn.classList.add('active');
        healthcareBtn.classList.remove('active');
        safetyView.classList.add('active');
        healthcareView.classList.remove('active');
      });

      healthcareBtn.addEventListener('click', () => {
        healthcareBtn.classList.add('active');
        safetyBtn.classList.remove('active');
        healthcareView.classList.add('active');
        safetyView.classList.remove('active');
      });
    }
  }

  // Initial routing triggers
  const initialPath = window.location.pathname === '/products' ? '/products' : '/';
  handleRoute(initialPath);
});
