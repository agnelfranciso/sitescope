/**
 * Utility functions to be executed within the browser context using Playwright's evaluate.
 */

export async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

export async function analyzePageStructure(page) {
    return await page.evaluate(() => {
        const issues = [];
        const warnings = [];

        // Broken images (already loaded or error)
        const images = Array.from(document.querySelectorAll('img'));
        images.forEach(img => {
            if (!img.complete || img.naturalWidth === 0) {
                issues.push({
                    type: 'broken-image',
                    element: img.outerHTML.substring(0, 100),
                    src: img.src
                });
            }
            if (!img.alt) {
                warnings.push({
                    type: 'missing-alt-text',
                    element: img.outerHTML.substring(0, 100),
                    src: img.src
                });
            }
        });

        // Empty buttons or links
        const interactive = Array.from(document.querySelectorAll('a, button'));
        interactive.forEach(el => {
            if (el.innerText.trim() === '' && !el.querySelector('img') && !el.querySelector('svg')) {
                warnings.push({
                    type: 'empty-interactive-element',
                    tag: el.tagName.toLowerCase(),
                    element: el.outerHTML.substring(0, 100)
                });
            }
        });

        // Layout overflow detection
        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
        if (hasHorizontalScroll) {
            issues.push({
                type: 'layout-overflow',
                message: 'Horizontal scroll detected (layout might be broken)'
            });
        }

        // Elements outside viewport
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right < 0 || rect.left > window.innerWidth || rect.bottom < 0 || rect.top > window.innerHeight) {
                // This is normal for many sites, but we could flag specific important ones if needed
                // For now, let's keep it simple and not flood with these unless they are high priority
            }
        });

        return { issues, warnings };
    });
}
