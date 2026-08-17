(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const currentYear = $("#current-year");
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  initPreloader();
  initNavigation();
  initScrollProgress();
  initCursor();
  initTilt();
  initMagnetic();
  splitHeroWords();
  initAnimations();

  function initPreloader() {
    const preloader = $(".preloader");
    if (!preloader) return;

    const hide = () => {
      setTimeout(() => preloader.classList.add("is-hidden"), reducedMotion ? 50 : 320);
      setTimeout(() => preloader.remove(), reducedMotion ? 100 : 1100);
    };

    if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 1100))
      ]).then(hide);
    } else {
      window.addEventListener("load", hide, { once: true });
      setTimeout(hide, 1200);
    }
  }

  function initNavigation() {
    const header = $(".site-header");
    const toggle = $(".nav-toggle");
    const menu = $(".nav-menu");
    const links = $$(".nav-link");
    const sections = $$("main section[id]");

    const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        menu.classList.toggle("is-open", !open);
        document.body.classList.toggle("menu-open", !open);
      });

      links.forEach(link => link.addEventListener("click", () => closeMenu()));
      document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeMenu();
      });
    }

    function closeMenu() {
      toggle?.setAttribute("aria-expanded", "false");
      menu?.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }

    if ("IntersectionObserver" in window && sections.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
        });
      }, { rootMargin: "-35% 0px -55%", threshold: 0.01 });
      sections.forEach(section => observer.observe(section));
    }
  }

  function initScrollProgress() {
    const bar = $(".scroll-progress span");
    if (!bar) return;

    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function initCursor() {
    if (coarsePointer || reducedMotion) return;
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    if (!dot || !ring) return;

    document.body.classList.add("has-pointer");
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("pointermove", e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    $$("a, button, .tilt-card").forEach(el => {
      el.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
    });
  }

  function initTilt() {
    if (coarsePointer || reducedMotion) return;
    $$(".tilt-card").forEach(card => {
      const max = card.classList.contains("portrait-card") ? 4 : 2.2;
      card.addEventListener("pointermove", e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(0)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      });
    });
  }

  function initMagnetic() {
    if (coarsePointer || reducedMotion) return;
    $$(".magnetic").forEach(el => {
      el.addEventListener("pointermove", e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = "translate(0,0)"; });
    });
  }

  function splitHeroWords() {
    const title = $("[data-split]");
    if (!title || title.dataset.splitReady) return;

    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim()) textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const fragment = document.createDocumentFragment();
      const parts = textNode.nodeValue.split(/(\s+)/);
      parts.forEach(part => {
        if (!part.trim()) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }
        const span = document.createElement("span");
        span.className = "split-word";
        span.textContent = part;
        fragment.appendChild(span);
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    });
    title.dataset.splitReady = "true";
  }

  function initAnimations() {
    if (reducedMotion) {
      $$(".reveal").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      initGsapAnimations();
    } else {
      initFallbackReveal();
    }
  }

  function initGsapAnimations() {
    gsap.set(".reveal", { opacity: 0, y: 34 });

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.28 });
    heroTl
      .from(".site-header", { y: -22, opacity: 0, duration: 0.7 })
      .from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.55 }, "-=0.35")
      .from(".hero-title .split-word", { yPercent: 110, opacity: 0, rotateX: -40, stagger: 0.045, duration: 0.75, transformOrigin: "50% 100%" }, "-=0.2")
      .from(".hero-lead", { y: 20, opacity: 0, duration: 0.65 }, "-=0.45")
      .from(".hero-actions > *", { y: 18, opacity: 0, stagger: 0.09, duration: 0.5 }, "-=0.4")
      .from(".hero-socials > *", { y: 12, opacity: 0, stagger: 0.06, duration: 0.42 }, "-=0.3")
      .from(".portrait-stage", { x: 44, opacity: 0, scale: 0.96, duration: 0.9 }, "-=0.9")
      .from(".floating-chip", { scale: 0.75, opacity: 0, stagger: 0.08, duration: 0.55 }, "-=0.45");

    gsap.to(".gradient-text", { backgroundPosition: "100% 50%", duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".portrait-card", { y: -8, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".orbit--outer", { rotation: "+=360", duration: 26, repeat: -1, ease: "none" });
    gsap.to(".orbit--inner", { rotation: "-=360", duration: 21, repeat: -1, ease: "none" });
    gsap.to(".floating-chip--one", { y: -9, x: 4, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".floating-chip--two", { y: 8, x: -4, duration: 3.1, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".floating-chip--three", { y: -7, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".floating-chip--four", { y: 7, duration: 2.7, repeat: -1, yoyo: true, ease: "sine.inOut" });

    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.82, stagger: 0.09, ease: "power3.out", overwrite: true })
    });

    gsap.from(".skill-panel", {
      scrollTrigger: { trigger: ".skills-grid", start: "top 82%", once: true },
      opacity: 0, y: 55, rotateX: -8, stagger: 0.10, duration: 0.85, ease: "power3.out"
    });

    gsap.to(".timeline-line span", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 62%", end: "bottom 65%", scrub: true }
    });

    gsap.from(".experience-card", {
      scrollTrigger: { trigger: ".timeline", start: "top 82%", once: true },
      opacity: 0, x: 34, stagger: 0.12, duration: 0.75, ease: "power3.out"
    });

    gsap.from(".project-card", {
      scrollTrigger: { trigger: ".projects-grid", start: "top 86%", once: true },
      opacity: 0, y: 52, stagger: 0.09, duration: 0.72, ease: "power3.out"
    });

    gsap.to(".architecture-board", {
      y: -12,
      scrollTrigger: { trigger: ".project-featured", start: "top bottom", end: "bottom top", scrub: 1.2 }
    });

    gsap.to(".portrait-stage", {
      y: 38,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.3 }
    });

    animateCounters();
  }

  function animateCounters() {
    $$("[data-count]").forEach(el => {
      const target = Number(el.dataset.count);
      const obj = { value: 0 };
      const format = value => {
        if (target >= 1000) return Math.round(value).toLocaleString("en-US");
        return Math.round(value).toString();
      };
      gsap.to(obj, {
        value: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => { el.textContent = format(obj.value); }
      });
    });
  }

  function initFallbackReveal() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.transition = "opacity .7s ease, transform .7s ease";
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    $$(".reveal").forEach(el => {
      el.style.opacity = 0;
      el.style.transform = "translateY(28px)";
      observer.observe(el);
    });
  }
})();
