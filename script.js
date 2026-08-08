/* =========================================================
    Portfolio - Main JavaScript
    Author: Umar
    Includes:
      - Water ripple canvas animation (cursor interactive)
      - Mobile hamburger menu
      - Theme toggle (dark/light)
      - Typing effect for hero roles
      - Scroll-spy active nav
      - Scroll reveal animations
      - Skill progress bars animation
      - Contact form client-side validation
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------
       1. WATER RIPPLE / WAVE CANVAS ANIMATION
       ------------------------------------------------- */
    const canvas = document.getElementById('waterCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let points = [];
    let bubbles = [];
    let lastSpawnTime = 0;
    let frameId = null;
    const mouse = { x: null, y: null };
    const BUBBLE_PALETTE = [
        'rgba(124,58,237,0.55)',
        'rgba(6,182,212,0.55)',
        'rgba(245,158,11,0.55)',
        'rgba(244,63,94,0.55)',
        'rgba(52,211,153,0.55)'
    ];

    // Responsive canvas sizing with device pixel ratio
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initPoints();
    }

    // Create grid of wave points that ripple on mouse move
    const ROWS = 14;
    const COLS = 22;
    const SPACING_X = () => width / COLS;
    const SPACING_Y = () => height / ROWS;

    function initPoints() {
        points = [];
        for (let i = 0; i <= ROWS; i++) {
            for (let j = 0; j <= COLS; j++) {
                points.push({
                    x: j * SPACING_X(),
                    y: i * SPACING_Y(),
                    baseX: j * SPACING_X(),
                    baseY: i * SPACING_Y(),
                    vx: 0,
                    vy: 0
                });
            }
        }
    }

    function handleMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        spawnBubbles(mouse.x, mouse.y);
    }

    function handleTouchMove(e) {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        spawnBubbles(mouse.x, mouse.y);
    }

    // Spawn liquid bubbles at the cursor position
    function spawnBubbles(x, y) {
        const now = performance.now();
        if (now - lastSpawnTime < 60) return; // Throttle bubble creation
        lastSpawnTime = now;

        const count = 2;
        for (let i = 0; i < count; i++) {
            const color = BUBBLE_PALETTE[Math.floor(Math.random() * BUBBLE_PALETTE.length)];
            bubbles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                radius: 2 + Math.random() * 4,
                vx: (Math.random() - 0.5) * 0.6,
                vy: -0.2 - Math.random() * 0.8,
                color: color,
                opacity: 0.7 + Math.random() * 0.3,
                phase: Math.random() * Math.PI * 2,
                wobble: 0.5 + Math.random() * 1
            });
        }

        // Limit bubbles array size for performance
        if (bubbles.length > 160) {
            bubbles.splice(0, bubbles.length - 160);
        }
    }

    function drawBubbles() {
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            b.phase += 0.05;
            b.x += b.vx + Math.sin(b.phase) * b.wobble * 0.3;
            b.y += b.vy;

            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.globalAlpha = b.opacity;
            ctx.fill();

            // Bubble shine highlight
            ctx.beginPath();
            ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.globalAlpha = b.opacity * 0.5;
            ctx.fill();

            // Remove bubbles when off screen or faded
            if (b.y < -20 || b.x < -20 || b.x > width + 20 || b.opacity <= 0) {
                bubbles.splice(i, 1);
                continue;
            }
        }
        ctx.globalAlpha = 1;
    }

    function ripple() {
        ctx.clearRect(0, 0, width, height);

        drawBubbles();

        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 220;

            // Apply force to points near cursor
            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist;
                p.vx += (dx / dist) * force * 0.15;
                p.vy += (dy / dist) * force * 0.15;
            }

            // Restore to base position (spring)
            p.vx += (p.baseX - p.x) * 0.02;
            p.vy += (p.baseY - p.y) * 0.02;

            // Apply velocity and damping
            p.vx *= 0.91;
            p.vy *= 0.91;
            p.x += p.vx;
            p.y += p.vy;
        }

        // Draw lines to create the wave grid
        ctx.strokeStyle = 'currentColor';
        ctx.lineWidth = 1;

        const renderColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--canvas-stroke').trim();

        ctx.strokeStyle = renderColor || 'rgba(124,58,237,0.5)';

        // Horizontal lines
        for (let i = 0; i <= ROWS; i++) {
            ctx.beginPath();
            for (let j = 0; j <= COLS; j++) {
                const idx = i * (COLS + 1) + j;
                const p = points[idx];
                if (j === 0) {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            }
            ctx.stroke();
        }

        // Vertical lines
        for (let j = 0; j <= COLS; j++) {
            ctx.beginPath();
            for (let i = 0; i <= ROWS; i++) {
                const idx = i * (COLS + 1) + j;
                const p = points[idx];
                if (i === 0) {
                    ctx.moveTo(p.x, p.y);
                } else {
                    ctx.lineTo(p.x, p.y);
                }
            }
            ctx.stroke();
        }

        frameId = requestAnimationFrame(ripple);
    }

    // Wire listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initial setup
    resizeCanvas();
    ripple();

    // Pause animation when tab is hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(frameId);
        } else {
            ripple();
        }
    });

    /* -------------------------------------------------
       2. VARIABLES
       ------------------------------------------------- */
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const yearSpan = document.getElementById('year');
    const typedEl = document.querySelector('.typed-text');
    const cursorEl = document.querySelector('.cursor');
    const contactForm = document.getElementById('contactForm');

    /* -------------------------------------------------
       3. THEME TOGGLE (Dark / Light)
       ------------------------------------------------- */
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.dataset.theme = 'dark';
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = body.dataset.theme === 'dark';
        if (isDark) {
            body.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            body.dataset.theme = 'dark';
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    /* -------------------------------------------------
       4. MOBILE HAMBURGER MENU
       ------------------------------------------------- */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    /* -------------------------------------------------
       5. NAVBAR SCROLL EFFECT
       ------------------------------------------------- */
    function onScrollNav() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScrollNav);
    onScrollNav();

    /* -------------------------------------------------
       6. TYPING EFFECT
       ------------------------------------------------- */
    const roles = [
        'Frontend Developer',
        'Android App Developer',
        'AI Project Enthusiast',
        'Web Designer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = roles[roleIndex];
        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 110;

        if (!isDeleting && charIndex === current.length) {
            delay = 1600; // pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }
    type();

    /* -------------------------------------------------
       7. SCROLL-SPY ACTIVE NAV LINK
       ------------------------------------------------- */
    const sections = document.querySelectorAll('section[id], footer[id]');

    function updateActiveLink() {
        const scrollPos = window.scrollY;
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    /* -------------------------------------------------
       8. SCROLL REVEAL ANIMATION
       ------------------------------------------------- */
    const revealElements = document.querySelectorAll('.section-heading, .skill-card, .service-card, .cert-card, .project-card, .about-content, .about-image, .contact-info, .contact-form');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate progress bars of skill cards
                const bars = entry.target.querySelectorAll('.progress-bar');
                bars.forEach(bar => {
                    // Only if not already animated
                    if (!bar.dataset.animated) {
                        bar.dataset.animated = 'true';
                        const val = bar.dataset.progress;
                        setTimeout(() => {
                            bar.style.width = val + '%';
                            bar.classList.add('animated');
                        }, 150);
                    }
                });
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Note: progress-bar CSS width transitions from 0 by default
    // Ensure they start at 0 on load
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = '0';
    });

    /* -------------------------------------------------
       9. FOOTER YEAR
       ------------------------------------------------- */
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* -------------------------------------------------
       10. CONTACT FORM VALIDATION (client-side)
       ------------------------------------------------- */
    const inputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    function setError(input, msg) {
        const group = input.closest('.form-group');
        const err = group.querySelector('.error-msg');
        input.classList.add('error');
        err.textContent = msg;
        return false;
    }

    function clearError(input) {
        const group = input.closest('.form-group');
        const err = group.querySelector('.error-msg');
        input.classList.remove('error');
        err.textContent = '';
    }

    // Remove error on typing
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let valid = true;
        const status = document.getElementById('formStatus');

        // Name validation
        if (!inputs.name.value.trim()) {
            valid = setError(inputs.name, 'Please enter your name.');
        }
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!inputs.email.value.trim()) {
            valid = setError(inputs.email, 'Please enter your email.');
        } else if (!emailPattern.test(inputs.email.value.trim())) {
            valid = setError(inputs.email, 'Please enter a valid email.');
        }
        // Subject optional
        // Message validation
        if (!inputs.message.value.trim()) {
            valid = setError(inputs.message, 'Please enter your message.');
        }

        if (!valid) {
            status.textContent = 'Please fix the errors above.';
            status.className = 'form-status error';
            return;
        }

        // Reset status and show loading
        status.textContent = 'Sending...';
        status.className = 'form-status';
        const sendBtn = contactForm.querySelector('.send-btn');
        const originalHtml = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;

        const formData = {
            name: inputs.name.value.trim(),
            email: inputs.email.value.trim(),
            subject: inputs.subject.value.trim() || 'General Inquiry',
            message: inputs.message.value.trim()
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                status.textContent = 'Thank you! Your message has been sent successfully.';
                status.className = 'form-status success';
                contactForm.reset();
            } else {
                status.textContent = data.message || 'Sorry, something went wrong. Try again.';
                status.className = 'form-status error';
            }
        } catch (err) {
            status.textContent = 'Network error. Please check your connection.';
            status.className = 'form-status error';
        } finally {
            sendBtn.innerHTML = originalHtml;
            sendBtn.disabled = false;
        }
    });

    /* -------------------------------------------------
       11. DOWNLOAD CV BUTTON
       ------------------------------------------------- */
    const downloadCv = document.getElementById('downloadCv');
    downloadCv.addEventListener('click', () => {
        // Serve the Profile.pdf file as CV
        window.location.href = 'Profile.pdf';
    });

    /* -------------------------------------------------
       12. READ MORE BUTTON (About)
       ------------------------------------------------- */
    const readMoreBtn = document.getElementById('readMoreBtn');
    readMoreBtn.addEventListener('click', () => {
        const aboutImage = document.querySelector('.about-image img');
        aboutImage.style.transform = aboutImage.style.transform === 'scale(1.2)' ? 'scale(1.02)' : 'scale(1.2)';
        readMoreBtn.textContent = aboutImage.style.transform === 'scale(1.2)' ? 'Read Less' : 'Read More';
    });

    /* -------------------------------------------------
       13. CERTIFICATE LIGHTBOX (View Certificate)
       ------------------------------------------------- */
    const lightbox = document.getElementById('certLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxOpen = document.getElementById('lightboxOpen');
    const certOpenButtons = document.querySelectorAll('.cert-open');

    function openLightbox(image, title) {
        lightboxImage.src = image;
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;
        lightboxOpen.href = image;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Open lightbox when clicking a certificate card / View Certificate
    certOpenButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const image = btn.dataset.image;
            const title = btn.dataset.title;
            openLightbox(image, title);
        });
    });

    // Close via close button or overlay click
    document.querySelectorAll('[data-close-lightbox]').forEach(el => {
        el.addEventListener('click', closeLightbox);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});

