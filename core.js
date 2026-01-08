class KOOPodcastApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupObservers();
        this.setupKeyboardNavigation();
        this.setupSmoothScroll();
        this.setupCardInteractions();
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const menuIcon = document.getElementById('menuIcon');

        if (!menuToggle || !navMenu || !menuIcon) return;

        const toggleMenu = () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuIcon.textContent = isExpanded ? '☰' : '✕';
            
            // Bloquear scroll cuando el menú está abierto
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        };

        menuToggle.addEventListener('click', toggleMenu);

        // Cerrar menú al hacer clic en enlaces
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const menuIcon = document.getElementById('menuIcon');
        
        if (navMenu) navMenu.classList.remove('active');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        if (menuIcon) menuIcon.textContent = '☰';
        document.body.style.overflow = '';
    }

    setupObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observar todas las secciones y tarjetas
        document.querySelectorAll('section, .podcast-card, .platform-card, .feature').forEach(el => {
            observer.observe(el);
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const navMenu = document.getElementById('navMenu');
            
            // Escape para cerrar menú
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
            
            // Tab para navegación mejorada
            if (e.key === 'Tab' && navMenu && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupCardInteractions() {
        // Efecto de hover para tarjetas en dispositivos táctiles
        document.querySelectorAll('.podcast-card, .platform-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touched');
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.classList.remove('touched');
            }, { passive: true });
        });
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.koopodcastApp = new KOOPodcastApp();
    
    // Prevenir zoom en dispositivos móviles al hacer doble toque
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});