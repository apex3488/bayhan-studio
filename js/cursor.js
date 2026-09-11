import { t } from "./translations.js";

const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const label = document.querySelector(".cursor-label");
  if (!dot || !ring || !label) return;

  if (!finePointer() || reduced()) {
    document.documentElement.classList.add("no-cursor");
    document.documentElement.classList.remove("has-custom-cursor");
    return;
  }

  document.documentElement.classList.add("has-custom-cursor");
  document.documentElement.classList.remove("no-cursor");

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: pos.x, y: pos.y };
  let raf = 0;

  const loop = () => {
    ringPos.x += (pos.x - ringPos.x) * 0.18;
    ringPos.y += (pos.y - ringPos.y) * 0.18;
    dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    label.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y + 28}px, 0)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  window.addEventListener(
    "pointermove",
    (event) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
    },
    { passive: true }
  );

  const setState = (el, active) => {
    const key = el?.dataset.cursor;
    ring.classList.toggle("is-hover", Boolean(active && key));
    if (active && key) {
      label.textContent = t(`cursor.${key}`, key);
      label.style.opacity = "1";
    } else {
      label.style.opacity = "0";
    }
  };

  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest("[data-cursor], a, button");
    if (!target) return;
    if (!target.dataset.cursor) {
      if (target.matches("a, button")) ring.classList.add("is-hover");
      return;
    }
    setState(target, true);
  });

  document.addEventListener("pointerout", (event) => {
    const target = event.target.closest("[data-cursor], a, button");
    if (!target) return;
    setState(target, false);
    ring.classList.remove("is-hover");
  });

  const magnets = () => document.querySelectorAll(".magnetic");
  document.addEventListener("pointermove", (event) => {
    magnets().forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
      } else {
        el.style.transform = "";
      }
    });
  });

  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
}
