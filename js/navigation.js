// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Dot navigation functionality
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.dot-link');

    let isScrolling = false;
    let currentSectionIndex = 0;

    // Update active dot based on scroll position
    function updateActiveDot() {
        let newSectionIndex = 0;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Activate section when we're at least halfway into it
            if (window.scrollY >= sectionTop - sectionHeight / 2) {
                newSectionIndex = index;
            }
        });

        if (newSectionIndex !== currentSectionIndex) {
            const oldIndex = currentSectionIndex;
            currentSectionIndex = newSectionIndex;

            // Update section backgrounds - turn current section black
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
    }

    // Custom smooth scroll with ease-in-out
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Smooth ease-in-out cubic for natural feel
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            // Update sections to black as we scroll through them
            updateActiveDot();

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // Smooth scroll on dot click
    navLinks.forEach((link, clickedIndex) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const targetPosition = targetSection.offsetTop;
                
                // Calculate number of sections traveled
                const sectionsTraveled = Math.abs(clickedIndex - currentSectionIndex);
                
                // 1.5 seconds per section = 1500ms per section
                // Minimum 1.5 seconds even for same section or adjacent sections
                const duration = Math.max(sectionsTraveled * 1500, 1500);
                
                smoothScrollTo(targetPosition, duration);
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
});
