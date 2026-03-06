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

    // --- 8. Phase 5: Hero Interactive Animation Suite ---
    const heroSection = document.getElementById('hero');
    const heroGlow = document.querySelector('.hero-glow');
    const heroContent = document.querySelector('.hero-content');
    const floatingIcons = document.querySelectorAll('.floating-tech-icon');
    const canvas = document.getElementById('hero-particles');

    if (heroSection && canvas && heroGlow) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        let mouse = { x: -1000, y: -1000 }; // Out of screen initially
        let currentGlowX = -1000;
        let currentGlowY = -1000;

        function initCanvas() {
            width = heroSection.clientWidth;
            height = heroSection.clientHeight;
            canvas.width = width;
            canvas.height = height;

            // Create particles
            particles = [];
            const numParticles = window.innerWidth > 768 ? 60 : 30; // Fewer on mobile
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.originX = this.x;
                this.originY = this.y;
                this.size = Math.random() * 2 + 0.5;
                this.vx = 0;
                this.vy = 0;
                this.ease = 0.05 + Math.random() * 0.05; // Spring ease
                this.friction = 0.9;

                // Color variation
                const colors = ['rgba(59, 130, 246, 0.4)', 'rgba(139, 92, 246, 0.4)', 'rgba(255, 255, 255, 0.3)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const repulseRadius = 100;
                let tx = this.originX;
                let ty = this.originY;

                // Repulsion
                if (distance < repulseRadius) {
                    const force = (repulseRadius - distance) / repulseRadius;
                    const angle = Math.atan2(dy, dx);
                    // Push away from mouse
                    tx = this.x - Math.cos(angle) * force * 5;
                    ty = this.y - Math.sin(angle) * force * 5;
                }

                // Spring back to target
                this.vx += (tx - this.x) * this.ease;
                this.vy += (ty - this.y) * this.ease;
                this.vx *= this.friction;
                this.vy *= this.friction;

                this.x += this.vx;
                this.y += this.vy;

                // Subtle organic drift
                this.originX += (Math.random() - 0.5) * 0.5;
                this.originY += (Math.random() - 0.5) * 0.5;

                // Keep origins in bounds
                if (this.originX < 0) this.originX = 0;
                if (this.originX > width) this.originX = width;
                if (this.originY < 0) this.originY = 0;
                if (this.originY > height) this.originY = height;

                this.draw();
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Render particles
            particles.forEach(p => p.update());

            // Lerp glow position
            currentGlowX += (mouse.x - currentGlowX) * 0.1;
            currentGlowY += (mouse.y - currentGlowY) * 0.1;
            heroGlow.style.left = `${currentGlowX}px`;
            heroGlow.style.top = `${currentGlowY}px`;

            // Parallax Foreground
            if (heroContent && mouse.y > -500) {
                // Calculate from center of hero
                const cx = width / 2;
                const cy = height / 2;
                const px = (mouse.x - cx) * 0.02; // very subtle
                const py = (mouse.y - cy) * 0.02;
                heroContent.style.transform = `translate(${px}px, ${py}px)`;
            }

            // Parallax floating icons
            if (mouse.y > -500) {
                floatingIcons.forEach((icon, i) => {
                    const speed = 0.01 + (i * 0.005);
                    const cx = width / 2;
                    const cy = height / 2;
                    const px = -(mouse.x - cx) * speed;
                    const py = -(mouse.y - cy) * speed;
                    icon.style.transform = `translate(${px}px, ${py}px)`;
                });
            }

            requestAnimationFrame(animate);
        }

        // Mouse Tracker specifically for Hero space
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        heroSection.addEventListener('mouseleave', () => {
            // Send mouse far away when outside hero
            mouse.x = width / 2;
            mouse.y = -1000;
            if (heroContent) heroContent.style.transform = `translate(0px, 0px)`;
            floatingIcons.forEach(icon => icon.style.transform = `translate(0px, 0px)`);
        });

        // Handle Resizing cleanly
        window.addEventListener('resize', () => {
            initCanvas();
        });

        // Bootstrap
        initCanvas();
        animate();
    }
});
