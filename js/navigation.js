import { CONFIG } from "./config.js";
import { t, setLanguage, applyTranslations } from "./translations.js";

const pages = [
  { id: "home", href: "./index.html" },
  { id: "services", href: "./services.html" },
  { id: "about", href: "./about.html" },
  { id: "contact", href: "./contact.html" }
];

function currentPage() {
  return document.body.dataset.page || "home";
}

function navMarkup() {
  const page = currentPage();
  const links = pages
    .map((item) => {
      const current = item.id === page ? ' aria-current="page"' : "";
      return `<a href="${item.href}" data-i18n="nav.${item.id}" data-nav="${item.id}"${current}></a>`;
    })
    .join("");

  return `
    <div class="nav-inner">
      <a class="logo" href="./index.html" data-cursor="go">
        <img class="logo-mark" src="./assets/icons/favicon.svg" alt="" width="28" height="28">
        <span>BAYHAN STUDIO</span>
      </a>
      <nav class="nav-links" aria-label="Primary">${links}</nav>
      <div class="nav-end">
        <div class="lang-switch" role="group" aria-label="Language">
          <button type="button" data-lang="ru" aria-pressed="true">RU</button>
          <button type="button" data-lang="uz" aria-pressed="false">UZ</button>
          <button type="button" data-lang="en" aria-pressed="false">EN</button>
        </div>
        <a class="btn btn-primary nav-cta magnetic js-telegram" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer" data-cursor="open">
          <span data-i18n="nav.cta"></span><span class="arrow">→</span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" data-i18n-attr="aria-label:nav.openMenu">
          <span></span>
        </button>
      </div>
    </div>
  `;
}

function mobileMarkup() {
  const page = currentPage();
  const links = pages
    .map((item, index) => {
      const current = item.id === page ? ' aria-current="page"' : "";
      return `<a href="${item.href}" data-i18n="nav.${item.id}" data-nav="${item.id}" data-delay="${index}"${current}></a>`;
    })
    .join("");

  return `
    ${links}
    <a class="btn btn-primary js-telegram" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer">
      <span data-i18n="nav.cta"></span><span class="arrow">→</span>
    </a>
    <div class="lang-switch" role="group" aria-label="Language">
      <button type="button" data-lang="ru">RU</button>
      <button type="button" data-lang="uz">UZ</button>
      <button type="button" data-lang="en">EN</button>
    </div>
  `;
}

function footerMarkup() {
  return `
    <div class="container">
      <p class="footer-brand">BAYHAN STUDIO</p>
      <p class="muted" data-i18n="footer.tagline"></p>
      <div class="footer-grid">
        <div>
          <h3 data-i18n="footer.explore"></h3>
          ${pages.map((item) => `<a href="${item.href}" data-i18n="nav.${item.id}"></a>`).join("")}
        </div>
        <div>
          <h3 data-i18n="footer.connect"></h3>
          <a class="js-telegram" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer">Telegram</a>
          <a class="js-phone" href="${CONFIG.phoneHref}">${CONFIG.phone}</a>
          <a class="js-instagram" href="${CONFIG.instagram}" target="_blank" rel="noopener noreferrer">${CONFIG.instagramHandle}</a>
        </div>
        <div>
          <h3 data-i18n="ctaBlock.start"></h3>
          <a class="js-telegram" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer" data-i18n="ctaBlock.order"></a>
          <a class="js-telegram" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer" data-i18n="ctaBlock.request"></a>
          <a class="js-telegram" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer" data-i18n="ctaBlock.discuss"></a>
        </div>
        <div>
          <h3 data-i18n="footer.language"></h3>
          <div class="lang-switch" role="group" aria-label="Language">
            <button type="button" data-lang="ru">RU</button>
            <button type="button" data-lang="uz">UZ</button>
            <button type="button" data-lang="en">EN</button>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span data-i18n="footer.copyright"></span>
        <span>BAYHAN STUDIO</span>
      </div>
    </div>
  `;
}

function bindLang(root) {
  root.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
}

function bindTelegram(root) {
  root.querySelectorAll(".js-telegram").forEach((el) => {
    el.setAttribute("href", CONFIG.telegram);
  });
  root.querySelectorAll(".js-phone").forEach((el) => {
    el.setAttribute("href", CONFIG.phoneHref);
  });
  root.querySelectorAll(".js-instagram").forEach((el) => {
    el.setAttribute("href", CONFIG.instagram);
  });
}

export function mountChrome() {
  const header = document.getElementById("site-header");
  const mobile = document.getElementById("mobile-nav");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = navMarkup();
  if (mobile) mobile.innerHTML = mobileMarkup();
  if (footer) footer.innerHTML = footerMarkup();

  bindLang(document);
  bindTelegram(document);
  applyTranslations();

  const toggle = document.querySelector(".menu-toggle");
  const panel = document.getElementById("mobile-nav");

  const close = () => {
    if (!panel || !toggle) return;
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", t("nav.openMenu"));
    document.body.classList.remove("nav-open");
    panel.setAttribute("inert", "");
  };

  const open = () => {
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", t("nav.closeMenu"));
    document.body.classList.add("nav-open");
    panel.removeAttribute("inert");
    if (window.gsap) {
      window.gsap.fromTo(
        panel.querySelectorAll("a, .lang-switch"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.55, ease: "power3.out" }
      );
    }
  };

  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  panel?.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function applyContactConfig() {
  bindTelegram(document);
}
