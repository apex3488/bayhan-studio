import { CONFIG } from "./config.js";
import { loadContent, applyTranslations, content, lang } from "./translations.js";
import { mountChrome, bindContacts } from "./navigation.js";
import { initCursor } from "./cursor.js";
import { initRobot } from "./robot.js";
import { initMotion } from "./animations.js";

function pick(obj) {
  return obj[lang] || obj.ru || "";
}

function renderStatsAndProcess() {
  const stats = document.querySelector("[data-stats]");
  if (stats && content) {
    stats.innerHTML = content.stats
      .map((s) => `<article><strong>${s.k}</strong><span class="muted">${pick(s.v)}</span></article>`)
      .join("");
  }
  const steps = document.querySelector("[data-steps]");
  if (steps && content) {
    steps.innerHTML = content.process.steps
      .map(
        (s) => `<article class="step reveal"><b>${s.n}</b><h3>${pick(s.t)}</h3><p class="muted">${pick(s.d)}</p></article>`
      )
      .join("");
  }
}

function renderHome() {
  const svc = document.querySelector("[data-svc]");
  if (svc && content) {
    svc.innerHTML = content.services.items
      .map(
        (it) => `<a href="./services.html#${it.id}" data-cursor="OPEN">
          <span class="n">${it.num}</span>
          <span><h3></h3><p></p></span>
          <span class="arr" aria-hidden="true">→</span>
        </a>`
      )
      .join("");
    [...svc.children].forEach((row, i) => {
      const it = content.services.items[i];
      row.querySelector("h3").textContent = pick(it.title);
      row.querySelector("p").textContent = pick(it.text);
    });
  }
  renderStatsAndProcess();
}

function renderServicesPage() {
  const root = document.querySelector("[data-svc-page]");
  if (!root || !content) return;
  root.innerHTML = content.services.items
    .map(
      (it) => `<article class="svc-block" id="${it.id}">
        <span class="n">${it.num}</span>
        <div>
          <h2>${pick(it.title)}</h2>
          <p class="muted">${pick(it.text)}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderContact() {
  const root = document.querySelector("[data-clist]");
  if (!root) return;
  root.innerHTML = `
    <div class="choice">
      <a class="choice-card js-tg" href="${CONFIG.telegram}" target="_blank" rel="noopener noreferrer" data-cursor="CHAT">
        <span class="kicker" data-i18n="contact.write"></span>
        <strong>Telegram</strong>
        <p>${CONFIG.telegramHandle}</p>
      </a>
      <a class="choice-card js-ig" href="${CONFIG.instagram}" target="_blank" rel="noopener noreferrer" data-cursor="OPEN">
        <span class="kicker">Instagram</span>
        <strong>Instagram</strong>
        <p>${CONFIG.instagramHandle}</p>
      </a>
      <div class="choice-card is-call">
        <span class="kicker" data-i18n="contact.call"></span>
        ${CONFIG.phones
          .map(
            (p, i) => `<a class="phone-line js-ph-${i}" href="${p.href}">${p.display}</a>`
          )
          .join("")}
      </div>
    </div>`;
}

async function boot() {
  try {
    await loadContent();
  } catch (e) {
    console.error(e);
  }
  mountChrome();
  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (page === "about") renderStatsAndProcess();
  if (page === "services") renderServicesPage();
  if (page === "contact") renderContact();
  bindContacts();
  applyTranslations();
  initCursor();
  initRobot(document.querySelector(".hero-stage"));
  initMotion();
  window.addEventListener("bayhan:lang", () => {
    if (page === "home") renderHome();
    if (page === "about") renderStatsAndProcess();
    if (page === "services") renderServicesPage();
    if (page === "contact") renderContact();
    bindContacts();
    applyTranslations();
  });
}

boot();
