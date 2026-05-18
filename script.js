/* =========================================================
   Richellou L. Arbuis — Portfolio
   Interactions: nav, reveal, active link, hover spotlight
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  const closeMenu = () => {
    navToggle?.classList.remove('is-open');
    navLinks?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };

  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a link is clicked (mobile)
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Sticky nav: shrink on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  // CSS `scroll-behavior: smooth` handles this; we just adjust for sticky nav offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - (navHeight + 12);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .section__head, .service, .timeline__item, .skills__group, .edu, .contact__card');

  // mark them so they animate in (add `reveal` baseline class via JS to extras)
  revealEls.forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));

  // Hero elements visible immediately (don't wait for scroll-in)
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'));
  });

  /* ---------- Active link highlighting ---------- */
  const sections = ['about', 'expertise', 'experience', 'skills', 'education', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const linkMap = new Map();
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) linkMap.set(href.slice(1), link);
  });

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkMap.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        linkMap.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => activeObserver.observe(s));

  /* ---------- Service card spotlight (mouse-tracked) ---------- */
  document.querySelectorAll('.service').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', `50%`);
      card.style.setProperty('--my', `0%`);
    });
  });

  /* ---------- Portrait subtle parallax on pointer ---------- */
  const portrait = document.querySelector('.portrait');
  if (portrait && window.matchMedia('(pointer:fine)').matches) {
    const img  = portrait.querySelector('.portrait__img');
    const glow = portrait.querySelector('.portrait__glow');
    let raf = null;

    portrait.addEventListener('mousemove', (e) => {
      const rect = portrait.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 .. 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (img)  img.style.transform  = `scale(1.04) translate(${x * -8}px, ${y * -8}px)`;
        if (glow) glow.style.transform = `translate(${x * 14}px, ${y * 14}px)`;
      });
    });

    portrait.addEventListener('mouseleave', () => {
      if (img)  img.style.transform  = '';
      if (glow) glow.style.transform = '';
    });
  }
})();
