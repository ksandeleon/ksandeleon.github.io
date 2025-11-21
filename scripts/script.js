// ===== PARTICLE NETWORK ANIMATION =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};

// Canvas setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Track mouse position
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 2; // Increased from 1.5 + 0.5 to 2 + 2 (2-4px)
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw(opacity) {
        ctx.fillStyle = `rgba(80, 80, 80, ${opacity * 0.8})`; // Darker and more visible
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 12000); // More particles (was 15000)
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

// Connect particles
function connectParticles(opacity) {
    const maxDistance = 150; // Increased from 120 for more connections

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const lineOpacity = (1 - distance / maxDistance) * opacity * 0.4; // Increased from 0.3
                ctx.strokeStyle = `rgba(80, 80, 80, ${lineOpacity})`;
                ctx.lineWidth = 1; // Increased from 0.5
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x != null && mouse.y != null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const lineOpacity = (1 - distance / mouse.radius) * opacity * 0.7; // Increased from 0.5
                ctx.strokeStyle = `rgba(80, 80, 80, ${lineOpacity})`;
                ctx.lineWidth = 1.5; // Increased from 1
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    // Draw mouse as a node
    if (mouse.x != null && mouse.y != null) {
        ctx.fillStyle = `rgba(80, 80, 80, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2); // Increased from 2 to 3
        ctx.fill();
    }
}

// Get particle opacity based on active section
function getParticleOpacity() {
    const activeSections = document.querySelectorAll('.section.active');
    if (activeSections.length === 0) return 1;

    let totalOpacity = 0;
    activeSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate how much of the section is visible
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / viewportHeight;

        // Particles fade out on active (black) sections
        totalOpacity += (1 - visibilityRatio);
    });

    return Math.max(0, Math.min(1, totalOpacity));
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const opacity = getParticleOpacity();

    particles.forEach(particle => {
        particle.update();
        particle.draw(opacity);
    });

    connectParticles(opacity);
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SECTION NAVIGATION =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.dot-link');

let isScrolling = false;
let currentSectionIndex = 0;

// Update dot colors based on background
function updateDotColors() {
    navLinks.forEach(link => {
        const rect = link.getBoundingClientRect();
        const dotCenterY = rect.top + rect.height / 2;

        // Check which section the dot is over
        sections.forEach(section => {
            const sectionRect = section.getBoundingClientRect();

            if (dotCenterY >= sectionRect.top && dotCenterY <= sectionRect.bottom) {
                // Dot is over this section
                if (section.classList.contains('active')) {
                    // Section is black, use white dots
                    link.classList.remove('on-white');
                } else {
                    // Section is white, use black dots
                    link.classList.add('on-white');
                }
            }
        });
    });
}

// Update active section and dot based on scroll position
function updateActiveDot() {
    let newSectionIndex = 0;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - sectionHeight / 3) {
            newSectionIndex = index;
        }
    });

    if (newSectionIndex !== currentSectionIndex) {
        const oldIndex = currentSectionIndex;
        currentSectionIndex = newSectionIndex;

        // Update section backgrounds
        sections.forEach((section, index) => {
            if (index === currentSectionIndex) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        navLinks.forEach((link, index) => {
            // Light up all dots from 0 to current section index
            if (index <= currentSectionIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

            // Pop animation only on the newly reached section
            if (index === currentSectionIndex && newSectionIndex > oldIndex) {
                link.classList.add('pop');
                setTimeout(() => {
                    link.classList.remove('pop');
                }, 400);
            }
        });
    }

    // Update dot colors after section changes
    updateDotColors();
}

// Smooth scroll on dot click
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-section');
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Listen to scroll events
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            updateActiveDot();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Initialize on page load
updateActiveDot();
updateDotColors();
