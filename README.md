# Umar - Portfolio Website

Professional portfolio website for **Umar** — Frontend Developer, BCA Student, Android App Developer & AI enthusiast.

## 🚀 Features

- **Interactive water ripple canvas animation** — reacts to mouse & touch movement
- **Fully responsive** on all screen sizes (mobile, tablet, desktop)
- **Dark / Light theme toggle** (persisted in localStorage)
- **Typing effect** for dynamic role titles
- **Sections:** Home, About, Skills, Services, Certificates, Projects, Contact
- **Scroll-spy navigation** with active link highlighting
- **Scroll reveal animations** + animated skill progress bars
- **Working contact form** with client + server validation
- **Node.js/Express backend** storing messages to `messages.json`
- Security headers via Helmet + rate limiting on the contact endpoint

## 📁 Project Structure

```
.
├── index.html          # Main portfolio page
├── style.css           # All styles (responsive + themes)
├── script.js           # All frontend JavaScript
├── server.js           # Node.js/Express backend
├── package.json        # Project dependencies & scripts
├── messages.json       # Contact form submissions (auto-created)
├── Profile.pdf         # CV / resume (used by "Download CV")
├── image1.jpg          # Hero portrait image
├── image2.jpg          # About section image
└── README.md           # This file
```

## ⚙️ How to Run

### Option 1: Just view the frontend (no backend)
Simply open `index.html` in a browser. All animations, theme toggle and navigation work.
*(Note: the contact form will show a network error since there's no server.)*

### Option 2: Full experience (with backend)
Requires **Node.js** installed on your system.

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
# http://localhost:3000
```

For development with auto-restart:
```bash
npm run dev
```

## 📞 Contact Form
- Client-side validation handles empty/invalid inputs.
- On submit, the message is sent to `POST /api/contact`.
- Messages are validated again on the server and saved to `messages.json`.
- Protected with rate limiting (20 requests / 15 min per IP).

## 🎨 Customizing

- **Certificates:** Edit the `#certificates` section in `index.html` to add/update your real certificate titles, issuers and years.
- **Projects:** Update the `#projects` section in `index.html`.
- **Colors / theme:** Change CSS variables at the top of `style.css`.
- **CV download:** Replace `Profile.pdf` with your updated resume.

## 🔗 Social Links
- **LinkedIn:** https://www.linkedin.com/in/mr-umar-9a5811376
- **GitHub:** https://github.com/um5494273-create
- **Instagram:** https://www.instagram.com/umar._vision_/
- **Email:** um5494273@gmail.com

---

© Umar. All rights reserved.

