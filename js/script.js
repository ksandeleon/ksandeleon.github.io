// ===== TYPING ANIMATION =====
const typingText = document.querySelector('.typing-text');
const words = [
    'Machine Learning',
    'Cybersecurity',
    'Data Science',
    'Programming',
    'Deep Learning',
    'App Development',
    'Web Development',
    'Game Development',
    'UI/UX Design',
    'Robotics',
    'Philosophy',
    'Open Source',
    'Linux',
    'History',
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

// ===== GITHUB STATS FETCHER =====
async function fetchGitHubStats() {
    const statElements = document.querySelectorAll('[data-repo]');

    // Group by repo to minimize API calls
    const repos = new Set();
    statElements.forEach(el => repos.add(el.getAttribute('data-repo')));

    for (const repo of repos) {
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            if (response.ok) {
                const data = await response.json();

                // Update stars
                const starsElements = document.querySelectorAll(`[data-repo="${repo}"][data-stat="stars"]`);
                starsElements.forEach(el => {
                    el.textContent = data.stargazers_count;
                });

                // Update forks
                const forksElements = document.querySelectorAll(`[data-repo="${repo}"][data-stat="forks"]`);
                forksElements.forEach(el => {
                    el.textContent = data.forks_count;
                });
            }
        } catch (error) {
            console.error(`Error fetching stats for ${repo}:`, error);
        }
    }
}

// Fetch GitHub stats when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats();
});

// ===== TRAINING & CERTIFICATIONS BOTTOM SHEET =====
document.addEventListener('DOMContentLoaded', function() {
    const triggerBtn = document.getElementById('trainingTriggerBtn');
    const trainingSheet = document.getElementById('trainingSheet');
    const sheetContent = document.getElementById('sheetContent');
    const closeBtn = document.getElementById('closeSheetBtn');
    const overlay = document.getElementById('sheetOverlay');
    const dragHandle = document.getElementById('dragHandle');

    let isDragging = false;
    let startY = 0;
    let startHeight = 0;
    let currentHeight = 0;

    // Open sheet
    if (triggerBtn) {
        triggerBtn.addEventListener('click', function() {
            trainingSheet.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            document.documentElement.style.overflow = 'hidden'; // Prevent html scroll too
        });
    }

    // Close sheet function
    function closeSheet() {
        trainingSheet.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        document.documentElement.style.overflow = ''; // Restore html scroll
    }

    // Close on button click
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeSheet();
        });
    }

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeSheet();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && trainingSheet.classList.contains('active')) {
            closeSheet();
        }
    });

    // Drag to resize functionality
    if (dragHandle && sheetContent) {
        // Mouse events
        dragHandle.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        // Touch events
        dragHandle.addEventListener('touchstart', startDragging);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDragging);

        function startDragging(e) {
            if (!trainingSheet.classList.contains('active')) return;
            
            isDragging = true;
            startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            startHeight = sheetContent.offsetHeight;
            currentHeight = startHeight;
            
            sheetContent.style.transition = 'none';
            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const deltaY = startY - currentY;
            const newHeight = Math.max(200, Math.min(window.innerHeight * 0.85, startHeight + deltaY));
            
            currentHeight = newHeight;
            sheetContent.style.height = `${newHeight}px`;
            
            e.preventDefault();
        }

        function stopDragging(e) {
            if (!isDragging) return;
            
            isDragging = false;
            sheetContent.style.transition = '';
            
            // Close if dragged down significantly
            if (currentHeight < 250) {
                closeSheet();
            }
        }
    }

    // Prevent clicks on training items from closing the sheet
    const trainingItems = document.querySelectorAll('.training-item');
    trainingItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});

