// ===== TYPING ANIMATION =====
const typingText = document.querySelector('.typing-text');
const words = [
    'History',
    'Machine Learning',
    'Web Development',
    'Data Science',
    'Philosophy',
    'Technology'
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        // Remove characters
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 75;
    } else {
        // Add characters
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }

    // Check if word is complete
    if (!isDeleting && charIndex === currentWord.length) {
        // Pause at end of word
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
});

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

// ===== PHOTO MODAL =====
const photoBg = document.querySelector('.intro-photo-bg, .intro-photo');
const photoModal = document.getElementById('photo-modal');
const photoModalBg = document.querySelector('.photo-modal-bg');
const photoModalImg = document.querySelector('.photo-modal-img');

if (photoBg && photoModal) {
    photoBg.style.cursor = 'pointer';
    photoBg.addEventListener('click', () => {
        photoModal.classList.add('active');
    });
}

if (photoModalBg && photoModalImg) {
    photoModalBg.addEventListener('click', () => {
        photoModal.classList.remove('active');
    });
    photoModalImg.addEventListener('click', () => {
        photoModal.classList.remove('active');
    });
}
