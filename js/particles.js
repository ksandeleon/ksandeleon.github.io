// ===== PARTICLE NETWORK ANIMATION =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};

// Detect if device is mobile
const isMobile = () => window.innerWidth <= 768;
const isVerySmall = () => window.innerWidth <= 480;

// Get responsive particle settings
function getParticleSettings() {
    if (isVerySmall()) {
        return {
            density: 16000, // Fewer particles
            minRadius: 2.5,
            maxRadius: 4, // Smaller particles (1-2px)
            speed: 0.35,
            maxDistance: 120, // Shorter connections
            lineWidth: 1,
            lineOpacity: 0.35,
            mouseRadius: 120,
            mouseLineWidth: 1.2,
            mouseLineOpacity: 0.6
        };
    } else if (isMobile()) {
        return {
            density: 12000,
            minRadius: 3,
            maxRadius: 5, // Medium particles (1.5-2.5px)
            speed: 0.45,
            maxDistance: 140,
            lineWidth: 1.2,
            lineOpacity: 0.4,
            mouseRadius: 140,
            mouseLineWidth: 1.5,
            mouseLineOpacity: 0.7
        };
    } else {
        // Desktop
        return {
            density: 12000,
            minRadius: 2,
            maxRadius: 4, // Large particles (2-4px)
            speed: 0.5,
            maxDistance: 150,
            lineWidth: 1,
            lineOpacity: 0.4,
            mouseRadius: 150,
            mouseLineWidth: 1.5,
            mouseLineOpacity: 0.7
        };
    }
}

let settings = getParticleSettings();

// Canvas setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    settings = getParticleSettings(); // Update settings on resize
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
        this.vx = (Math.random() - 0.5) * settings.speed;
        this.vy = (Math.random() - 0.5) * settings.speed;
        this.radius = Math.random() * (settings.maxRadius - settings.minRadius) + settings.minRadius;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw(opacity) {
        ctx.fillStyle = `rgba(80, 80, 80, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    settings = getParticleSettings(); // Update settings
    const particleCount = Math.floor((canvas.width * canvas.height) / settings.density);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

// Connect particles
function connectParticles(opacity) {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < settings.maxDistance) {
                const lineOpacity = (1 - distance / settings.maxDistance) * opacity * settings.lineOpacity;
                ctx.strokeStyle = `rgba(80, 80, 80, ${lineOpacity})`;
                ctx.lineWidth = settings.lineWidth;
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

            if (distance < settings.mouseRadius) {
                const lineOpacity = (1 - distance / settings.mouseRadius) * opacity * settings.mouseLineOpacity;
                ctx.strokeStyle = `rgba(80, 80, 80, ${lineOpacity})`;
                ctx.lineWidth = settings.mouseLineWidth;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    // Draw mouse as a node
    if (mouse.x != null && mouse.y != null) {
        const mouseSize = isVerySmall() ? 2 : (isMobile() ? 2.5 : 3);
        ctx.fillStyle = `rgba(80, 80, 80, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseSize, 0, Math.PI * 2);
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
