// ==========================================
// Particles Background
// ==========================================
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 12000), 100);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - dist / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }

            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += dx * force * 0.02;
                    p.y += dy * force * 0.02;
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Typing Effect
// ==========================================
class TypeWriter {
    constructor(element, phrases, speed = 80) {
        this.element = element;
        this.phrases = phrases;
        this.speed = speed;
        this.deleteSpeed = 40;
        this.pauseTime = 2000;
        this.currentPhrase = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const phrase = this.phrases[this.currentPhrase];

        if (this.isDeleting) {
            this.currentChar--;
            this.element.textContent = phrase.substring(0, this.currentChar);
        } else {
            this.currentChar++;
            this.element.textContent = phrase.substring(0, this.currentChar);
        }

        let timeout = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.currentChar === phrase.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
            timeout = 500;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// ==========================================
// Custom Cursor
// ==========================================
function initCursor() {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursor-follower');

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX - 4 + 'px';
            cursor.style.top = mouseY - 4 + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.left = followerX - 18 + 'px';
            follower.style.top = followerY - 18 + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
        });
    }
}

// ==========================================
// Navbar
// ==========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
        document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    });
}

// ==========================================
// Scroll Reveal
// ==========================================
function initScrollReveal() {
    const reveals = document.querySelectorAll(
        '.about-grid, .skill-category, .project-card, .timeline-item, .contact-card, .about-stats .stat'
    );

    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
}

// ==========================================
// Counter Animation
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current;
    }, 30);
}

// ==========================================
// Smooth Scroll (for Safari)
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

// ==========================================
// Init
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const canvas = document.getElementById('particles-canvas');
    if (canvas) new ParticleNetwork(canvas);

    // Typing effect
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        new TypeWriter(typedEl, [
            'DevOps & Cloud Engineer',
            'Building CI/CD Pipelines',
            'Automating Infrastructure',
            'Kubernetes Orchestrator',
            'Terraform IaC Expert',
            'AWS & Azure Architect',
        ]);
    }

    // Init all components
    initCursor();
    initNavbar();
    initScrollReveal();
    initCounters();
    initSmoothScroll();
});
