/* ============================================================
   ADHARSHA REDDY — Portfolio JavaScript
   Features:
   1. Typing animation in hero
   2. Active nav link on scroll
   3. Smooth scroll + scroll-to-top button
   4. Custom cursor effect
   5. Card tilt/glow hover effect
============================================================ */


/* ============================================================
   1. TYPING ANIMATION
   Cycles through role titles in the hero section.
   Requires: <span id="typed-text"></span> in your hero-role line
============================================================ */
const typedEl = document.getElementById('typed-text');

const roles = [
  'AI/ML Student',
  'Web Developer',
  'Python Developer',
  'frontend developer',
  'Dashboard Builder',
  'Open to Internships'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const TYPING_SPEED   = 80;   // ms per character typed
const DELETING_SPEED = 40;   // ms per character deleted
const PAUSE_END      = 1800; // ms pause at end of word
const PAUSE_START    = 400;  // ms pause before typing next word

function type() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

  if (!isDeleting && charIndex === current.length) {
    // Finished typing — pause then delete
    delay = PAUSE_END;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting — move to next role
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = PAUSE_START;
  }

  setTimeout(type, delay);
}

if (typedEl) type();


/* ============================================================
   2. ACTIVE NAV LINK ON SCROLL
   Highlights the nav link matching the section currently in view.
============================================================ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (scrollY >= top) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav(); // run once on load


/* ============================================================
   3. SCROLL-TO-TOP BUTTON
   Appears after scrolling 400px. Requires <button id="to-top">
   already injected below — no HTML edits needed.
============================================================ */
const toTop = document.createElement('button');
toTop.id = 'to-top';
toTop.setAttribute('aria-label', 'Back to top');
toTop.innerHTML = '↑';
document.body.appendChild(toTop);

window.addEventListener('scroll', () => {
  toTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   4. CUSTOM CURSOR
   Two-layer cursor: small dot that snaps, larger ring that lags.
   Hides on touch devices automatically.
============================================================ */
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.id  = 'cursor-dot';
ring.id = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

// Ring follows with lerp lag
(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateRing);
})();

// Grow ring on interactive elements
const interactives = 'a, button, .proj, .sk, .stat, #to-top';
document.querySelectorAll(interactives).forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// Hide default cursor on desktop only
if (!('ontouchstart' in window)) {
  document.documentElement.style.cursor = 'none';
}


/* ============================================================
   5. CARD TILT + GLOW ON HOVER
   Applies to .proj and .sk cards — subtle 3D tilt + moving
   radial glow following the mouse within the card.
============================================================ */
const tiltCards = document.querySelectorAll('.proj, .sk');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = e.clientX - cx;
    const dy     = e.clientY - cy;
    const maxTilt = 8; // degrees
    const rotX   = (-dy / (rect.height / 2)) * maxTilt;
    const rotY   = ( dx / (rect.width  / 2)) * maxTilt;

    // Glow position as % within card
    const glowX  = ((e.clientX - rect.left) / rect.width)  * 100;
    const glowY  = ((e.clientY - rect.top)  / rect.height) * 100;

    card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(88,166,255,0.07) 0%, var(--bg) 65%)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.background = '';
    card.style.transition = 'transform 0.5s ease, background 0.5s ease, border-color 0.3s';
    setTimeout(() => card.style.transition = '', 500);
  });
});