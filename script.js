/**
 * SkillForge – Online Learning Platform
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollTop();
  initActiveNav();
  initInternalNav();
  initFAQ();
  initContactForm();
  initCourseFilter();
  initEnrollButtons();
  initStatsCounter();
});

/* --- Mobile Navigation Toggle --- */
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
}

/* --- Scroll to Top Button --- */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Active Page Navigation Highlighting --- */
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Internal Anchor Navigation Highlighting --- */
function initInternalNav() {
  const pageNavLinks = document.querySelectorAll('.page-nav a');
  if (!pageNavLinks.length) return;

  const sections = [];
  pageNavLinks.forEach(link => {
    const id = link.getAttribute('href')?.replace('#', '');
    if (id) {
      const section = document.getElementById(id);
      if (section) sections.push({ id, el: section, link });
    }
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          pageNavLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.page-nav a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s.el));
}

/* --- FAQ Accordion --- */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      if (!isOpen) item.classList.add('open');
    });
  });
}

/* --- Contact Form Validation & Submit --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    let valid = true;

    [name, email, subject, message].forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        valid = false;
      }
    });

    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = '#ef4444';
      valid = false;
    }

    if (!valid) {
      showToast('Барлық өрістерді дұрыс толтырыңыз');
      return;
    }

    const success = document.querySelector('.form-success');
    if (success) success.classList.add('show');

    showToast('Хабарлама сәтті жіберілді! Жақын арада жауап береміз.');
    form.reset();

    setTimeout(() => {
      if (success) success.classList.remove('show');
    }, 5000);
  });
}

/* --- Course Search & Category Filter --- */
function initCourseFilter() {
  const searchInput = document.getElementById('courseSearch');
  const filterTags = document.querySelectorAll('.filter-tag');
  const cards = document.querySelectorAll('.course-card[data-category]');

  if (!cards.length) return;

  let activeCategory = 'all';

  function filterCourses() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const category = card.dataset.category;
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';

      const matchCategory = activeCategory === 'all' || category === activeCategory;
      const matchSearch = !query || title.includes(query) || desc.includes(query);

      card.style.display = matchCategory && matchSearch ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCourses);
  }

  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeCategory = tag.dataset.filter;
      filterCourses();
    });
  });
}

/* --- Enroll Now Buttons --- */
function initEnrollButtons() {
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.dataset.course || 'курс';
      showToast(`«${courseName}» курсына тіркелу сұранысы қабылданды!`);
    });
  });
}

/* --- Animated Statistics Counter --- */
function initStatsCounter() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('kk-KZ') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* --- Toast Notification --- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
