import { CONFIG } from "./config.js";

const STORAGE_KEY = "bayhan-lang";
const SUPPORTED = ["ru", "uz", "en"];

export let content = null;
export let lang = "ru";

export function t(path, fallback = "") {
  if (!content) return fallback;
  const value = path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), content);
  if (value && typeof value === "object" && SUPPORTED.some((code) => code in value)) {
    return value[lang] ?? value.ru ?? fallback;
  }
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value;
  return fallback;
}

export async function loadContent() {
  const res = await fetch("./data/content.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to load content.json");
  content = await res.json();
  const saved = localStorage.getItem(STORAGE_KEY);
  lang = SUPPORTED.includes(saved) ? saved : "ru";
  document.documentElement.lang = lang;
  return content;
}

export function setLanguage(next) {
  if (!SUPPORTED.includes(next)) return;
  lang = next;
  localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.lang = next;
  applyTranslations();
  window.dispatchEvent(new CustomEvent("bayhan:lang", { detail: { lang } }));
}

export function applyTranslations() {
  if (!content) return;

  document.querySelectorAll("title[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n, el.textContent);
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (el.tagName === "TITLE" || el.tagName === "META") return;
    const value = t(el.dataset.i18n, el.textContent);
    if (el.dataset.i18nHtml === "true") {
      el.innerHTML = String(value).replace(/\n/g, "<br>");
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":").map((part) => part.trim());
      if (attr && key) el.setAttribute(attr, t(key, el.getAttribute(attr) || ""));
    });
  });

  const page = document.body.dataset.page || "home";
  const title = t(`meta.${page}.title`);
  const description = t(`meta.${page}.description`);
  if (title) document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && description) meta.setAttribute("content", description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle && title) ogTitle.setAttribute("content", title);
  if (ogDesc && description) ogDesc.setAttribute("content", description);

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });
}

export { CONFIG, SUPPORTED };
