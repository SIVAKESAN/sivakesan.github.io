# Jeyanthan Sivakesan: Portfolio Website

A fast portfolio with no build step and no dependencies. Open `index.html` in a browser and it works.

## How the site is organised

The top menu has three main sections, each with its own page, colour and content:

| Section | Colour | What's inside |
|---|---|---|
| **Engineering** | Blue | Project write-ups (drawing-sheet cards), software, education and experience |
| **Graphic Design** | Coral | Featured project, work cards, tools, experience |
| **Photography** | Amber | Gallery with full-screen viewer, editing software, experience |

The **home page** introduces you, has three doors into the sections, and an About block. **About** and **Contact** are also in the menu. Contact sits at the bottom of every page, and its "I'm interested in" box is pre-filled with the section the visitor came from.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `admin.html` | **Admin panel: edit everything in forms, with live preview** | **Use this** |
| `content.js` | All your text, photos, projects, links and colours | Admin panel writes it, or edit by hand |
| `index.html` | Page structure | Rarely |
| `styles.css` | Design (fonts, spacing, colours for light/dark) | Only for deeper design changes |
| `script.js` | Builds the pages from `content.js` | No |
| `images/` | Your photos | Add your own here |

## Admin panel (edit without code)

Open **`admin.html`** (for example `yoursite.com/admin.html`). The left side is grouped like the site:

- **General**: You, About, Testimonials, Contact, Look & feel
- **Engineering**: *Page & text* (heading, colour, topics, info box, tools, experience, closing banner) and *Projects*
- **Graphic Design**: *Page & text* and *Projects*
- **Photography**: *Page & text* and *Photos*

You can edit any text, link or colour, upload photos (resized automatically so the site stays fast), and add, delete or reorder projects, photos and experience. The live preview on the right jumps to the page you are editing.

**What Save does depends on how you connect (press Connect):**

1. **GitHub Pages (recommended).** Enter your GitHub username, repository and an access token, and Save becomes **Publish**: your changes go straight to the live site, which updates in about a minute. To make the token: GitHub → Settings → Developer settings → Fine-grained tokens → select only your site repository → Permissions → Contents: *Read and write*. The token is stored only in your own browser.
2. **A folder on your computer (Chrome or Edge).** Choose your site folder, and Save writes `content.js` and new photos straight into it.
3. **Not connected.** Save downloads a new `content.js` and any new photos. Replace the old `content.js`, put the photos in `images/`, then upload the site again.

Unsaved edits are kept in your browser, so closing the tab doesn't lose them.

The admin page is public but harmless: without your token nobody can change anything. You can still delete `admin.html` from the live site if you'd rather not have it there.

**Tip:** if you open `admin.html` by double-clicking it, some browsers block the live preview. Opening it from your live site, or with VS Code's "Live Server", works everywhere.

## Editing by hand

Everything about one section sits together in `content.js`, in the blocks called `engineering`, `design` and `photography`.

**Change a section's colour or menu name:** set `accent` (for example `"#2F6BFF"`) and `navLabel` inside that block.

**Change the words on a section page:** edit `heading`, `intro`, `focus` (the pills), `facts` (the info box), `skills`, `timeline`, `ctaHeading` and `ctaText` in its block.

**Add a photo:** copy the photo into `images/`, then add a line to `photography.photos`:
```js
{ image: "images/my-photo.jpg", title: "Campus event", category: "Events", year: "2025", alt: "What the photo shows" },
```
Photos that share a `category` get filter buttons once there are four or more photos.

**Add an engineering or design project:** copy one of the `{ ... }` blocks in `engineering.projects` or `design.projects`, paste it below, and change the text. Give it a unique `slug` (lowercase, dashes, no spaces). Add `image: "images/xxx.jpg"` to show a photo; without one, a drawing-sheet cover (engineering) or colour cover (design) is created. The first design project is shown large.

**Add your contact links:** fill in `email`, `whatsapp`, `instagram` and the others in `contact`. Any left as `""` stay hidden.

**Make the contact form send to your inbox:** create a free form at [formspree.io](https://formspree.io), copy its URL, and paste it into `contact.formEndpoint`. Without it, the form opens the visitor's email app addressed to you.

**Add your CV:** put the PDF in a `files/` folder and set `profile.cvUrl: "files/Jeyanthan-CV.pdf"`.

**Testimonials:** the section stays hidden until you add real quotes to `testimonials`.

**Links you can share:** each section and project has its own link, for example `yoursite.com/#design`, `yoursite.com/#photography`, `yoursite.com/#work-ngcl-2`.

## Before you publish

Search `content.js` for **CHECK** and confirm those numbers and details are true. Also check that `university` is correct.

## Put it online for free

- **GitHub Pages:** upload these files to a GitHub repository, then go to Settings → Pages → Deploy from branch `main`, folder `/root`.
- **Netlify Drop:** go to app.netlify.com/drop and drag this folder onto the page.

Optimise new photos before you add them. About 1600px on the long side keeps the site fast.
