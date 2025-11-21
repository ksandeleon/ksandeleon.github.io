// Dot navigation functionality
const sections = document.querySelectorAll('body > div[id]');
const navLinks = document.querySelectorAll('.dot-link');

let isScrolling = false;
let currentSectionIndex = 0;

// Update active dot based on scroll position
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
