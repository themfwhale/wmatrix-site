document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll fade-in animations ──
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // ── Navbar: transparent → solid on scroll ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = nav.offsetHeight;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
      // Close mobile menu
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('navToggle').classList.remove('open');
    });
  });

  // ── Mobile menu toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // ── Active nav link highlight ──
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(s => navObserver.observe(s));

  // ── Contact form ──
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const label = btn.querySelector('span');
    const original = label.textContent;

    label.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        label.textContent = 'Message Sent';
        form.reset();
        setTimeout(() => { label.textContent = original; btn.disabled = false; }, 3000);
      } else {
        label.textContent = 'Error — Try Again';
        btn.disabled = false;
        setTimeout(() => { label.textContent = original; }, 3000);
      }
    } catch {
      label.textContent = 'Error — Try Again';
      btn.disabled = false;
      setTimeout(() => { label.textContent = original; }, 3000);
    }
  });

});
