import { nintendo3DS } from './main.js';

let animationInProgress = false;

// Easing function for smooth animation
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Open the 3DS animation
function open3DS() {
    if (animationInProgress || !nintendo3DS.topHalf) return;
    
    animationInProgress = true;
    const duration = 1200; // milliseconds
    const startRotation = 0;
    const endRotation = Math.PI * 0.65; // ~117 degrees
    const startTime = Date.now();
    
    // Show navigation links with delay
    setTimeout(() => {
        const navLinks = document.getElementById('nav-links');
        navLinks.classList.remove('hidden');
        navLinks.classList.add('visible');
    }, 800);
    
    function animateOpen() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        // Rotate the top half around the hinge
        nintendo3DS.topHalf.rotation.x = startRotation + (endRotation - startRotation) * easedProgress;
        
        if (progress < 1) {
            requestAnimationFrame(animateOpen);
        } else {
            animationInProgress = false;
        }
    }
    
    animateOpen();
}

// Close the 3DS animation
function close3DS() {
    if (animationInProgress || !nintendo3DS.topHalf) return;
    
    animationInProgress = true;
    const duration = 1000; // milliseconds
    const startRotation = nintendo3DS.topHalf.rotation.x;
    const endRotation = 0;
    const startTime = Date.now();
    
    // Hide navigation links immediately
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.remove('visible');
    navLinks.classList.add('hidden');
    
    function animateClose() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        // Rotate the top half back to closed position
        nintendo3DS.topHalf.rotation.x = startRotation + (endRotation - startRotation) * easedProgress;
        
        if (progress < 1) {
            requestAnimationFrame(animateClose);
        } else {
            animationInProgress = false;
            
            // Re-enable floating animation
            if (nintendo3DS.group) {
                nintendo3DS.group.rotation.y = Math.PI / 6;
            }
        }
    }
    
    animateClose();
}

// Pulse animation for navigation links
function pulseNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        setTimeout(() => {
            link.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                link.style.animation = '';
            }, 500);
        }, index * 100);
    });
}

// Event listeners
window.addEventListener('3ds-open', () => {
    open3DS();
    setTimeout(pulseNavLinks, 900);
});

document.getElementById('close-3ds')?.addEventListener('click', (e) => {
    e.stopPropagation();
    close3DS();
});

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// Export functions for external use
export { open3DS, close3DS, pulseNavLinks };

