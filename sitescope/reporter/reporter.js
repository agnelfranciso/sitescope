import fs from 'fs-extra';
import path from 'path';
import logger from '../utils/logger.js';

class Reporter {
    constructor(outputDir) {
        this.outputDir = outputDir;
        this.results = {
            summary: {
                totalScanTime: 0,
                totalDiscoveredPages: 0,
                totalScreenshots: 0,
                totalIssues: 0,
                totalWarnings: 0,
                totalBrokenLinks: 0
            },
            pages: [],
            brokenLinks: []
        };
    }

    addPageResult(pageResult) {
        this.results.pages.push(pageResult);
        this.results.summary.totalDiscoveredPages++;
        this.results.summary.totalScreenshots += pageResult.screenshots.length;
        this.results.summary.totalIssues += pageResult.analysis.issues.length;
        this.results.summary.totalWarnings += pageResult.analysis.warnings.length;
    }

    setBrokenLinks(brokenLinks) {
        this.results.brokenLinks = brokenLinks;
        this.results.summary.totalBrokenLinks = brokenLinks.length;
    }

    async saveResults() {
        await fs.ensureDir(this.outputDir);

        // Save JSON
        const jsonPath = path.join(this.outputDir, 'report.json');
        await fs.writeJson(jsonPath, this.results, { spaces: 2 });

        // Save Markdown
        const mdPath = path.join(this.outputDir, 'report.md');
        const markdown = this.generateMarkdown();
        await fs.writeFile(mdPath, markdown);

        // Save Sitemap JSON
        const sitemapPath = path.join(this.outputDir, 'sitemap.json');
        const sitemap = this.results.pages.map(p => p.url);
        await fs.writeJson(sitemapPath, sitemap, { spaces: 2 });

        logger.success(`Reports saved to: ${this.outputDir}`);
    }

    generateMarkdown() {
        let md = `# SiteScope Scan Report\n\n`;
        md += `## Summary\n\n`;
        md += `- **Pages Scanned:** ${this.results.summary.totalDiscoveredPages}\n`;
        md += `- **Screenshots Captured:** ${this.results.summary.totalScreenshots}\n`;
        md += `- **Issues Found:** ${this.results.summary.totalIssues}\n`;
        md += `- **Warnings Found:** ${this.results.summary.totalWarnings}\n`;
        md += `- **Broken Links Found:** ${this.results.summary.totalBrokenLinks}\n\n`;

        md += `## Visual Sitemap\n\n`;
        md += '```text\n';
        md += this.generateVisualTree();
        md += '```\n\n';

        md += `## Detailed Page Analysis\n\n`;

        this.results.pages.forEach(page => {
            md += `### URL: [${page.url}](${page.url})\n\n`;

            if (page.analysis.issues.length > 0) {
                md += `#### 🔴 Issues\n`;
                page.analysis.issues.forEach(issue => {
                    md += `- **${issue.type}**: ${issue.message || issue.element}\n`;
                });
                md += `\n`;
            }

            if (page.analysis.warnings.length > 0) {
                md += `#### 🟡 Warnings\n`;
                page.analysis.warnings.forEach(warning => {
                    md += `- **${warning.type}**: ${warning.message || warning.element}\n`;
                });
                md += `\n`;
            }

            if (page.consoleErrors.length > 0) {
                md += `#### 💻 Console Errors\n`;
                page.consoleErrors.forEach(err => {
                    md += `- \`${err}\`\n`;
                });
                md += `\n`;
            }

            md += `#### 📸 Screenshots\n`;
            page.screenshots.forEach(sc => {
                md += `- ${sc.device}: [Link](${path.relative(this.outputDir, sc.path)})\n`;
            });
            md += `\n---\n\n`;
        });

        if (this.results.brokenLinks.length > 0) {
            md += `## Broken Links\n\n`;
            md += `| Broken URL | Status | Found On |\n`;
            md += `| --- | --- | --- |\n`;
            this.results.brokenLinks.forEach(link => {
                const sources = link.sources.slice(0, 3).join(', ') + (link.sources.length > 3 ? '...' : '');
                md += `| ${link.url} | ${link.status} | ${sources} |\n`;
            });
        }

        return md;
    }

    generateVisualTree() {
        const paths = this.results.pages.map(p => {
            try {
                return new URL(p.url).pathname;
            } catch (e) {
                return p.url;
            }
        });

        const tree = {};
        paths.forEach(p => {
            const parts = p.split('/').filter(x => x);
            let curr = tree;
            parts.forEach(part => {
                if (!curr[part]) curr[part] = {};
                curr = curr[part];
            });
        });

        let output = '/\n';
        const render = (obj, indent = '') => {
            const keys = Object.keys(obj);
            keys.forEach((key, index) => {
                const isLast = index === keys.length - 1;
                output += `${indent}${isLast ? '└─ ' : '├─ '}${key}\n`;
                render(obj[key], indent + (isLast ? '   ' : '│  '));
            });
        };
        render(tree);
        return output;
    }
}

export default Reporter;
