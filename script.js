// ====================================================
// QUICKCOOL - MODERN HVAC WEBSITE
// ====================================================

// ====================================================
// CONFIGURATION
// ====================================================
const CONFIG = {
    phoneNumber: '27818751906',
    email: 'quickcool.aircons@gmail.com',
    whatsappGreeting: 'Hello%2C%20I%20would%20like%20to%20inquire%20about%20HVAC%20services'
};

// ====================================================
// UTILITY FUNCTIONS
// ====================================================

/**
 * Get element safely with optional error handling
 */
const $ = (selector, context = document) => {
    const element = context.querySelector(selector);
    return element;
};

/**
 * Get all matching elements
 */
const $$ = (selector, context = document) => {
    return [...context.querySelectorAll(selector)];
};

/**
 * Encode text for URLs
 */
const encodeForURL = (text) => encodeURIComponent(text);

/**
 * Delay function
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate email
 */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Validate phone
 */
const isValidPhone = (phone) => /^[\d\s\-\+\(\)]{7,}$/.test(phone);

// ====================================================
// NAVIGATION
// ====================================================
class Navigation {
    constructor() {
        this.toggle = $('.nav-toggle');
        this.mobileNav = $('.mobile-nav');
        this.navLinks = $$('.nav-link, .mobile-nav-link');
        this.init();
    }

    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.handleToggle());
        }

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.handleLinkClick(link));
        });

        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    handleToggle() {
        this.mobileNav?.classList.toggle('active');
        const isActive = this.mobileNav?.classList.contains('active');
        this.toggle.setAttribute('aria-expanded', isActive);
    }

    handleLinkClick(link) {
        this.mobileNav?.classList.remove('active');
        this.toggle?.setAttribute('aria-expanded', 'false');
        
        // Update active state
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    updateActiveLink() {
        const sections = $$('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const id = section.getAttribute('id');
                this.navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }
}

// ====================================================
// FORM HANDLING
// ====================================================
class FormHandler {
    constructor() {
        this.form = $('#contactForm');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validate()) {
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Format message for WhatsApp
        const message = this.formatMessage(data);
        
        // Open WhatsApp
        const whatsappURL = `https://wa.me/${CONFIG.phoneNumber}?text=${message}`;
        window.open(whatsappURL, '_blank', 'noopener,noreferrer');

        // Reset form
        this.form.reset();
        
        // Show success message
        this.showSuccess();
    }

    validate() {
        const name = this.form.querySelector('#name').value.trim();
        const email = this.form.querySelector('#email').value.trim();
        const phone = this.form.querySelector('#phone').value.trim();
        const service = this.form.querySelector('#service').value;

        if (!name) {
            this.showError('Please enter your name');
            return false;
        }

        if (!email || !isValidEmail(email)) {
            this.showError('Please enter a valid email');
            return false;
        }

        if (!phone || !isValidPhone(phone)) {
            this.showError('Please enter a valid phone number');
            return false;
        }

        if (!service) {
            this.showError('Please select a service');
            return false;
        }

        return true;
    }

    formatMessage(data) {
        const lines = [
            'New Contact Request from QuickCool Website',
            '================================',
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Phone: ${data.phone}`,
            `Service: ${data.service}`,
        ];

        if (data.message) {
            lines.push(`Message: ${data.message}`);
        }

        return encodeForURL(lines.join('\n'));
    }

    showSuccess() {
        const message = document.createElement('div');
        message.className = 'notification notification-success';
        message.textContent = '✓ Message sent! Opening WhatsApp...';
        this.form.parentNode.insertBefore(message, this.form);

        setTimeout(() => message.remove(), 3000);
    }

    showError(text) {
        const message = document.createElement('div');
        message.className = 'notification notification-error';
        message.textContent = `✕ ${text}`;
        this.form.parentNode.insertBefore(message, this.form);

        setTimeout(() => message.remove(), 3000);
    }
}

// ====================================================
// SMOOTH SCROLL
// ====================================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = $(href);
            if (!target) return;

            e.preventDefault();
            this.scrollToElement(target);
        });
    }

    scrollToElement(element) {
        const headerHeight = 80;
        const elementTop = element.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
        });
    }
}

// ====================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ====================================================
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = entry.target.dataset.animation || 'fadeIn 0.6s ease forwards';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        $$('.service-card, .benefit-card, .testimonial-card, .pricing-card').forEach(el => {
            el.dataset.animation = 'fadeIn 0.6s ease forwards';
            observer.observe(el);
        });
    }
}

// ====================================================
// NOTIFICATION STYLES
// ====================================================
const addNotificationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-weight: 600;
            animation: slideInDown 300ms ease forwards;
        }

        .notification-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .notification-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
};

// ====================================================
// INITIALIZATION
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    new Navigation();
    new FormHandler();
    new SmoothScroll();
    new AnimationObserver();
    addNotificationStyles();

    console.log('QuickCool website loaded successfully');
});

// ====================================================
// ERROR HANDLING
// ====================================================
window.addEventListener('error', (event) => {
    console.error('An error occurred:', event.error);
});

// ====================================================
// PERFORMANCE
// ====================================================

// Lazy load images if needed
if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    $$('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ====================================================
// ANALYTICS (Optional - Add your tracking code)
// ====================================================
// You can add Google Analytics or other tracking here
