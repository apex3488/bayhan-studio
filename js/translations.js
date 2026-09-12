const KEY = "bayhan-lang";
const LANGS = ["ru", "uz", "en"];
export let content = null;
export let lang = "ru";

export function t(path, fallback = "") {
  if (!content) return fallback;
  const val = path.split(".").reduce((a, k) => (a == null ? a : a[k]), content);
  if (val && typeof val === "object" && LANGS.some((l) => l in val)) return val[lang] || val.ru || fallback;
  return typeof val === "string" ? val : fallback;
}

export async function loadContent() {
  const res = await fetch("./data/content.json", { cache: "no-cache" });
  content = await res.json();
  const saved = localStorage.getItem(KEY);
  lang = LANGS.includes(saved) ? saved : "ru";
  document.documentElement.lang = lang;
  return content;
}

export function setLanguage(next) {
  if (!LANGS.includes(next)) return;
  lang = next;
  localStorage.setItem(KEY, next);
  document.documentElement.lang = next;
  applyTranslations();
  window.dispatchEvent(new CustomEvent("bayhan:lang"));
}

export function applyTranslations() {
  if (!content) return;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = t(el.dataset.i18n, el.textContent);
    el[el.dataset.i18nHtml === "true" ? "innerHTML" : "textContent"] =
      el.dataset.i18nHtml === "true" ? String(v).replace(/\n/g, "<br>") : v;
  });
  const page = document.body.dataset.page || "home";
  const title = t(`meta.${page}.title`);
  const desc = t(`meta.${page}.description`);
  if (title) document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && desc) meta.content = desc;
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(",").forEach((pair) => {
      const [attr, key] = pair.split(":");
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });
  document.querySelectorAll("[data-lang]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
  });
}
