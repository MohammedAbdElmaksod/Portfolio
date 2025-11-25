// Simple and Safe Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio initialized');
    
    // Initialize all components
    initNavigation();
    initSmoothScroll();
    initCurrentYear();
    initTechOrbits();
});

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Active link highlighting
    if (navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Current year in footer
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
}

// Tech orbits animation
function initTechOrbits() {
    const orbits = document.querySelectorAll('.orbit');
    const techItems = document.querySelectorAll('.tech-item');
    
    // Set animation durations
    orbits.forEach(orbit => {
        const duration = orbit.classList.contains('orbit-1') ? 15 : 
                        orbit.classList.contains('orbit-2') ? 20 : 25;
        orbit.style.animationDuration = `${duration}s`;
    });
    
    // Add hover effects and tooltips
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });
    
    console.log('🔄 Tech orbits initialized');
}

// Add simple fade-in animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observe all sections for fade-in
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});