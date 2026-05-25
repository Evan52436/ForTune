/**
 * FORTUNE TUNING - Website Script
 * Interactive features and custom animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DOM Elements
    // ==========================================
    const header = document.querySelector('.header');
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    const navMenu = document.getElementById('navigation-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Booking Drawer Elements
    const bookingDrawer = document.getElementById('booking-system-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawerOverlay = document.getElementById('drawer-overlay-btn');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccessMsg = document.getElementById('booking-success-message');
    const successCloseBtn = document.getElementById('success-close-btn');
    
    // Booking Trigger Buttons
    const bookingCTAs = [
        document.getElementById('nav-booking-cta'),
        document.getElementById('hero-primary-cta'),
        document.getElementById('hero-card-cta'),
        document.getElementById('b2b-cta-btn')
    ];

    // ==========================================
    // 2. Navigation & Sticky Header
    // ==========================================
    // Toggle mobile menu
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileToggle && mobileToggle.classList.contains('open')) {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // Header scroll background change
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ==========================================
    // 3. Smooth Scroll Integration
    // ==========================================
    // Intercept clicks on links pointing to IDs
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if active
                if (mobileToggle && mobileToggle.classList.contains('open')) {
                    mobileToggle.classList.remove('open');
                    navMenu.classList.remove('open');
                    document.body.style.overflow = '';
                }

                // Smooth scroll offset adjustment for header height
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 4. Scrollspy (Active nav link on scroll)
    // ==========================================
    const sections = document.querySelectorAll('section');
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', scrollSpy);

    // ==========================================
    // 5. Booking Drawer Controls
    // ==========================================
    const openBookingDrawer = () => {
        bookingDrawer.classList.add('open');
        bookingDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus the first input field
        setTimeout(() => {
            const nameInput = document.getElementById('client-name');
            if (nameInput) nameInput.focus();
        }, 300);
    };

    const closeBookingDrawer = () => {
        bookingDrawer.classList.remove('open');
        bookingDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Reset form and message state after drawer closes
        setTimeout(() => {
            if (bookingForm) bookingForm.style.display = 'flex';
            if (bookingSuccessMsg) bookingSuccessMsg.style.display = 'none';
            if (bookingForm) bookingForm.reset();
        }, 400);
    };

    // Attach click listeners to all booking buttons
    bookingCTAs.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openBookingDrawer();
            });
        }
    });

    // Close buttons
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeBookingDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeBookingDrawer);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeBookingDrawer);

    // ESC Key listener to close drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingDrawer.classList.contains('open')) {
            closeBookingDrawer();
        }
    });

    // Form Submission Handling
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form data
            const formData = new FormData(bookingForm);
            const dataObj = {};
            formData.forEach((value, key) => {
                if (dataObj[key]) {
                    if (!Array.isArray(dataObj[key])) {
                        dataObj[key] = [dataObj[key]];
                    }
                    dataObj[key].push(value);
                } else {
                    dataObj[key] = value;
                }
            });

            console.log('Booking submitted successfully:', dataObj);
            
            // Show loading animation on button
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Memproses Kalibrasi...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Restore button
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                
                // Switch form layout to success message
                bookingForm.style.display = 'none';
                bookingSuccessMsg.style.display = 'block';
            }, 1500);
        });
    }

    // Set today's date + 1 day as the minimum date for booking
    const bookingDateInput = document.getElementById('booking-date');
    if (bookingDateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 1); // Set to tomorrow
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0
        let dd = today.getDate();
        
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        
        bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
        bookingDateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // ==========================================
    // 6. Tuner Micro-Animation (Hero Preview)
    // ==========================================
    const needle = document.querySelector('.meter-needle');
    const freqDisplay = document.querySelector('.meter-frequency');
    const meterStatus = document.querySelector('.meter-status');
    
    if (needle && freqDisplay) {
        let isTuning = true;
        
        const animateTuner = () => {
            if (!isTuning) return;
            
            // Generate minor deviations around 440 Hz
            // Usually between 439.75 and 440.25 Hz
            const deviation = (Math.random() - 0.5) * 0.4;
            const finalFreq = 440.0 + deviation;
            
            // Calculate corresponding angle for needle (-30 to +30 degrees)
            // Deviation of 0.2 Hz maps to roughly 20 degrees
            const angle = deviation * 100; 
            
            // Update needle translation
            needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            
            // Update digital frequency display
            freqDisplay.innerHTML = `${finalFreq.toFixed(1)} <span class="unit">Hz</span>`;
            
            // Update green status light based on accuracy
            const errorMargin = Math.abs(deviation);
            if (errorMargin < 0.05) {
                meterStatus.innerText = 'PITCH PERFECT';
                meterStatus.style.color = '#22c55e'; // Green
                needle.style.backgroundColor = '#22c55e';
                needle.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.8)';
            } else if (errorMargin < 0.15) {
                meterStatus.innerText = 'CALIBRATED';
                meterStatus.style.color = '#f9ca51'; // Gold/Yellow
                needle.style.backgroundColor = '#f9ca51';
                needle.style.boxShadow = '0 0 10px rgba(249, 202, 81, 0.8)';
            } else {
                meterStatus.innerText = 'ADJUSTING...';
                meterStatus.style.color = '#ef4444'; // Red
                needle.style.backgroundColor = '#ef4444';
                needle.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.8)';
            }
            
            // Continue animation at random intervals (500ms to 1200ms)
            setTimeout(animateTuner, 600 + Math.random() * 800);
        };
        
        // Start the loop
        animateTuner();
    }
});
