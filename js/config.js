/**
 * Central contact & site configuration.
 * Replace telegram with the administrator username when available.
 * Example: telegram: "https://t.me/username"
 */
export const CONFIG = {
  telegram: "https://t.me/APEX348",
  telegramHandle: "@APEX348",
  phone: "+998507560233",
  phoneHref: "tel:+998507560233",
  instagram: "https://instagram.com/apexstudio_348",
  instagramHandle: "@apexstudio_348",
  siteName: "BAYHAN STUDIO",
  /**
   * Optional absolute origin for SEO after GitHub Pages deploy.
   * Example: "https://your-username.github.io/your-repo"
   * Leave empty to derive from the current location.
   */
  siteUrl: ""
};

export function telegramUrl() {
  return CONFIG.telegram;
}

export function resolveSiteUrl() {
  if (CONFIG.siteUrl) return CONFIG.siteUrl.replace(/\/$/, "");
  if (typeof window === "undefined") return "";
  const { origin, pathname } = window.location;
  const clean = pathname.replace(/\/(?:index|services|about|contact|404)\.html$/i, "/");
  const base = clean.endsWith("/") ? clean : `${clean}/`;
  return `${origin}${base}`.replace(/\/$/, "");
}
