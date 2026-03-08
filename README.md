# <p align="center">🔭 SiteScope</p>

<p align="center">
  <b>The Lightest, Developer-First Tool for Website Crawling, Visual Audits, and Vibecoding.</b>
</p>

---

## 🔥 The Concept

**SiteScope** is built for the modern developer who works with AI agents (**Cursor**, **Windsurf**, **GPT-o**). It’s a specialized CLI tool that gives you a **high-fidelity view** of your local projects or any website—catching bugs and errors without you ever leaving your IDE.

### Why use it?

- **Vibecoding Fuel**  
  Capture full-page screenshots across multiple devices (Desktop, Tablet, Mobile) and feed them directly to your AI agent so it can *see* and fix your code more accurately.

- **Structural Audits**  
  Automatically detect broken links, console errors, missing images, and SEO issues in seconds.

- **One-Click Localhost**  
  Optimized for `localhost:3000`, `127.0.0.1`, and staging environments.

- **Terminal-Only**  
  No bloat. No servers. Just a powerful command-line interface.

---

## 🚀 One-Click Installation (Windows)

1. **Clone or download** this repository.
2. **Run as Administrator**  
   Right-click **`INSTALL_SITESCOPE.bat`** and run it.
3. **You're ready.**  
   You can now run `sitescope` from **any terminal window** on your machine.

---

## 💡 Usage Guides

### 1. Interactive Wizard (Easiest)

Just run:

```bash
sitescope
```

The wizard will guide you through:

- Target URL (example: `localhost:3000`)
- Maximum page threshold (default: **25 pages**)
- Screenshot toggle (recommended for AI context)

---

### 2. URL Shorthand

Start instantly with a target URL:

```bash
sitescope localhost:3000
```

---

### 3. Power-User Mode (Expert)

Skip the wizard and run a direct scan:

```bash
sitescope scan google.com --max-pages 10 --skip-screenshots
```

---

## 🛠 Developer-Focused Features

- **Page Thresholds**  
  Default **25-page limit** keeps scans fast and prevents unnecessary load.

- **Visual Context for AI**  
  Screenshots help AI tools understand layout issues that code analysis alone can miss.

- **Deep Broken Link Detection**  
  Recursively finds internal broken links, loops, and missing assets.

---

## 🏗 Technical Specs

- **Node.js**: 16.0+
- **Playwright**: Uses Chromium for high-fidelity rendering
- **Zero-Config Setup**: Automatically installs required browsers and dependencies

---

## 📜 Project Governance

- 📖 [UNDER_THE_HOOD.md](./UNDER_THE_HOOD.md)  
  Deep dive into the BFS crawler and browser management.

- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md)  
  Guidelines for contributing to the project.

- ⚖️ [LEGAL.md](./LEGAL.md)  
  Ethics, legality, and responsible crawling practices.

- 🔐 [SECURITY.md](./SECURITY.md)  
  Our commitment to protecting user data and local environments.

- 📄 [LICENSE](./LICENSE)  
  Released under the **MIT Open Source License**.

---

## 🎨 Vibecoding Inception

**Fun fact:** SiteScope was built entirely using **Vibecoding**.

This means an **AI-agent platform helped design, code, and refine the architecture** of SiteScope itself.

It's essentially **Vibecoding Inception** — using AI to build the tools that make AI development even better.

---

<p align="center">
  <i>SiteScope — See clearly, build better, vibe harder.</i>
</p>