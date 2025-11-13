// Toggle mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Contact form submission simulation
function handleSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name && email && message) {
    alert(`Thank you, ${name}! Your message has been sent.`);
    event.target.reset();
  }
  return false;
}
// User Management System
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    registerUser(userData) {
        const { email, username, password, profilePhoto, assets } = userData;
        if (this.users[email]) {
            throw new Error('User already exists');
        }

        this.users[email] = {
            username,
            password, // In a real app, this should be hashed
            profilePhoto,
            assets: assets.split(',').map(asset => asset.trim()),
            loginHistory: [],
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    }

    loginUser(email, password) {
        const user = this.users[email];
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }

        // Record login time
        user.loginHistory.push({
            timestamp: new Date().toISOString(),
            device: navigator.userAgent
        });

        this.currentUser = {
            email,
            username: user.username,
            profilePhoto: user.profilePhoto,
            assets: user.assets,
            lastLogin: user.loginHistory[user.loginHistory.length - 1]
        };

        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return this.currentUser;
    }

    logoutUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateUserProfile(email, updates) {
        if (!this.users[email]) {
            throw new Error('User not found');
        }

        this.users[email] = { ...this.users[email], ...updates };
        localStorage.setItem('users', JSON.stringify(this.users));

        if (this.currentUser && this.currentUser.email === email) {
            this.currentUser = { ...this.currentUser, ...updates };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }
}

// Initialize User Manager
const userManager = new UserManager();

