const fine = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initCursor() {
  const d = document.querySelector(".cur-d");
  const r = document.querySelector(".cur-r");
  const l = document.querySelector(".cur-l");
  if (!d || !r || !l) return;
  if (!fine() || reduced() || innerWidth < 861) {
    document.documentElement.classList.add("no-cur");
    return;
  }
  document.documentElement.classList.add("has-cur");
  const p = { x: innerWidth / 2, y: innerHeight / 2 };
  const s = { x: p.x, y: p.y };
  const loop = () => {
    s.x += (p.x - s.x) * 0.18;
    s.y += (p.y - s.y) * 0.18;
    d.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
    r.style.transform = `translate3d(${s.x}px,${s.y}px,0)`;
    l.style.transform = `translate3d(${s.x}px,${s.y + 26}px,0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  addEventListener("pointermove", (e) => { p.x = e.clientX; p.y = e.clientY; }, { passive: true });
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("[data-cursor], a, button");
    if (!t) return;
    r.classList.add("on");
    if (t.dataset.cursor) {
      l.textContent = t.dataset.cursor;
      l.style.opacity = "1";
    }
  });
  document.addEventListener("pointerout", (e) => {
    if (!e.target.closest("[data-cursor], a, button")) return;
    r.classList.remove("on");
    l.style.opacity = "0";
  });
  document.addEventListener("pointermove", (e) => {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const b = el.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      if (Math.hypot(dx, dy) < 110) el.style.transform = `translate(${dx * 0.16}px,${dy * 0.16}px)`;
      else el.style.transform = "";
    });
  });
}
