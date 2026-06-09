/* =============================================
   MEDINA BROTHERS PROFESSIONAL DETAILING
   Main JavaScript
   ============================================= */

(function () {
  'use strict';

  // ---- Helpers ----
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ---- Sticky Nav ----
  const header = $('#site-header');
  const SCROLL_THRESHOLD = 40;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // ---- Mobile Nav Toggle ----
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  $$('.nav-link', navMenu).forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });

  // ---- Active nav link on scroll ----
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach(sec => sectionObserver.observe(sec));

  // ---- Contact Form ----
  const form = $('#contact-form');
  const formSuccess = $('#form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      const required = $$('[required]', form);
      let valid = true;

      required.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        const firstError = $('.error', form);
        if (firstError) firstError.focus();
        return;
      }

      // Simulate form submission (no real backend in this static build)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send My Quote Request';
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-hide after 6 seconds
        setTimeout(() => {
          formSuccess.hidden = true;
        }, 6000);
      }, 800);
    });
  }

  // ---- Footer Year ----
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Scroll-in Animations (IntersectionObserver) ----
  const animateEls = $$('.service-card, .feature-card, .testimonial-card, .gallery-item, .contact-card, .contact-form');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    animateEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
      fadeObserver.observe(el);
    });

    document.addEventListener('DOMContentLoaded', () => {});
  }

  // Add visible class styles via JS (so CSS stays clean)
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // ---- Smooth anchor scroll ----
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
