const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initMotion() {
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  if (!gsap) return;
  if (ST) gsap.registerPlugin(ST);

  if (window.Lenis && !reduced()) {
    const lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    if (ST) lenis.on("scroll", ST.update);
  }

  if (!reduced()) {
    gsap.from(".hero h1, .hero-meta, .hero .lead, .hero .btn, .scroll-ind", {
      y: 28,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "filter"
    });
  }

  if (ST && !reduced()) {
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" }
      });
    });
    const horizon = document.querySelector(".js-horizon");
    const track = horizon?.querySelector(".horizon-track");
    if (track && innerWidth > 860) {
      gsap.to(track, {
        x: () => -(track.scrollWidth - innerWidth * 0.35),
        ease: "none",
        scrollTrigger: {
          trigger: horizon,
          start: "top 22%",
          end: "+=1400",
          pin: true,
          scrub: 0.75
        }
      });
    }
    const core = document.querySelector(".core");
    if (core) {
      addEventListener("pointermove", (e) => {
        const b = core.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5;
        const y = (e.clientY - b.top) / b.height - 0.5;
        core.style.transform = `translate(${x * 12}px, ${y * 10}px)`;
      }, { passive: true });
    }
  }

  const veil = document.querySelector(".page-veil");
  if (veil && gsap && !reduced()) {
    const incoming = sessionStorage.getItem("bayhan-tr");
    if (incoming) {
      sessionStorage.removeItem("bayhan-tr");
      gsap.set(veil, { yPercent: 0 });
      gsap.to(veil, { yPercent: -100, duration: 0.65, ease: "power4.inOut" });
    }
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      if (!/\.html?$/.test(url.pathname) && !/\/$/.test(url.pathname)) return;
      e.preventDefault();
      sessionStorage.setItem("bayhan-tr", "1");
      gsap.to(veil, { yPercent: 0, duration: 0.5, ease: "power4.inOut", onComplete: () => { location.href = url.href; } });
    });
  }

  document.querySelectorAll(".svc a").forEach((row) => {
    row.addEventListener("click", (ev) => {
      if (innerWidth > 860) return;
      if (row.getAttribute("href")?.startsWith("#") || row.dataset.toggle === "1") {
        ev.preventDefault();
        row.classList.toggle("is-open");
      }
    });
  });
}
