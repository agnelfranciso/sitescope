import { chromium } from 'playwright';
import logger from '../utils/logger.js';

class BrowserManager {
    constructor() {
        this.browser = null;
        this.contexts = [];
    }

    async init() {
        logger.debug('Initializing browser...');
        this.browser = await chromium.launch({
            headless: true
        });
    }

    async createContext(viewport = { width: 1280, height: 720 }) {
        if (!this.browser) await this.init();
        const context = await this.browser.newContext({
            viewport
        });
        this.contexts.push(context);
        return context;
    }

    async close() {
        logger.debug('Closing browser and contexts...');
        for (const context of this.contexts) {
            await context.close();
        }
        if (this.browser) {
            await this.browser.close();
        }
    }
}

export default new BrowserManager();
