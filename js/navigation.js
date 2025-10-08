import { close3DS } from './animations.js';

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Close the 3DS first
    close3DS();
    
    // Wait for close animation, then scroll
    setTimeout(() => {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 500);
}

// Handle navigation link clicks
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            if (section) {
                scrollToSection(section);
                
                // Add visual feedback
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 200);
            }
        });
    });
    
    // Scroll indicator in hero section
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            scrollToSection('about');
        });
        scrollIndicator.style.cursor = 'pointer';
    }
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// Parallax effect for hero section
function initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroContent = document.querySelector('.hero-content');
                
                if (heroContent && scrolled < window.innerHeight) {
                    const opacity = 1 - (scrolled / window.innerHeight);
                    const translateY = scrolled * 0.5;
                    heroContent.style.opacity = opacity;
                    heroContent.style.transform = `translateX(-50%) translateY(${translateY}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Hide scroll indicator after scrolling
function initScrollIndicatorHide() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// Active section tracking (optional - for future nav highlighting)
function initActiveSectionTracking() {
    const sections = document.querySelectorAll('.content-section');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                // Could be used to highlight active nav item in future
                console.log('Active section:', sectionId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Keyboard navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close 3DS
        if (e.key === 'Escape') {
            const navLinks = document.getElementById('nav-links');
            if (navLinks && navLinks.classList.contains('visible')) {
                close3DS();
            }
        }
    });
}

// Initialize all navigation features
function init() {
    initNavigation();
    initScrollAnimations();
    initParallax();
    initScrollIndicatorHide();
    initActiveSectionTracking();
    initKeyboardNav();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export { scrollToSection };

