/* ============================================================================
   CALCIO SEDUTO - CENTRAL JAVASCRIPT
   Handles all interactive features: navigation, preloader, lightbox, 
   testimonials, and form validation
   ============================================================================ */

/* ============================================================================
   PAGE PRELOADER
   Shows logo animation while page loads, hides when DOM is ready
   ============================================================================ */
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    
    // Hide preloader after a short delay to ensure smooth transition
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 500);
});

/* ============================================================================
   MOBILE NAVIGATION MENU
   Handles hamburger menu toggle and keyboard accessibility
   ============================================================================ */
(function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (!navToggle || !navMenu) return;

    // Toggle menu on button click
    navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu on ESC key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            navToggle.focus(); // Return focus to toggle button
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
})();

/* ============================================================================
   PAGE TRANSITION PRELOADER
   Shows loading overlay when navigating between pages
   ============================================================================ */
(function initPageTransitions() {
    const internalLinks = document.querySelectorAll('a[href^="index.html"], a[href^="storia.html"], a[href^="gallery.html"], a[href^="iscrivi.html"], a[href^="testimonianze.html"], a[href^="contatti.html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't show preloader for same page links
            if (href === window.location.pathname.split('/').pop()) {
                return;
            }
            
            // Show preloader
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.remove('hidden');
            }
        });
    });
})();

/* ============================================================================
   GALLERY LIGHTBOX
   Opens images in full-screen modal with keyboard navigation
   ============================================================================ */
(function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryImages = document.querySelectorAll('.gallery__image');
    
    if (!lightbox || galleryImages.length === 0) return;

    let currentImageIndex = 0;
    let imagesArray = Array.from(galleryImages);

    // Open lightbox when clicking on gallery image
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox(this);
        });
    });

    function openLightbox(imageElement) {
        const fullSrc = imageElement.getAttribute('data-full') || imageElement.src;
        const alt = imageElement.alt;
        
        lightboxImage.src = fullSrc;
        lightboxImage.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on close button for accessibility
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
        openLightbox(imagesArray[currentImageIndex]);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
        openLightbox(imagesArray[currentImageIndex]);
    }

    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Previous button
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPreviousImage);
    }

    // Next button
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    // Close when clicking on background
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
})();

/* ============================================================================
   EXPANDABLE TESTIMONIALS
   Allows one testimonial to be expanded at a time with smooth transitions
   ============================================================================ */