document.addEventListener('DOMContentLoaded', () => {
    // Handle login/register forms if they exist
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerLink = document.querySelector('.register-link');
    const loginLink = document.querySelector('.login-link');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const profilePhoto = document.getElementById('profilePhoto');
    const profilePreview = document.getElementById('profilePreview');

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    if (profilePhoto) {
        profilePhoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePreview.style.display = 'block';
                    profilePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const user = userManager.loginUser(email, password);
                
                // Show success message
                alert('Login successful!');
                
                // Redirect to main page
                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const userData = {
                    email: document.getElementById('registerEmail').value,
                    username: document.getElementById('username').value,
                    password: document.getElementById('registerPassword').value,
                    profilePhoto: profilePreview.src,
                    assets: document.getElementById('assets').value
                };

                userManager.registerUser(userData);
                alert('Registration successful! Please login.');
                
                // Switch to login form
                registerSection.style.display = 'none';
                loginSection.style.display = 'block';
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Update UI based on login status
    const currentUser = userManager.getCurrentUser();
    if (currentUser) {
        // Update any UI elements that should show user info
        const loginNavLink = document.querySelector('.login-nav');
        if (loginNavLink) {
            loginNavLink.textContent = currentUser.username;
        }
    }

    // Navigation elements
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.has-dropdown');
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    
    // Slider elements
    const slider = document.querySelector('.slider');
    const slides = document.querySelector('.slides');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const totalSlides = document.querySelectorAll('.slide').length;
    let currentSlide = 0;

    // Create dots for slider navigation
    const sliderDots = document.querySelector('.slider-dots');
    if (sliderDots) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
            });
            sliderDots.appendChild(dot);
        }
    }

    // Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Dropdown Menu
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
            // Close other dropdowns
            dropdowns.forEach(other => {
                if (other !== dropdown) other.classList.remove('active');
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-dropdown')) {
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Sidebar Functions
    function openSidebar() {
        sidebar.classList.add('active');
        sidebar.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebar.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openSidebarBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') &&
            !e.target.closest('#sidebar') &&
            !e.target.closest('#openSidebar')) {
            closeSidebar();
        }
    });

    // Slider/Carousel Functions
    function updateSlider() {
        // Add transition lock to prevent rapid changes
        if (slides.dataset.transitioning === 'true') {
            return;
        }

        const offset = -currentSlide * 100;
        slides.style.transform = `translateX(${offset}%)`;
        updateSliderButtons();
        
        // Update dots
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Update slide animations with longer duration
        const currentSlideElement = document.querySelectorAll('.slide')[currentSlide];
        const slideText = currentSlideElement.querySelector('.slide-text');
        slideText.style.animation = 'none';
        slideText.offsetHeight; // Trigger reflow
        slideText.style.animation = 'slideInLeft 0.8s ease-out';

        // Set transitioning flag
        slides.dataset.transitioning = 'true';
        setTimeout(() => {
            slides.dataset.transitioning = 'false';
        }, 800); // Match the CSS transition duration
    }

    function updateSliderButtons() {
        prevBtn.style.display = currentSlide === 0 ? 'none' : 'block';
        nextBtn.style.display = currentSlide === totalSlides - 1 ? 'none' : 'block';
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlider();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }

    // Auto-advance slider with longer interval
    let sliderInterval = setInterval(nextSlide, 8000); // Increased from 5000 to 8000ms

    // Pause auto-advance on hover or interaction
    let userInteracting = false;
    const resetTimer = () => {
        clearInterval(sliderInterval);
        if (!userInteracting) {
            sliderInterval = setInterval(nextSlide, 8000);
        }
    };

    slider.addEventListener('mouseenter', () => {
        userInteracting = true;
        clearInterval(sliderInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        userInteracting = false;
        resetTimer();
    });

    // Slider controls with debounce
    let isButtonClickable = true;

    function handleButtonClick(direction) {
        if (!isButtonClickable || slides.dataset.transitioning === 'true') {
            return;
        }

        isButtonClickable = false;
        clearInterval(sliderInterval);
        userInteracting = true;

        if (direction === 'next') {
            nextSlide();
        } else {
            prevSlide();
        }

        // Reset button clickability after transition
        setTimeout(() => {
            isButtonClickable = true;
            userInteracting = false;
            resetTimer();
        }, 800); // Match the CSS transition duration
    }

    nextBtn.addEventListener('click', () => handleButtonClick('next'));
    prevBtn.addEventListener('click', () => handleButtonClick('prev'));

    // Initialize slider
    updateSliderButtons();

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu and sidebar if open
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                closeSidebar();
            }
        });
    });

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add form submission animation
            const button = contactForm.querySelector('button');
            button.classList.add('submitting');
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                button.classList.remove('submitting');
                button.classList.add('success');
                button.textContent = 'Message Sent!';
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    button.classList.remove('success');
                    button.textContent = 'Send Message';
                }, 3000);
            }, 1500);
        });
    }

    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe sections and cards for animation
    document.querySelectorAll('.section, .card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Handle card horizontal scroll
    const cardContainer = document.querySelector('.cards.horizontal');
    if (cardContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        cardContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            cardContainer.classList.add('active');
            startX = e.pageX - cardContainer.offsetLeft;
            scrollLeft = cardContainer.scrollLeft;
        });

        cardContainer.addEventListener('mouseleave', () => {
            isDown = false;
            cardContainer.classList.remove('active');
        });

        cardContainer.addEventListener('mouseup', () => {
            isDown = false;
            cardContainer.classList.remove('active');
        });

        cardContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - cardContainer.offsetLeft;
            const walk = (x - startX) * 2;
            cardContainer.scrollLeft = scrollLeft - walk;
        });
    }
});
    

    // Login form handling (if present)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            // password intentionally unused in demo
            console.log('Login attempt:', { email });
            alert('Login functionality will be implemented soon!');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const el = document.querySelector(href);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger / mobile menu: open sidebar when hamburger clicked
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            // toggle nav on very small screens
            const nav = document.querySelector('.nav-links');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    if (openSidebarBtn && sidebar) {
        openSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebar.setAttribute('aria-hidden', 'false');
        });
    }
    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebar.setAttribute('aria-hidden', 'true');
        });
    }

    // Dropdown in nav (desktop)
    document.querySelectorAll('.has-dropdown > a').forEach((a) => {
        a.addEventListener('click', function (e) {
            // allow anchor but toggle dropdown on small clicks
            const parent = this.parentElement;
            if (parent) {
                e.preventDefault();
                parent.classList.toggle('open');
            }
        });
    });

    // Slider implementation
    const slidesWrapper = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentIndex = 0;
    let slideInterval = null;

    function goToSlide(index) {
        if (!slidesWrapper) return;
        const total = slides.length;
        currentIndex = (index + total) % total;
        slidesWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    function startInterval() {
        slideInterval = setInterval(() => { nextSlide(); }, 5000);
    }
    function resetInterval() { clearInterval(slideInterval); startInterval(); }

    if (slides && slides.length > 0) startInterval();

    // Add team photo gracefully
    const teamSection = document.getElementById('about');
    if (teamSection) {
        const existing = teamSection.querySelector('.team-photo');
        if (!existing) {
            const teamImage = document.createElement('img');
            teamImage.src = 'assets/team.jpg';
            teamImage.alt = 'Our Team';
            teamImage.className = 'team-photo';
            teamSection.appendChild(teamImage);
        }
    }

    // CTA button demo behavior (non-blocking)
    const cta = document.querySelector('.cta-button');
    if (cta) cta.addEventListener('click', () => { console.log('CTA clicked'); });
;
