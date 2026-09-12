import { CONFIG } from "./config.js";
import { t, setLanguage, applyTranslations } from "./translations.js";

export function bindContacts(root = document) {
  root.querySelectorAll(".js-tg").forEach((el) => {
    el.setAttribute("href", CONFIG.telegram);
    if (!el.querySelector("strong") && !el.children.length) el.textContent = CONFIG.telegramHandle;
  });
  root.querySelectorAll(".js-ig").forEach((el) => {
    el.setAttribute("href", CONFIG.instagram);
    if (!el.querySelector("strong") && !el.children.length) el.textContent = CONFIG.instagramHandle;
  });
  CONFIG.phones.forEach((p, i) => {
    root.querySelectorAll(`.js-ph-${i}`).forEach((el) => {
      el.setAttribute("href", p.href);
      if (!el.children.length) el.textContent = p.display;
    });
  });
}

export function mountChrome() {
  const header = document.getElementById("nav");
  const sheet = document.getElementById("sheet");
  const foot = document.getElementById("foot");
  const page = document.body.dataset.page || "home";
  const links = [
    { id: "services", href: "./services.html" },
    { id: "about", href: "./about.html" },
    { id: "contact", href: "./contact.html" }
  ];
  const navLinks = links
    .map((l) => `<a href="${l.href}" data-i18n="nav.${l.id}"${page === l.id ? ' class="is-on"' : ""}></a>`)
    .join("");
  const phones = CONFIG.phones
    .map((p, i) => `<a class="js-ph-${i}" href="${p.href}">${p.display}</a>`)
    .join("");

  if (header) {
    header.innerHTML = `
      <a class="brand" href="./index.html">BAYHAN</a>
      <nav class="nav-links" aria-label="Primary">${navLinks}</nav>
      <div class="nav-end">
        <div class="lang" role="group" aria-label="Language">
          <button type="button" data-lang="ru">RU</button>
          <button type="button" data-lang="uz">UZ</button>
          <button type="button" data-lang="en">EN</button>
        </div>
        <a class="btn nav-cta js-tg magnetic" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer" data-cursor="GO">
          <span data-i18n="nav.cta"></span><span class="arr">→</span>
        </a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="sheet" data-i18n-attr="aria-label:nav.open">
          <span></span>
        </button>
      </div>`;
  }

  if (sheet) {
    sheet.innerHTML = `${links.map((l) => `<a href="${l.href}" data-i18n="nav.${l.id}"></a>`).join("")}
      <a class="btn js-tg" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer"><span data-i18n="nav.cta"></span><span class="arr">→</span></a>
      <div class="lang" role="group" aria-label="Language">
        <button type="button" data-lang="ru">RU</button>
        <button type="button" data-lang="uz">UZ</button>
        <button type="button" data-lang="en">EN</button>
      </div>`;
  }

  if (foot) {
    foot.innerHTML = `
      <div class="wrap">
        <p class="foot-brand">BAYHAN STUDIO</p>
        <p class="muted" data-i18n="footer.tag"></p>
        <div class="foot-grid">
          <div>
            <h3>Explore</h3>
            ${links.map((l) => `<a href="${l.href}" data-i18n="nav.${l.id}"></a>`).join("")}
          </div>
          <div>
            <h3>Telegram</h3>
            <a class="js-tg" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer">${CONFIG.telegramHandle}</a>
          </div>
          <div>
            <h3>Instagram</h3>
            <a class="js-ig" href="${CONFIG.instagram}" target="_blank" rel="noopener noreferrer">${CONFIG.instagramHandle}</a>
          </div>
          <div>
            <h3 data-i18n="contact.call"></h3>
            ${phones}
          </div>
          <div>
            <h3>Language</h3>
            <div class="lang">
              <button type="button" data-lang="ru">RU</button>
              <button type="button" data-lang="uz">UZ</button>
              <button type="button" data-lang="en">EN</button>
            </div>
          </div>
        </div>
        <div class="foot-bot">
          <span data-i18n="footer.copy"></span>
          <span>BAYHAN STUDIO</span>
        </div>
      </div>`;
  }

  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => setLanguage(b.dataset.lang)));
  bindContacts();
  applyTranslations();

  const burger = document.querySelector(".burger");
  const close = () => {
    sheet?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-on");
  };
  burger?.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    if (open) close();
    else {
      sheet.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-on");
    }
  });
  sheet?.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  const onScroll = () => header?.classList.toggle("is-compact", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
