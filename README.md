# <p align="center">🔭 SiteScope</p>

<p align="center">
  <b>The Lightest, Developer-First Tool for Website Crawling, Visual Audits, and Vibecoding.</b>
</p>

---

## 🔥 **The Concept**

**SiteScope** is built for the modern developer who works with AI agents (**Cursor**, **Windsurf**, **GPT-o**). It’s a specialized CLI tool that gives you a "High-Fidelity" view of your local projects or any website—catching bugs and errors without you ever leaving your IDE.

**Why use it?**
- **Vibecoding Fuel**: Capture full-page screenshots across multiple devices (Desktop, Tablet, Mobile) and feed them directly to your AI agent so it can "see" and "fix" your code perfectly.
- **Structural Audits**: Automatically detect broken links, console errors, missing images, and SEO issues in seconds.
- **One-Click Localhost**: Optimized for `localhost:3000`, `127.0.0.1`, and your staging URLs.
- **Terminal-Only**: No bloat. No servers. Just a powerful command-line interface.

---

## 🚀 **One-Click Installation (Windows)**

1.  **Clone or Download** this repository.
2.  **Run as Administrator**: Right-click **[INSTALL_SITESCOPE.bat](file:///d:/Coding Projects/sitescopoe/INSTALL_SITESCOPE.bat)** and select **Wait for the installation window**.
3.  **Vibe!**: You can now run `sitescope` from ANY terminal window on your machine.

---

## 💡 **Usage Guides**

### 1. The Interactive Wizard (Easiest)
Just type `sitescope` in your project folder. It will guide you through:
- Target URL (e.g., `localhost:3000`)
- Maximum page threshold (Default is 25 for fast scans)
- Screenshot toggle (Crucial for AI context)

### 2. The URL Shorthand
Instantly start the wizard with a target URL:
```bash
sitescope localhost:3000
```

### 3. Power-User Mode (Expert)
Skip the wizard and run a direct scan:
```bash
sitescope scan google.com --max-pages 10 --skip-screenshots
```

---

## 🛠 **Developer Priority Built-In**

- **Page Thresholds**: We default to a **25-page limit** to keep audits fast and avoid crashing your computer or the target server.
- **Visual Check Override**: Screenshots are perfect for providing visual context to AI agents for further code edits. Catch layout shifts that code-only tools miss!
- **Deep Broken Link Detection**: We recursively find internal broken links, loops, and missing visual assets.

---

## 🏗 **Technical Specs**

- **Node.js**: 16.0+ (Required)
- **Playwright**: Uses the Chromium engine for perfect visual fidelity.
- **Zero-Config Dependencies**: Handles browser installation and path linking automatically.

---

## 📜 **Project Governance**

- **[UNDER_THE_HOOD.md](file:///d:/Coding Projects/sitescopoe/UNDER_THE_HOOD.md)**: A deep-dive into our BFS crawler and browser management for technical nerds.
- **[CONTRIBUTING.md](file:///d:/Coding Projects/sitescopoe/CONTRIBUTING.md)**: How to help us build the future of vibecoding tools.
- **[LEGAL.md](file:///d:/Coding Projects/sitescopoe/LEGAL.md)**: Ethics, legality, and our "Be a Good Citizen" crawling guide.
- **[SECURITY.md](file:///d:/Coding Projects/sitescopoe/SECURITY.md)**: Our commitment to your local data privacy.
- **[LICENSE](file:///d:/Coding Projects/sitescopoe/LICENSE)**: Licensed under the MIT Open Source License.

---

## 🎨 **Vibecoding Inception**

**Fun Fact**: SiteScope was built entirely using **Vibecoding**. 

Essentially, this is a tool for vibecoding, built *by* vibecoding. We used an AI-agent platform to design, code, and polish the architecture of SiteScope itself. It’s "Vibecoding Inception"—using the power of AI to build the tools that make AI smarter.

---

<p align="center">
  <i>SiteScope - See clearly, build better, vibe harder.</i>
</p>
