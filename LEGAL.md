# Legal and Ethics ⚖️

SiteScope is an open-source tool built for developers to scan their own websites and catch bugs. As a user of this tool, you are responsible for how you use it.

## 🏛 Legal Responsibility
The authors of **SiteScope** are not responsible for any misuse of this tool. SiteScope is provided "as is", without warranty of any kind. 

**By using SiteScope, you agree:**
- Not to use it for malicious purposes or to harm any web server.
- Not to violate any third-party "Terms of Service" regarding automated crawling.
- That you have the legal right or explicit permission to scan the URLs you target.

## 🧭 Ethical Crawling
SiteScope defaults to a **25-page limit** as a safety feature to avoid putting excessive load on servers. **Please follow these common-sense rules:**

1.  **Crawl Your Own Projects**: SiteScope is most effective when scanning `localhost:3000` or your own dev/staging sites.
2.  **Respect `robots.txt`**: Although SiteScope doesn't strictly enforce it (as it is a tool for developers), you should always follow any crawling exclusions.
3.  **Use Low Page-Thresholds**: For public sites, use the `--max-pages` flag to limit your scan to what is necessary for your analysis.
4.  **Vibecoding Use-Case**: SiteScope is intended for one-off manual scans to help with coding and visual analysis—not for automated scraping or mass data-mining.

---

🔭 *See clearly, vibe better.*
