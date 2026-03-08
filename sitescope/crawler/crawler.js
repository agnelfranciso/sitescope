import axios from 'axios';
import { JSDOM } from 'jsdom';
import logger from '../utils/logger.js';
import path from 'path';

class Crawler {
    constructor(baseUrl, options = {}) {
        let normalizedUrl = baseUrl.trim();
        if (!/^https?:\/\//i.test(normalizedUrl)) {
            normalizedUrl = 'http://' + normalizedUrl;
        }

        this.baseUrl = normalizedUrl.endsWith('/') ? normalizedUrl.slice(0, -1) : normalizedUrl;
        this.domain = new URL(this.baseUrl).hostname;
        this.discoveredUrls = new Set();
        this.queue = [];
        this.options = {
            maxDepth: options.maxDepth || 10,
            maxPages: options.maxPages || 25, // Default limit for small sites
            excludePatterns: options.excludePatterns || [],
            manualRoutes: options.manualRoutes || []
        };
    }

    async start() {
        logger.info(`Starting crawl for: ${this.baseUrl}`);
        this.results = new Map(); // Store status codes and types
        this.linkSources = new Map(); // Map url to a Set of source pages

        // Add manual routes if provided
        for (const route of this.options.manualRoutes) {
            const fullUrl = this.normalizeUrl(route);
            if (fullUrl) {
                this.addUrlToQueue(fullUrl, 'manual');
            }
        }

        // Try to get sitemap
        await this.trySitemap();

        // Start from base URL
        const normalizedBase = this.normalizeUrl('/');
        this.addUrlToQueue(normalizedBase, 'root');

        let index = 0;
        while (index < this.queue.length) {
            const url = this.queue[index++];
            await this.crawlPage(url);
        }

        logger.success(`Crawl complete. Discovered ${this.discoveredUrls.size} pages.`);

        const finalLinks = Array.from(this.results.entries()).map(([url, data]) => ({
            url,
            ...data,
            sources: Array.from(this.linkSources.get(url) || [])
        }));

        return {
            pages: Array.from(this.discoveredUrls).filter(url => this.results.get(url)?.status === 200),
            links: finalLinks
        };
    }

    addUrlToQueue(url, source) {
        if (!url) return;

        if (!this.linkSources.has(url)) {
            this.linkSources.set(url, new Set());
        }
        if (source) this.linkSources.get(url).add(source);

        if (!this.discoveredUrls.has(url)) {
            if (this.discoveredUrls.size >= this.options.maxPages) {
                logger.debug(`Max pages limit (${this.options.maxPages}) reached. Skipping: ${url}`);
                return;
            }
            this.discoveredUrls.add(url);
            this.queue.push(url);
        }
    }

    async trySitemap() {
        const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
        try {
            logger.debug(`Checking sitemap: ${sitemapUrl}`);
            const response = await axios.get(sitemapUrl);
            const urls = response.data.match(/<loc>(.*?)<\/loc>/g);
            if (urls) {
                urls.forEach(loc => {
                    const url = loc.replace(/<\/?loc>/g, '');
                    if (this.isInternal(url)) {
                        const normalized = this.normalizeUrl(url);
                        this.addUrlToQueue(normalized, 'sitemap');
                    }
                });
                logger.info(`Found ${urls.length} URLs from sitemap.`);
            }
        } catch (err) {
            logger.debug('No sitemap.xml found.');
        }
    }

    async crawlPage(url) {
        try {
            logger.debug(`Crawling: ${url}`);
            const response = await axios.get(url, { validateStatus: false, maxRedirects: 0 });

            this.results.set(url, {
                status: response.status,
                type: (response.status >= 300 && response.status < 400) ? 'redirect' : (response.status === 200 ? 'valid' : 'broken')
            });

            if (response.status === 200) {
                const dom = new JSDOM(response.data);
                const links = dom.window.document.querySelectorAll('a');

                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (!href) return;

                    const absoluteUrl = this.normalizeUrl(href, url);
                    if (absoluteUrl && this.isInternal(absoluteUrl)) {
                        this.addUrlToQueue(absoluteUrl, url);
                    }
                });
            }
        } catch (err) {
            logger.error(`Failed to crawl ${url}: ${err.message}`);
            this.results.set(url, { status: 500, type: 'broken', error: err.message });
        }
    }

    normalizeUrl(urlPath, currentUrl = this.baseUrl) {
        try {
            const absoluteUrl = new URL(urlPath, currentUrl).href.split('#')[0];
            // Strip trailing slash for consistency
            return absoluteUrl.endsWith('/') ? absoluteUrl.slice(0, -1) : absoluteUrl;
        } catch (e) {
            return null;
        }
    }

    isInternal(url) {
        try {
            const parsed = new URL(url);
            return parsed.hostname === this.domain;
        } catch (e) {
            return false;
        }
    }
}

export default Crawler;
