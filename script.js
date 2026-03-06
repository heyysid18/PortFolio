document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Navigation on Scroll ---
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // keep transparent on top? actually let's just make it glass if scrolled
            // Wait, standard behavior:
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Trigger once on load
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    }

    // --- 2. Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle hamburger animation (optional, but good)
            const bars = mobileBtn.querySelectorAll('.bar');
            if (navLinks.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });
    }

    // Close mobile menu on link click
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const bars = mobileBtn.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });
    });

    // --- 3. Scroll Animations using Intersection Observer ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated if we only want it to happen once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-up');
    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

    // Handle initial animations with small delay to ensure CSS is ready
    setTimeout(() => {
        // Trigger initial visibility for elements already in viewport on load
        const heroElements = document.querySelectorAll('#hero .slide-up');
        heroElements.forEach(el => {
            el.classList.add('is-visible');
        });
    }, 100);

    // --- 4. Custom Cursor Logic ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Animate outline smoothly
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect for interactive elements
        const interactables = document.querySelectorAll('a, button, input, textarea');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover-active');
            });
        });
    }

    // --- 5. Back to Top Button ---
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 6. Preloader Logic ---
    // --- 6. Preloader Logic ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Since this script is deferred and runs on DOMContentLoaded, 
        // the page is already mostly ready. We just add a small delay for the animation to feel complete.
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            // Remove from DOM entirely after transition mostly finishes to avoid interaction blocking
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 400);
    }

    // --- 7. Parallax Background Blobs ---
    const blobs = document.querySelectorAll('.blob');
    let scrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                blobs.forEach((blob, index) => {
                    // Different speeds for different blobs creates depth
                    const speed = 0.15 + (index * 0.05);
                    const yPos = -(scrollY * speed);
                    blob.style.transform = `translateY(${yPos}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
});
