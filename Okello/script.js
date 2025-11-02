document.addEventListener('DOMContentLoaded', () => {
    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for contacting Kogalo Comrades Association!');
        });
    }

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
});
