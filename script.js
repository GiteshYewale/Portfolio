/* ============================================================
   PORTFOLIO SCRIPT
   ------------------------------------------------------------
   What this file does:
     1. Hide the loading screen when the page loads
     2. Start the AOS scroll animations
     3. Show/hide sections (simple SPA navigation)
     4. Toggle the hamburger menu on mobile
     5. Update the scroll progress bar
     6. Show the "back to top" button after scrolling
     7. Custom cursor that follows the mouse
     8. Animate the stats counters and skill bars
     9. Handle the contact form submit
   ============================================================ */


/* ===== 1. LOADING SCREEN =====
   After the page finishes loading, wait 1.2s then
   add the .hide class so the loader fades out. */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hide');
    }, 1200);
});


/* ===== 2. AOS SCROLL ANIMATIONS =====
   Initializes the "Animate On Scroll" library.
   The try/catch just prevents errors if the CDN is offline. */
try {
    AOS.init({
        duration: 800,     // animation speed in ms
        easing: 'ease-out-cubic',
        once: true,        // animate only the first time it scrolls into view
        offset: 50
    });
} catch (e) {
    console.warn('AOS failed to load:', e);
}


/* ===== 3. SECTION NAVIGATION =====
   Called from the navbar links (onclick="showSection('about')").
   Shows the chosen section and hides all the others. */
function showSection(sectionId) {

    // Step 1 - Hide every section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden-section');
    });

    // Step 2 - Show only the chosen one
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove('hidden-section');
        activeSection.classList.add('active-section');
    }

    // Step 3 - Highlight the matching link in the navbar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });

    // Step 4 - Close the mobile hamburger menu
    const navlist = document.getElementById('navlist');
    const hamburger = document.getElementById('hamburger');
    navlist.classList.remove('open');
    hamburger.classList.remove('active');

    // Step 5 - On the Home page show the profile photo on the right,
    //          on any other page make the content full-width
    const design = document.querySelector('.design');
    const portfolio = document.querySelector('.protfolio');
    const rightContainer = document.querySelector('.right-container');
    if (sectionId === 'home') {
        design.classList.remove('design-hidden');
        portfolio.classList.remove('full-width');
        if (rightContainer) rightContainer.style.display = '';
    } else {
        design.classList.add('design-hidden');
        portfolio.classList.add('full-width');
        if (rightContainer) rightContainer.style.display = 'none';
    }

    // Step 6 - Run section-specific animations
    if (sectionId === 'skills') {
        setTimeout(animateSkillBars, 300);
    }
    if (sectionId === 'home') {
        setTimeout(animateCounters, 300);
    }
}


/* ===== 4. HAMBURGER MENU (mobile) =====
   Toggles the .open class on the menu and the .active class
   on the hamburger (which turns the 3 lines into an X). */
const hamburger = document.getElementById('hamburger');
const navlist = document.getElementById('navlist');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navlist.classList.toggle('open');
});

// Close the menu when the user clicks anywhere outside of it
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navlist.contains(e.target)) {
        hamburger.classList.remove('active');
        navlist.classList.remove('open');
    }
});


/* ===== 5. SCROLL PROGRESS BAR =====
   As the user scrolls, calculate how far down the page they are
   and set the bar width to that percentage. */
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});


/* ===== 6. BACK TO TOP BUTTON =====
   Appears once the user scrolls more than 300px down.
   Clicking it scrolls smoothly back to the top. */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ===== 7. CUSTOM CURSOR (desktop only) =====
   A small dot follows the mouse instantly, and a larger
   outline follows it with a smooth delay. */
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

let mouseX = 0, mouseY = 0;          // where the mouse really is
let outlineX = 0, outlineY = 0;      // where the outline currently is

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

// Each animation frame, move the outline a bit closer to the mouse
// so it lags behind smoothly (0.12 = how much to move per frame)
function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Grow the outline when hovering over clickable elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .about-card, .skill-category, .tag, input, textarea');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
});


/* ===== 8. ANIMATIONS ===== */

/* Stats counters: count up from 0 to the value in data-target */
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;    // only run once

    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;       // 2 seconds
        const step = target / (duration / 16);   // steps per 16ms frame
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                countersAnimated = true;
            }
        };
        updateCounter();
    });
}

/* Skill bars: fill them to the percentage in data-width */
function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
    });
}


/* ===== 9. CONTACT FORM =====
   There is no real backend, so on submit we just show
   a "Message Sent!" message for 3 seconds, then reset. */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}


/* ===== 10. RUN ON FIRST LOAD =====
   Count up the stats numbers as soon as the page is ready. */
document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
});
