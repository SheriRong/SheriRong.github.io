// ============================================
// Portfolio Website JavaScript
// ============================================

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function execution rate
 */
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// Navigation Functionality
// ============================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        // Handle mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Handle navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Handle scroll events
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));

        // Set active link on load
        this.setActiveLink();
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');

        // Update hamburger animation
        const hamburger = this.navToggle.querySelector('.hamburger');
        if (this.navMenu.classList.contains('active')) {
            hamburger.style.transform = 'rotate(45deg)';
        } else {
            hamburger.style.transform = 'rotate(0)';
        }
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        const hamburger = this.navToggle.querySelector('.hamburger');
        hamburger.style.transform = 'rotate(0)';
    }

    handleNavClick(e) {
        const href = e.target.getAttribute('href');

        // Only handle internal links
        if (href && href.startsWith('#')) {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Close mobile menu if open
                this.closeMenu();

                // Smooth scroll to section
                const navHeight = this.navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without page jump
                history.pushState(null, null, href);
            }
        }
    }

    handleScroll() {
        // Add shadow to navbar on scroll
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Update active navigation link
        this.setActiveLink();
    }

    setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = this.navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const id = section.getAttribute('id');
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ============================================
// Scroll Animations (Simple AOS Implementation)
// ============================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        // Initial check for elements in viewport
        this.checkElements();

        // Check on scroll
        window.addEventListener('scroll', throttle(() => this.checkElements(), 100));

        // Check on resize
        window.addEventListener('resize', debounce(() => this.checkElements(), 200));
    }

    checkElements() {
        this.animatedElements.forEach(element => {
            if (this.isInViewport(element)) {
                this.animateElement(element);
            }
        });
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
            rect.top <= windowHeight * 0.85 &&
            rect.bottom >= 0
        );
    }

    animateElement(element) {
        if (!element.classList.contains('aos-animate')) {
            // Get delay if specified
            const delay = element.getAttribute('data-aos-delay') || 0;

            setTimeout(() => {
                element.classList.add('aos-animate');
            }, delay);
        }
    }
}

// ============================================
// Skill Progress Bars Animation
// ============================================

class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', throttle(() => this.animateOnScroll(), 100));
        this.animateOnScroll(); // Check on load
    }

    animateOnScroll() {
        if (this.animated) return;

        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect.top <= windowHeight * 0.75) {
            this.animateBars();
            this.animated = true;
        }
    }

    animateBars() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.style.getPropertyValue('--progress');
            }, index * 100);
        });
    }
}

// ============================================
// Contact Form Handling
// ============================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.status = document.getElementById('formStatus');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate form
        if (!this.validateForm(data)) {
            this.showStatus('Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Here you would typically send the form data to a server
            // For GitHub Pages, you might use a service like Formspree or EmailJS

            // Simulate API call
            await this.simulateFormSubmission(data);

            // Show success message
            this.showStatus('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.form.reset();

        } catch (error) {
            this.showStatus('Oops! Something went wrong. Please try again or email me directly.', 'error');
        } finally {
            // Reset button
            submitBtn.querySelector('.btn-text').textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(data) {
        return data.name &&
            data.email &&
            data.subject &&
            data.message &&
            this.isValidEmail(data.email);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showStatus(message, type) {
        this.status.textContent = message;
        this.status.className = `form-status ${type}`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.status.className = 'form-status';
        }, 5000);
    }

    // Simulate form submission (replace with actual implementation)
    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            console.log('Form submitted:', data);

            // For production, integrate with a service like:
            // - Formspree: https://formspree.io/
            // - EmailJS: https://www.emailjs.com/
            // - Netlify Forms (if hosting on Netlify)

            setTimeout(resolve, 1000);
        });
    }
}

// ============================================
// Typing Effect for Hero Section (Optional Enhancement)
// ============================================

class TypingEffect {
    constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        if (this.element) {
            this.init();
        }
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ============================================
// Dynamic Year for Footer
// ============================================

function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                const navbar = document.getElementById('navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Image Lazy Loading Enhancement
// ============================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// Keyboard Navigation Enhancement
// ============================================

function initKeyboardNav() {
    // Allow ESC key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const navToggle = document.getElementById('navToggle');
                if (navToggle) {
                    navToggle.classList.remove('active');
                }
            }
        }
    });
}

// ============================================
// Performance: Intersection Observer for Animations
// ============================================

function initIntersectionObserver() {
    // More performant alternative to scroll event listeners
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('[data-observe]').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Theme Toggle (Optional - for future enhancement)
// ============================================

class ThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.toggleBtn = document.getElementById('themeToggle');

        if (this.toggleBtn) {
            this.init();
        }
    }

    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.theme);

        // Add event listener
        this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
}

// ============================================
// Initialize All Components
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new Navigation();
    new ScrollAnimations();
    new SkillBars();
    new ContactForm();

    // Utility functions
    updateCopyrightYear();
    initSmoothScroll();
    initKeyboardNav();

    // Optional enhancements (uncomment if needed)
    // initLazyLoading();
    // initIntersectionObserver();
    // new ThemeToggle();

    // Optional: Typing effect for hero title
    // const typingElement = document.querySelector('.hero-typing');
    // if (typingElement) {
    //     new TypingEffect(typingElement, [
    //         'Full-Stack Developer',
    //         'C++ Enthusiast',
    //         'Python Specialist',
    //         'Problem Solver'
    //     ]);
    // }

    // Log initialization (remove in production)
    console.log('Portfolio website initialized successfully! 🚀');
    console.log('Built with ❤️ at the University of Kansas');
});

// ============================================
// Window Load Event
// ============================================

window.addEventListener('load', () => {
    // Remove any loading overlays
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 300);
    }

    // Trigger initial animations
    document.body.classList.add('loaded');
});

// ============================================
// Handle Page Visibility
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause any animations or videos
        console.log('Page hidden');
    } else {
        // Page is visible - resume animations
        console.log('Page visible');
    }
});

// ============================================
// Service Worker Registration (Optional for PWA)
// ============================================

// Uncomment to enable Progressive Web App functionality
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
*/

// ============================================
// Analytics Integration (Optional)
// ============================================

// Add your analytics tracking code here
// Example: Google Analytics, Plausible, etc.

/*
// Google Analytics Example
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
*/

// ============================================
// Export for Testing (if using modules)
// ============================================

// export { Navigation, ScrollAnimations, SkillBars, ContactForm };