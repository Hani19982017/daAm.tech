// DaAm.tech - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Language state
    let currentLang = localStorage.getItem('lang') || 'en';
    
    // Initialize language
    setLanguage(currentLang);
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
    
    // Active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Scroll animations with Intersection Observer
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add stagger delay based on index
                const parent = entry.target.closest('.row');
                if (parent) {
                    const siblings = parent.querySelectorAll('.animate-on-scroll');
                    const index = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = (index * 0.1) + 's';
                }
                
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = currentLang === 'ar' 
                ? '<span>جاري الإرسال...</span><i class="bi bi-hourglass-split ms-2"></i>'
                : '<span>Sending...</span><i class="bi bi-hourglass-split ms-2"></i>';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert(currentLang === 'ar' 
                    ? 'شكراً لك! سنتواصل معك قريباً.' 
                    : 'Thank you! We will contact you soon.');
                contactForm.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                
                // Update placeholders for current language
                updatePlaceholders();
            }, 1500);
        });
    }
});

// Language Switcher Function (global scope for onclick)
function setLanguage(lang) {
    const currentLang = lang;
    localStorage.setItem('lang', lang);
    
    const html = document.documentElement;
    
    // Set direction and language
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update all text elements with data attributes
    document.querySelectorAll('[data-' + lang + ']').forEach(el => {
        const newText = el.getAttribute('data-' + lang);
        if (newText) {
            el.textContent = newText;
        }
    });
    
    // Update placeholders
    updatePlaceholders();
    
    // Update select options
    document.querySelectorAll('select option[data-' + lang + ']').forEach(option => {
        const newText = option.getAttribute('data-' + lang);
        if (newText) {
            option.textContent = newText;
        }
    });
}

function updatePlaceholders() {
    const lang = localStorage.getItem('lang') || 'en';
    document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
        el.placeholder = el.getAttribute('data-placeholder-' + lang);
    });
}
