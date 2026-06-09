/* ── Cursor ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

/* scale ring on interactive elements */
document.querySelectorAll('a, button, .project-card, .skill-card, .about-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.7)');
  el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ── Navbar hide/show on scroll ── */
const navbar = document.getElementById('navbar');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('hidden', y > lastY && y > 80);
  lastY = y;
}, { passive: true });

/* ── Mobile nav toggle ── */
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks     = document.getElementById('nav-links');
mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
});

/* ── Scroll reveal (IntersectionObserver) ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ── Project modal ── */
const overlay    = document.getElementById('modal-overlay');
const modalEmoji = document.getElementById('modal-emoji');
const modalTitle = document.getElementById('modal-title');
const modalDesc  = document.getElementById('modal-desc');
const modalStack = document.getElementById('modal-stack');

function openModal(card) {
  modalEmoji.textContent  = card.dataset.emoji;
  modalTitle.textContent  = card.dataset.title;
  modalDesc.textContent   = card.dataset.desc;
  modalStack.innerHTML    = card.dataset.stack.split(',').map(t =>
    `<span class="card-tag">${t.trim()}</span>`).join('');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});
document.getElementById('modal-close').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Contact form send ── */
document.getElementById('send-btn').addEventListener('click', function() {
  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('message').value.trim();
  if (!name || !email || !msg) {
    /* simple shake feedback */
    const form = this.closest('.contact-form');
    form.style.animation = 'none';
    form.offsetHeight;
    return;
  }
  this.textContent = 'Message Sent ✓';
  this.classList.add('sent');
  document.getElementById('name').value    = '';
  document.getElementById('email').value   = '';
  document.getElementById('message').value = '';
});


// Listen for scroll events to trigger the social bar
window.addEventListener('scroll', () => {
  const socialBar = document.querySelector('.floating-socials');
  const heroSection = document.getElementById('hero');
  
  // Get the height of the hero section
  const heroHeight = heroSection.offsetHeight;
  
  // If we've scrolled past the hero section (minus a 50px buffer)
  if (window.scrollY > heroHeight - 50) {
    socialBar.classList.add('show-socials');
  } else {
    // Hide it again if they scroll back to the very top
    socialBar.classList.remove('show-socials');
  }
});


document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the page from refreshing

    const btn = document.getElementById('send-btn');
    btn.innerHTML = 'Sending...'; // Changes button text while loading

    // Replace these with your actual IDs from Step 1
    const serviceID = 'service_c1chzna';
    const templateID = 'template_sehknf8';

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        // Success!
        btn.innerHTML = 'Sent Successfully! ✓';
        btn.classList.add('sent'); // Turns the button green using your CSS
        this.reset(); // Clears the form
        
        // Optional: Reset button back to normal after 3 seconds
        setTimeout(() => {
            btn.innerHTML = 'Send Message <span>→</span>';
            btn.classList.remove('sent');
        }, 3000);
        
      }, (err) => {
        // Error handling
        btn.innerHTML = 'Error. Try Again.';
        console.log(JSON.stringify(err));
      });
});