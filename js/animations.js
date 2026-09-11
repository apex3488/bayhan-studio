const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => window.matchMedia("(max-width: 860px)").matches;

export function initLenis() {
  if (reduced() || typeof Lenis === "undefined") return null;
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    syncTouch: false
  });
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (gsap && ScrollTrigger) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
  } else {
    const tick = (time) => {
      lenis.raf(time);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  return lenis;
}

export function runPreloader() {
  const preloader = document.querySelector(".preloader");
  if (!preloader) return Promise.resolve();
  const seen = sessionStorage.getItem("bayhan-session");
  const bar = preloader.querySelector(".preloader-bar span");
  const pct = preloader.querySelector(".preloader-pct");
  const gsap = window.gsap;

  if (seen || reduced() || !gsap) {
    preloader.classList.add("is-done");
    preloader.style.display = "none";
    sessionStorage.setItem("bayhan-session", "1");
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const state = { v: 0 };
    gsap.to(state, {
      v: 100,
      duration: 0.85,
      ease: "power2.out",
      onUpdate() {
        const value = Math.round(state.v);
        if (bar) bar.style.width = `${value}%`;
        if (pct) pct.textContent = `${value}%`;
      },
      onComplete() {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
          onComplete() {
            preloader.classList.add("is-done");
            preloader.style.display = "none";
            sessionStorage.setItem("bayhan-session", "1");
            resolve();
          }
        });
      }
    });
  });
}

export function initPageTransitions() {
  const veil = document.querySelector(".page-veil");
  const gsap = window.gsap;
  if (!veil) return;

  const incoming = sessionStorage.getItem("bayhan-transition");
  if (incoming && gsap && !reduced()) {
    sessionStorage.removeItem("bayhan-transition");
    gsap.set(veil, { yPercent: 0 });
    gsap.to(veil, { yPercent: -100, duration: 0.7, ease: "power4.inOut", delay: 0.05 });
  } else {
    veil.style.transform = "translateY(-100%)";
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    const sameOrigin = url.origin === window.location.origin;
    const samePath = url.pathname === window.location.pathname;
    const htmlPage = /\.html?$/.test(url.pathname) || /\/$/.test(url.pathname);
    if (!sameOrigin || link.target === "_blank" || event.metaKey || event.ctrlKey || !htmlPage) return;
    if (samePath) return;
    if (reduced() || !gsap) return;

    event.preventDefault();
    sessionStorage.setItem("bayhan-transition", "1");
    gsap.to(veil, {
      yPercent: 0,
      duration: 0.55,
      ease: "power4.inOut",
      onComplete() {
        window.location.href = url.href;
      }
    });
  });
}

export function initHeroVisual() {
  const canvas = document.querySelector(".hero-canvas");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero) return;
  const ctx = canvas.getContext("2d");
  const mobile = isMobile();
  const points = [];
  const count = reduced() ? 0 : mobile ? 28 : 70;
  let width = 0;
  let height = 0;
  let raf = 0;
  const mouse = { x: 0.5, y: 0.5 };
  let running = true;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = Math.floor(rect.width * window.devicePixelRatio);
    height = canvas.height = Math.floor(rect.height * window.devicePixelRatio);
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };

  for (let i = 0; i < count; i += 1) {
    points.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      s: Math.random() * 0.35 + 0.08
    });
  }

  const draw = () => {
    if (!running) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(61,126,255,0.09)";
    ctx.lineWidth = 1;
    const gap = mobile ? 56 : 42;
    const offsetX = (mouse.x - 0.5) * 18;
    const offsetY = (mouse.y - 0.5) * 14;
    for (let x = 0; x <= w; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x + offsetX, 0);
      ctx.lineTo(x - offsetX, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y + offsetY);
      ctx.lineTo(w, y - offsetY);
      ctx.stroke();
    }
    points.forEach((p) => {
      p.y += p.s * 0.0015;
      if (p.y > 1.05) p.y = -0.05;
      const px = p.x * w + (mouse.x - 0.5) * 24;
      const py = p.y * h + (mouse.y - 0.5) * 18;
      ctx.beginPath();
      ctx.fillStyle = "rgba(122,166,255,0.7)";
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };

  resize();
  if (count) raf = requestAnimationFrame(draw);
  window.addEventListener("resize", resize);
  window.addEventListener(
    "pointermove",
    (event) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / rect.width;
      mouse.y = (event.clientY - rect.top) / rect.height;
      const orb = document.querySelector(".hero-orb");
      if (orb && !reduced() && !mobile) {
        orb.style.transform = `translate(${(mouse.x - 0.5) * 24}px, ${(mouse.y - 0.5) * 18}px)`;
      }
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    running = document.visibilityState === "visible";
    if (running && count) raf = requestAnimationFrame(draw);
  });

  return () => cancelAnimationFrame(raf);
}

function splitTitle(el) {
  if (!el || el.dataset.split === "true") return;
  const lines = el.querySelectorAll(".line");
  const targets = lines.length ? lines : [el];
  targets.forEach((line) => {
    const text = line.textContent;
    line.innerHTML = text
      .split("")
      .map((ch) => `<span class="char">${ch === " " ? "&nbsp;" : ch}</span>`)
      .join("");
    line.classList.add("line-mask");
  });
  el.dataset.split = "true";
}

export function initAnimations() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap) return;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const title = document.querySelector(".hero-title");
  if (title && !reduced()) {
    if (isMobile()) {
      gsap.from(title, {
        y: 28,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.9,
        ease: "power3.out"
      });
    } else {
      splitTitle(title);
      gsap.from(title.querySelectorAll(".char"), {
        yPercent: 120,
        opacity: 0,
        filter: "blur(12px)",
        duration: 1.05,
        stagger: 0.028,
        ease: "power4.out",
        delay: 0.05
      });
    }
  }

  gsap.from(".hero-copy, .hero .btn-row, .scroll-hint, .hero-eyebrow", {
    y: 24,
    opacity: 0,
    duration: 0.9,
    stagger: 0.08,
    delay: 0.25,
    ease: "power3.out"
  });

  if (ScrollTrigger && !reduced()) {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle && !isMobile()) {
      gsap.to(heroTitle, {
        y: 80,
        scale: 0.92,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
    gsap.utils.toArray(".reveal").forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 28, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          delay: (i % 3) * 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" }
        }
      );
    });

    const details = document.querySelectorAll(".service-detail");
    if (details.length && !isMobile()) {
      details.forEach((section) => {
        gsap.from(section.querySelector(".abstract-panel"), {
          clipPath: "inset(18% 18% 18% 18%)",
          opacity: 0.4,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 75%" }
        });
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }
}