(function initTestimonials() {
    const testimonialToggles = document.querySelectorAll('.testimonial__toggle');
    
    if (testimonialToggles.length === 0) return;

    testimonialToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const testimonialId = this.getAttribute('data-testimonial');
            const testimonial = document.getElementById(testimonialId);
            const preview = testimonial.querySelector('.testimonial__preview');
            const full = testimonial.querySelector('.testimonial__full');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other testimonials
            testimonialToggles.forEach(otherToggle => {
                if (otherToggle !== this) {
                    const otherId = otherToggle.getAttribute('data-testimonial');
                    const otherTestimonial = document.getElementById(otherId);
                    const otherPreview = otherTestimonial.querySelector('.testimonial__preview');
                    const otherFull = otherTestimonial.querySelector('.testimonial__full');
                    
                    otherToggle.setAttribute('aria-expanded', 'false');
                    otherToggle.textContent = 'Leggi di più';
                    otherPreview.style.display = 'block';
                    otherFull.setAttribute('aria-hidden', 'true');
                }
            });

            // Toggle current testimonial
            if (isExpanded) {
                // Collapse
                this.setAttribute('aria-expanded', 'false');
                this.textContent = 'Leggi di più';
                preview.style.display = 'block';
                full.setAttribute('aria-hidden', 'true');
            } else {
                // Expand
                this.setAttribute('aria-expanded', 'true');
                this.textContent = 'Chiudi';
                preview.style.display = 'none';
                full.setAttribute('aria-hidden', 'false');
                
                // Smooth scroll to testimonial
                testimonial.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

/* ============================================================================
   CONTACT FORM VALIDATION
   Client-side validation with error messages
   ============================================================================ */
(function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    // Form field references
    const fields = {
        childName: document.getElementById('childName'),
        childAge: document.getElementById('childAge'),
        parentName: document.getElementById('parentName'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email')
    };

    const errors = {
        childName: document.getElementById('childNameError'),
        childAge: document.getElementById('childAgeError'),
        parentName: document.getElementById('parentNameError'),
        phone: document.getElementById('phoneError'),
        email: document.getElementById('emailError')
    };

    // Validation functions
    function validateRequired(field, errorElement, fieldName) {
        if (!field.value.trim()) {
            showError(field, errorElement, `${fieldName} è obbligatorio.`);
            return false;
        }
        clearError(field, errorElement);
        return true;
    }

    function validateEmail(field, errorElement) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!field.value.trim()) {
            showError(field, errorElement, 'L\'email è obbligatoria.');
            return false;
        }
        
        if (!emailRegex.test(field.value)) {
            showError(field, errorElement, 'Inserisci un\'email valida.');
            return false;
        }
        
        clearError(field, errorElement);
        return true;
    }

    function validateAge(field, errorElement) {
        const age = parseInt(field.value);
        
        if (!field.value) {
            showError(field, errorElement, 'L\'età è obbligatoria.');
            return false;
        }
        
        if (age < 1 || age > 120) {
            showError(field, errorElement, 'Per favore, inserisci un\'età valida.');
            return false;
        }
        
        clearError(field, errorElement);
        return true;
    }

    function validatePhone(field, errorElement) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        
        if (!field.value.trim()) {
            showError(field, errorElement, 'Il telefono è obbligatorio.');
            return false;
        }
        
        if (!phoneRegex.test(field.value) || field.value.replace(/\D/g, '').length < 9) {
            showError(field, errorElement, 'Inserisci un numero di telefono valido.');
            return false;
        }
        
        clearError(field, errorElement);
        return true;
    }

    function showError(field, errorElement, message) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    function clearError(field, errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }

    // Real-time validation on blur
    if (fields.childName) {
        fields.childName.addEventListener('blur', function() {
            validateRequired(this, errors.childName, 'Il nome del bambino');
        });
    }

    if (fields.childAge) {
        fields.childAge.addEventListener('blur', function() {
            validateAge(this, errors.childAge);
        });
    }

    if (fields.parentName) {
        fields.parentName.addEventListener('blur', function() {
            validateRequired(this, errors.parentName, 'Il nome del genitore');
        });
    }

    if (fields.phone) {
        fields.phone.addEventListener('blur', function() {
            validatePhone(this, errors.phone);
        });
    }

    if (fields.email) {
        fields.email.addEventListener('blur', function() {
            validateEmail(this, errors.email);
        });
    }

    // Form submission validation
    contactForm.addEventListener('submit', function(e) {
        // Validate all fields
        const isChildNameValid = validateRequired(fields.childName, errors.childName, 'Il nome del bambino');
        const isChildAgeValid = validateAge(fields.childAge, errors.childAge);
        const isParentNameValid = validateRequired(fields.parentName, errors.parentName, 'Il nome del genitore');
        const isPhoneValid = validatePhone(fields.phone, errors.phone);
        const isEmailValid = validateEmail(fields.email, errors.email);

        // If all valid, allow form submission to Formspree
        if (isChildNameValid && isChildAgeValid && isParentNameValid && isPhoneValid && isEmailValid) {
            // Form will submit naturally to Formspree
            return true;
        } else {
            // Prevent submission and focus on first error
            e.preventDefault();
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
            return false;
        }
    });
})();

/* ============================================================================
   THANK YOU MODAL
   Shows confirmation after form submission
   ============================================================================ */
function showThankYouModal() {
    const modal = document.getElementById('thankYouModal');
    const closeBtn = document.getElementById('thankYouClose');
    const homeBtn = document.getElementById('thankYouButton');
    
    if (!modal) return;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on close button
    if (closeBtn) {
        closeBtn.focus();
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Home button
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Close on ESC key
    function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    }
    document.addEventListener('keydown', handleEscape);

    // Close when clicking on background
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

/* ============================================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   Provides smooth scrolling for internal page anchors
   ============================================================================ */
(function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#' || href === '#success') {
                e.preventDefault();
                
                // Handle #success for form submission redirect
                if (href === '#success') {
                    showThankYouModal();
                }
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
})();

/* ============================================================================
   IMAGE SLIDER
   Auto-rotating slider with manual controls
   ============================================================================ */
(function initSlider() {
    const slider = document.getElementById('aboutSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slider__slide');
    const dots = slider.querySelectorAll('.slider__dot');
    const prevBtn = slider.querySelector('.slider__arrow--prev');
    const nextBtn = slider.querySelector('.slider__arrow--next');
    
    let currentSlide = 0;
    let autoplayInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 8000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Navigation buttons
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
        startAutoplay();
    });

    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Start autoplay
    startAutoplay();

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
})();

/* ============================================================================
   LAZY LOADING ENHANCEMENT
   Adds fade-in animation to lazy-loaded images
   ============================================================================ */
(function enhanceLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        });
    }
})();

/* ============================================================================
   ACCESSIBILITY ENHANCEMENTS
   Additional keyboard navigation and ARIA updates
   ============================================================================ */
(function initAccessibility() {
    // Trap focus in modals when open
    const modals = document.querySelectorAll('[role="dialog"]');
    
    modals.forEach(modal => {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && this.classList.contains('active')) {
                const focusableElements = this.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    });
})();

/* ============================================================================
   CONSOLE MESSAGE
   Shows info message in browser console
   ============================================================================ */
console.log('%cSito Web del Calcio Seduto', 'color: #f2c14e; font-size: 20px; font-weight: bold;');
console.log('%cCostruito con HTML, CSS e JavaScript.', 'color: #666; font-size: 12px;');
