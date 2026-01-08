class KOOPodcastApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupObservers();
        this.setupKeyboardNavigation();
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
        };

        menuToggle.addEventListener('click', toggleMenu);

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuIcon.textContent = '☰';
            });
        });
    }

    setupObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(section => observer.observe(section));
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const navMenu = document.getElementById('navMenu');
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.koopodcastApp = new KOOPodcastApp();
});