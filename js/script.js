// ===== DISABLE RIGHT-CLICK & INSPECT =====
// Note: This is easily bypassable and may frustrate users
// Remove this section if you want to allow inspection

// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable common keyboard shortcuts for DevTools
document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+C (Windows/Linux) or Cmd+Option+C (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }
    // Ctrl+U (View Source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
    }
});

// Detect if DevTools is open (basic detection)
let devtoolsOpen = false;
const threshold = 160;

setInterval(function() {
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            // Optional: redirect or show warning
            // window.location.href = 'about:blank';
        }
    } else {
        devtoolsOpen = false;
    }
}, 500);


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

// ===== ABOUT ME CARD DECK =====
document.addEventListener('DOMContentLoaded', () => {
    const cardStack = document.querySelector('.aboutme-card-stack');

    if (!cardStack) return;

    const cardData = [
        {
            src: 'assets/images/cardimages/1fbb77e1-6c9b-4342-beb5-3d3bdd9f1a75.jpeg',
            caption: 'Ready for the Next'
        },
        {
            src: 'assets/images/cardimages/2ff5f953-b30a-44e4-814d-c576de5f4685.jpeg',
            caption: 'Late Night Coding Sessions'
        },
        {
            src: 'assets/images/cardimages/4acfbd43-f42d-4983-9200-8734f2dc0550.jpeg',
            caption: 'EARIST I.T. Congress'
        },
        {
            src: 'assets/images/cardimages/736e5418-cf14-45ed-b489-bde54c3f2277.jpeg',
            caption: 'CompTIA Exam Day'
        },
        {
            src: 'assets/images/cardimages/bac4ab09-3dc2-4c32-b3bb-60dd1fb02027.jpeg',
            caption: 'From the Archives..'
        },
        {
            src: 'assets/images/cardimages/d4f9316b-c1f1-4b2c-b9d2-5ecf075a2d0e.jpeg',
            caption: 'Baccalaureate Mass'
        },
        {
            src: 'assets/images/cardimages/received_1970028833688389.jpeg',
            caption: 'A Journey Completed'
        }
    ];

    const shuffle = (items) => {
        const copy = [...items];
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const getCards = () => Array.from(cardStack.querySelectorAll('.stack-card'));
    let nextExitSide = 'left';
    let isRefilling = false;

    const buildCard = (item) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'stack-card';
        card.setAttribute('aria-label', item.caption);

        const img = document.createElement('img');
        img.className = 'stack-card-image';
        img.src = item.src;
        img.alt = item.caption;

        const caption = document.createElement('span');
        caption.className = 'stack-card-caption';
        caption.textContent = item.caption;

        card.append(img, caption);
        cardStack.appendChild(card);
        return card;
    };

    const updateCardContent = (card, item) => {
        const img = card.querySelector('.stack-card-image');
        const caption = card.querySelector('.stack-card-caption');

        if (img) {
            img.src = item.src;
            img.alt = item.caption;
        }

        if (caption) {
            caption.textContent = item.caption;
        }

        card.setAttribute('aria-label', item.caption);
    };

    const getActiveCards = () => getCards().filter(card => !card.classList.contains('is-exiting'));

    const applyDeckState = () => {
        const cards = getCards();
        const activeCards = cards.filter(card => !card.classList.contains('is-exiting'));
        const total = activeCards.length;

        activeCards.forEach((card, index) => {
            const direction = index % 2 === 0 ? -1 : 1;
            const stackDepth = total - index;
            const x = direction * Math.min(10, 1.5 + index * 0.8);
            const y = index * 7 + (direction === 1 ? 1.5 : 0);
            const rotate = direction * (1.15 + index * 0.45);
            const scale = 1 - (total - index - 1) * 0.015;

            card.classList.toggle('is-top', index === total - 1);
            card.classList.toggle('stack-card-front', index === total - 1);
            card.classList.toggle('stack-card-back', index !== total - 1);

            card.disabled = false;
            card.tabIndex = 0;
            card.style.setProperty('--card-x', `${x}px`);
            card.style.setProperty('--card-y', `${y}px`);
            card.style.setProperty('--card-rotate', `${rotate}deg`);
            card.style.setProperty('--card-scale', `${scale}`);
            card.style.setProperty('--card-hover-y', `${y}px`);
            card.style.setProperty('--card-hover-scale', `${scale}`);
            card.style.setProperty('--card-z', `${stackDepth}`);
        });

        cards.forEach(card => {
            if (card.classList.contains('is-exiting')) {
                card.classList.remove('is-top');
                card.classList.remove('stack-card-front');
                card.classList.add('stack-card-back');
                card.disabled = true;
                card.tabIndex = -1;
            }
        });
    };

    const populateDeck = (items) => {
        const cards = getCards();

        if (!items.length) return;

        cards.forEach((card, index) => {
            updateCardContent(card, items[index % items.length]);
        });
    };

    const renderDeck = () => {
        cardStack.innerHTML = '';

        shuffle(cardData).forEach((item) => {
            buildCard(item);
        });

        applyDeckState();
    };

    const refillDeck = () => {
        if (isRefilling) return;

        isRefilling = true;

        const nextDeck = shuffle(cardData);
        populateDeck(nextDeck);

        window.setTimeout(() => {
            window.requestAnimationFrame(() => {
                const cards = getCards();

                cards.forEach(card => {
                    card.classList.remove('is-exiting', 'exit-left', 'exit-right');
                    card.disabled = false;
                    card.tabIndex = 0;
                });

                applyDeckState();
                isRefilling = false;
            });
        }, 180);
    };

    const sendCardOut = (card) => {
        if (!card.classList.contains('is-top') || card.classList.contains('is-exiting') || isRefilling) return;

        const exitSide = nextExitSide;
        nextExitSide = nextExitSide === 'left' ? 'right' : 'left';

        card.classList.add('is-exiting', `exit-${exitSide}`);
        card.classList.remove('is-top');
        card.disabled = true;
        card.tabIndex = -1;

        applyDeckState();

        let finished = false;

        const finish = () => {
            if (finished) return;

            finished = true;
            card.removeEventListener('transitionend', onTransitionEnd);

            if (!getActiveCards().length) {
                refillDeck();
            }
        };

        const onTransitionEnd = (event) => {
            if (event.propertyName !== 'transform' && event.propertyName !== 'opacity') return;
            finish();
        };

        card.addEventListener('transitionend', onTransitionEnd);

        window.setTimeout(() => {
            if (card.isConnected && card.classList.contains('is-exiting')) {
                finish();
            }
        }, 700);
    };

    cardStack.addEventListener('click', (event) => {
        const card = event.target.closest('.stack-card');
        if (!card || !cardStack.contains(card)) return;
        sendCardOut(card);
    });

    cardStack.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        const card = event.target.closest('.stack-card');
        if (!card || !cardStack.contains(card)) return;

        event.preventDefault();
        sendCardOut(card);
    });

    renderDeck();
});

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
