import path from 'path';
import fs from 'fs-extra';
import logger from '../utils/logger.js';

class ScreenshotManager {
    constructor(outputDir) {
        this.outputDir = outputDir;
        this.devices = [
            { name: 'desktop', width: 1920, height: 1080 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'mobile', width: 375, height: 812 }
        ];
    }

    async ensureDirs() {
        for (const device of this.devices) {
            await fs.ensureDir(path.join(this.outputDir, 'screenshots', device.name));
        }
    }

    async capture(page, urlPath, device) {
        const safePath = (urlPath === '/' || urlPath === '') ? 'home' : urlPath.replace(/[^a-z0-9]/gi, '-').replace(/^-|-$/g, '');
        const fileName = `${device.name}-${safePath}.png`;
        const filePath = path.join(this.outputDir, 'screenshots', device.name, fileName);

        logger.debug(`Capturing ${device.name} screenshot for ${urlPath}`);

        await page.setViewportSize({ width: device.width, height: device.height });
        // Wait a bit for layout to settle after viewport change
        await page.waitForTimeout(500);

        await page.screenshot({
            path: filePath,
            fullPage: true
        });

        return {
            device: device.name,
            path: filePath,
            fileName: fileName
        };
    }
}

export default ScreenshotManager;
