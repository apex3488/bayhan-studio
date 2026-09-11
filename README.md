# BAYHAN STUDIO

Digital Agency Website.

Статический сайт digital / technology studio. Без backend, без форм заявок, без фейковых кабинетов. Все CTA ведут в Telegram администратора.

## Tech

- HTML
- CSS
- JavaScript
- GSAP
- ScrollTrigger
- Lenis

## Local preview

Сайт нужно открывать через локальный сервер — `content.json` не загрузится через `file://`.

```bash
python -m http.server 8080
```

Затем откройте `http://localhost:8080`.

## Telegram

Username администратора задаётся в одном месте: `js/config.js`.

```js
telegram: "https://t.me/REPLACE_WITH_ADMIN_USERNAME"
```

После появления username замените значение только там. Телефон и Instagram уже указаны.

## GitHub Pages

1. Создайте репозиторий на GitHub (`New repository`).
2. Загрузите файлы проекта в корень репозитория (не внутрь лишней папки).
3. Сделайте commit и push.
4. Откройте **Settings**.
5. Откройте **Pages**.
6. В **Build and deployment** выберите **Deploy from a branch**.
7. Branch: **main** (или `master`).
8. Folder: **/ (root)**.
9. Нажмите **Save**.

Через одну–две минуты сайт будет доступен по адресу:

`https://<username>.github.io/<repository>/`

Если репозиторий называется `<username>.github.io`, сайт откроется на корневом домене Pages.

## Обновление сайта через Git

```bash
git add .
git commit -m "Update site"
git push
```

GitHub Pages подхватит изменения с ветки, указанной в Settings → Pages.

## Структура

```
/
├── index.html
├── services.html
├── about.html
├── contact.html
├── 404.html
├── assets/
├── css/
├── js/
├── data/content.json
├── robots.txt
├── sitemap.xml
└── README.md
```

Тексты RU / UZ / EN хранятся в `data/content.json`. Язык по умолчанию — русский, выбор сохраняется в `localStorage`.

## SEO

После деплоя можно прописать абсолютный адрес сайта в `js/config.js` → `siteUrl` и обновить `sitemap.xml` / `robots.txt` под финальный URL.
