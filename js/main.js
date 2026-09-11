import { CONFIG } from "./config.js";
import { loadContent, applyTranslations, content } from "./translations.js";
import { mountChrome, applyContactConfig } from "./navigation.js";
import { initCursor } from "./cursor.js";
import {
  initLenis,
  runPreloader,
  initPageTransitions,
  initHeroVisual,
  initAnimations
} from "./animations.js";

function renderHomeServices() {
  const root = document.querySelector("[data-services-preview]");
  if (!root || !content) return;
  root.innerHTML = content.services.items
    .map(
      (item) => `
      <a class="service-row" href="./services.html#${item.id}" data-cursor="view">
        <span class="num">${item.number}</span>
        <span>
          <h3></h3>
          <p></p>
        </span>
        <span class="service-visual" aria-hidden="true"></span>
      </a>`
    )
    .join("");
  refreshServicePreviewCopy();
}

function refreshServicePreviewCopy() {
  const root = document.querySelector("[data-services-preview]");
  if (!root || !content) return;
  [...root.querySelectorAll(".service-row")].forEach((row, i) => {
    const item = content.services.items[i];
    row.querySelector("h3").textContent = item.title[document.documentElement.lang] || item.title.ru;
    row.querySelector("p").textContent = item.short[document.documentElement.lang] || item.short.ru;
  });
}

function renderServicesPage() {
  const root = document.querySelector("[data-services-page]");
  if (!root || !content) return;
  const lang = document.documentElement.lang;
  root.innerHTML = content.services.items
    .map((item) => {
      const chips = (item.subs[lang] || item.subs.ru)
        .map((chip) => `<span class="chip">${chip}</span>`)
        .join("");
      return `
        <article class="service-detail" id="${item.id}">
          <div class="num">${item.number}</div>
          <div>
            <h2>${item.title[lang] || item.title.ru}</h2>
            <p class="lead">${item.long[lang] || item.long.ru}</p>
            <div class="chips">${chips}</div>
          </div>
          <div class="abstract-panel" aria-hidden="true"></div>
        </article>`;
    })
    .join("");
}

function renderAboutBlocks() {
  const root = document.querySelector("[data-about-blocks]");
  if (!root || !content) return;
  const lang = document.documentElement.lang;
  root.innerHTML = content.about.blocks
    .map(
      (block) => `
      <article class="about-block reveal">
        <h2>${block.title[lang] || block.title.ru}</h2>
        <p>${block.text[lang] || block.text.ru}</p>
      </article>`
    )
    .join("");
}

function renderWhy() {
  const root = document.querySelector("[data-why]");
  if (!root || !content) return;
  const lang = document.documentElement.lang;
  root.innerHTML = content.why.items
    .map(
      (item) => `
      <article class="why-item reveal">
        <h3>${item.title[lang] || item.title.ru}</h3>
        <p>${item.text[lang] || item.text.ru}</p>
      </article>`
    )
    .join("");
}

function renderProcess() {
  const root = document.querySelector("[data-process]");
  if (!root || !content) return;
  const lang = document.documentElement.lang;
  root.innerHTML = content.process.steps
    .map(
      (step) => `
      <article class="process-step reveal">
        <span class="process-dot" aria-hidden="true"></span>
        <h3><span class="muted">${step.number}</span><br>${step.title[lang] || step.title.ru}</h3>
        <p>${step.text[lang] || step.text.ru}</p>
      </article>`
    )
    .join("");
}

function renderTech() {
  const root = document.querySelector("[data-tech]");
  if (!root || !content) return;
  const items = content.tech.items.concat(content.tech.items);
  root.innerHTML = `<div class="tech-track">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;
}

function renderContact() {
  const root = document.querySelector("[data-contact-links]");
  if (!root) return;
  root.innerHTML = `
    <a class="contact-link js-telegram" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer" data-cursor="open">
      <span data-i18n="contact.telegram"></span>
      <strong>${CONFIG.telegramHandle}</strong>
      <span class="muted" data-i18n="contact.telegramHint"></span>
    </a>
    <a class="contact-link js-phone" href="${CONFIG.phoneHref}" data-cursor="go">
      <span data-i18n="contact.phone"></span>
      <strong>${CONFIG.phone}</strong>
      <span class="muted">tel</span>
    </a>
    <a class="contact-link js-instagram" href="${CONFIG.instagram}" target="_blank" rel="noopener noreferrer" data-cursor="open">
      <span data-i18n="contact.instagram"></span>
      <strong>${CONFIG.instagramHandle}</strong>
      <span class="muted">Instagram</span>
    </a>
  `;
}

function renderPage() {
  const page = document.body.dataset.page;
  if (page === "home") renderHomeServices();
  if (page === "services") renderServicesPage();
  if (page === "about") {
    renderAboutBlocks();
    renderWhy();
    renderProcess();
    renderTech();
  }
  if (page === "contact") renderContact();
  if (document.querySelector("[data-tech]")) renderTech();
  applyContactConfig();
  applyTranslations();
}

function yearStamp() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

async function boot() {
  try {
    await loadContent();
  } catch (error) {
    console.error(error);
  }
  mountChrome();
  renderPage();
  yearStamp();
  applyContactConfig();
  initPageTransitions();
  initCursor();
  initHeroVisual();
  initLenis();
  await runPreloader();
  initAnimations();
  window.addEventListener("bayhan:lang", () => {
    renderPage();
  });
}

boot();
