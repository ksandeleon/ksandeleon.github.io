// Aurora Background Interactive Effects
document.addEventListener('DOMContentLoaded', function() {
    const auroraBackground = document.querySelector('.aurora-background');
    const particlesContainer = document.querySelector('.aurora-particles');

    // Create additional dynamic particles
    function createRandomParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning and timing
        const leftPosition = Math.random() * 100;
        const animationDuration = 15 + Math.random() * 10; // 15-25s
        const animationDelay = Math.random() * 5; // 0-5s delay
        const size = 2 + Math.random() * 4; // 2-6px

        particle.style.left = `${leftPosition}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;

        // Random colors for some particles
        const colors = [
            'rgba(255, 255, 255, 0.6)',
            'rgba(100, 200, 255, 0.4)',
            'rgba(255, 100, 200, 0.4)',
            'rgba(150, 255, 100, 0.3)',
            'rgba(255, 200, 100, 0.3)'
        ];

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
        particle.style.boxShadow = `0 0 ${size * 2}px ${randomColor}`;

        particlesContainer.appendChild(particle);

        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (animationDuration + animationDelay) * 1000);
    }

    // Generate particles periodically
    function generateParticles() {
        // Create 1-3 particles at random intervals
        const numParticles = 1 + Math.floor(Math.random() * 3);

        for (let i = 0; i < numParticles; i++) {
            setTimeout(() => {
                createRandomParticle();
            }, i * 200); // Stagger creation slightly
        }
    }

    // Start particle generation
    generateParticles();
    setInterval(generateParticles, 3000 + Math.random() * 2000); // Every 3-5 seconds

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;

        // Subtly affect aurora layers based on mouse position
        const layers = document.querySelectorAll('.aurora-layer');
        layers.forEach((layer, index) => {
            const offsetX = (mouseX - 0.5) * 10 * (index + 1);
            const offsetY = (mouseY - 0.5) * 10 * (index + 1);

            layer.style.transform = `translateX(calc(-50% + ${offsetX}px)) translateY(calc(-50% + ${offsetY}px))`;
        });

        // Affect pulse element
        const pulse = document.querySelector('.aurora-pulse');
        if (pulse) {
            const pulseOffsetX = (mouseX - 0.5) * 50;
            const pulseOffsetY = (mouseY - 0.5) * 50;
            pulse.style.transform = `translate(calc(-50% + ${pulseOffsetX}px), calc(-50% + ${pulseOffsetY}px)) scale(${0.8 + mouseX * 0.4})`;
        }
    });

    // Click interaction - create burst of particles
    document.addEventListener('click', function(e) {
        const clickX = (e.clientX / window.innerWidth) * 100;
        const clickY = (e.clientY / window.innerHeight) * 100;

        // Create a burst of particles at click location
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const offsetX = (Math.random() - 0.5) * 10; // ±5% spread
            const offsetY = (Math.random() - 0.5) * 10; // ±5% spread
            const size = 3 + Math.random() * 3; // 3-6px

            particle.style.left = `${Math.max(0, Math.min(100, clickX + offsetX))}%`;
            particle.style.top = `${Math.max(0, Math.min(100, clickY + offsetY))}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = 'rgba(255, 255, 255, 0.8)';
            particle.style.boxShadow = `0 0 ${size * 3}px rgba(255, 255, 255, 0.6)`;
            particle.style.animation = `particle-burst 2s ease-out forwards`;
            particle.style.animationDelay = `${i * 0.1}s`;

            particlesContainer.appendChild(particle);

            // Remove after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2500);
        }
    });

    // Resize handler
    window.addEventListener('resize', function() {
        // Refresh particle positions on resize
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            if (particle.style.left) {
                // Regenerate position for existing particles
                particle.style.left = Math.random() * 100 + '%';
            }
        });
    });
});

// CSS for burst animation (injected via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-burst {
        0% {
            transform: scale(0) translateY(0);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) translateY(-20px);
            opacity: 0.7;
        }
        100% {
            transform: scale(0.5) translateY(-50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
