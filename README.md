# Jeyanthan Sivakesan: Portfolio Website

A fast, single-page portfolio with no build step and no dependencies. Open `index.html` in a browser and it works.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `admin.html` | **Admin panel: edit everything in forms, with live preview** | **Use this** |
| `content.js` | All your text, photos, projects, links and colours | Admin panel writes it, or edit by hand |
| `index.html` | Page structure | Rarely |
| `styles.css` | Design (fonts, spacing, colours for light/dark) | Only for deeper design changes |
| `script.js` | Builds the page from `content.js` | No |
| `images/` | Your photos | Add your own here |

## Admin panel (edit without code)

Open **`admin.html`** (for example `yoursite.com/admin.html`). Every section of the site is a form on the left, with a live preview on the right. You can:

- edit any text, link or colour
- upload photos (they're resized automatically so the site stays fast)
- add, delete and reorder projects, photos, skills and experience

**What Save does depends on how you connect (press Connect):**

1. **GitHub Pages (recommended).** Enter your GitHub username, repository and an access token, and Save becomes **Publish**: your changes go straight to the live site, which updates in about a minute. To make the token: GitHub → Settings → Developer settings → Fine-grained tokens → select only your site repository → Permissions → Contents: *Read and write*. The token is stored only in your own browser.
2. **A folder on your computer (Chrome or Edge).** Choose your site folder, and Save writes `content.js` and new photos straight into it.
3. **Not connected.** Save downloads a new `content.js` and any new photos. Replace the old `content.js`, put the photos in `images/`, then upload the site again (for example, drag it onto Netlify Drop).

Unsaved edits are kept in your browser, so closing the tab doesn't lose them.

The admin page is public but harmless: without your token nobody can change anything. You can still delete `admin.html` from the live site if you'd rather not have it there.

**Tip:** if you open `admin.html` by double-clicking it, some browsers block the live preview. Opening it from your live site, or with VS Code's "Live Server", works everywhere.

## Editing by hand

**Change your text:** open `content.js` and edit anything inside quotes.

**Add a photo to Photography:** copy the photo into `images/`, then add a line to `photography` in `content.js`:
```js
{ image: "images/my-photo.jpg", title: "Campus event", category: "Events", year: "2025", alt: "What the photo shows" },
```

**Add an engineering or design project:** copy one of the existing `{ ... }` blocks in `engineering` or `design`, paste it below, and change the text. Give it a unique `slug` (lowercase, dashes, no spaces). Add `image: "images/xxx.jpg"` to show a photo. Without one, a drawing-sheet cover is created automatically.

**Add your contact links:** fill in `email`, `whatsapp`, `instagram` and the others in `contact`. Any left as `""` stay hidden.

**Make the contact form send to your inbox:** create a free form at [formspree.io](https://formspree.io), copy its URL, and paste it into `contact.formEndpoint`. Without it, the form opens the visitor's email app addressed to you.

**Add your CV:** put the PDF in a `files/` folder and set `cvUrl: "files/Jeyanthan-CV.pdf"`.

**Change the accent colour:** set `theme.accent`, for example `"#2B6CD9"` (blue) or `"#1F8A5B"` (green).

**Testimonials:** the section stays hidden until you add real quotes to `testimonials`.

**Project links:** each project has its own link you can share, for example `yoursite.com/#work-ngcl-2`.

## Before you publish

Search `content.js` for **CHECK** and confirm those numbers and details are true. Also check that `university` is correct.

## Put it online for free

- **GitHub Pages:** upload these files to a GitHub repository, then go to Settings → Pages → Deploy from branch `main`, folder `/root`.
- **Netlify Drop:** go to app.netlify.com/drop and drag this folder onto the page.

Optimise new photos before you add them. About 1600px on the long side keeps the site fast.
