#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import logger from '../utils/logger.js';
import Crawler from '../crawler/crawler.js';
import browserManager from '../browser/manager.js';
import ScreenshotManager from '../screenshot/manager.js';
import Reporter from '../reporter/reporter.js';
import { autoScroll, analyzePageStructure } from '../browser/utils.js';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
    .name('sitescope')
    .description('A developer tool for website crawling and visual analysis for vibecoding')
    .version('1.1.0');

// Interactive Wizard Function
async function runWizard(defaultUrl = '') {
    console.log(chalk.cyan.bold('\n--- SiteScope Interactive Wizard ---'));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'baseUrl',
            message: 'Which website URL would you like to scan?',
            default: defaultUrl,
            validate: (input) => {
                if (!input) return 'URL is required';
                try {
                    // Try to normalize/validate
                    let url = input.trim();
                    if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
                    new URL(url);
                    return true;
                } catch (e) {
                    return 'Please enter a valid URL (e.g., google.com or http://localhost:3000)';
                }
            }
        },
        {
            type: 'input',
            name: 'manualRoutes',
            message: 'Any specific routes to prioritize? (comma separated, or leave empty)',
        },
        {
            type: 'number',
            name: 'maxPages',
            message: 'What is the maximum number of pages to audit? (Developer Threshold)',
            default: 25
        },
        {
            type: 'confirm',
            name: 'screenshots',
            message: 'Capture visual screenshots? (Crucial for vibecoding / AI analysis)',
            default: true
        },
        {
            type: 'input',
            name: 'outputDir',
            message: 'Where should we save the audit reports?',
            default: './sitescope-output'
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Ready to start the audit?',
            default: true
        }
    ]);

    if (!answers.confirm) {
        console.log(chalk.yellow('Audit cancelled.'));
        process.exit(0);
    }

    // Normalize URL for the rest of the app
    let url = answers.baseUrl.trim();
    if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
    answers.baseUrl = url;

    return answers;
}

async function performScan(baseUrl, options) {
    try {
        logger.title('SiteScope - Starting Scan');

        const outputDir = path.resolve(process.cwd(), options.output || options.outputDir || './sitescope-output');
        const manualRoutes = (options.routes || options.manualRoutes) ? (options.routes || options.manualRoutes).split(',') : [];
        const maxPages = options.maxPages || 25;
        const skipScreenshots = options.screenshots === false || options.skipScreenshots === true;

        // 1. Crawl
        const crawler = new Crawler(baseUrl, { manualRoutes, maxPages });
        const { pages, links } = await crawler.start();

        // 2. Initialize Browser and Screenshot Manager
        const screenshotManager = new ScreenshotManager(outputDir);
        await screenshotManager.ensureDirs();
        const reporter = new Reporter(outputDir);
        reporter.setBrokenLinks(links.filter(l => l.type === 'broken'));

        await browserManager.init();
        const context = await browserManager.createContext();

        // 3. Process Each Page
        for (const url of pages) {
            logger.info(`Analyzing: ${url}`);
            const page = await context.newPage();
            const consoleErrors = [];

            page.on('console', msg => {
                if (msg.type() === 'error') consoleErrors.push(msg.text());
            });

            try {
                // Set viewport for consistent result
                await page.setViewportSize({ width: 1280, height: 800 });

                await page.goto(url, { waitUntil: 'networkidle' });
                await autoScroll(page);

                const screenshots = [];
                if (!skipScreenshots) {
                    for (const device of screenshotManager.devices) {
                        const sc = await screenshotManager.capture(page, new URL(url).pathname, device);
                        screenshots.push(sc);
                    }
                }

                const analysis = await analyzePageStructure(page);

                reporter.addPageResult({
                    url,
                    screenshots,
                    analysis,
                    consoleErrors
                });

            } catch (err) {
                logger.error(`Error processing ${url}: ${err.message}`);
            } finally {
                await page.close();
            }
        }

        await reporter.saveResults();
        await browserManager.close();
        logger.title('Scan Finished Successfully');
        console.log(chalk.green(`\nReport saved successfully in: ${chalk.bold(outputDir)}`));
        console.log(chalk.cyan(`You can now provide this report or screenshots to your AI agent for vibecoding analysis!`));

    } catch (err) {
        logger.error(`Scan failed: ${err.message}`);
        process.exit(1);
    }
}

program
    .command('scan')
    .description('Start scanning a website')
    .argument('[url]', 'Base URL to scan')
    .option('-r, --routes <routes>', 'Comma-separated manual routes', '')
    .option('-o, --output <dir>', 'Output directory', './sitescope-output')
    .option('-p, --max-pages <number>', 'Maximum number of pages to scan', '25')
    .option('--skip-screenshots', 'Do not capture screenshots', false)
    .action(async (url, options) => {
        if (!url) {
            const answers = await runWizard();
            if (answers) await performScan(answers.baseUrl, answers);
        } else {
            await performScan(url, options);
        }
    });

// Improved Fallback Logic
const args = process.argv.slice(2);
const knownCommands = ['scan'];
const isHelpOrVersion = args.some(arg => ['--help', '-h', '--version', '-V'].includes(arg));

if (args.length === 0) {
    runWizard().then(answers => {
        if (answers) performScan(answers.baseUrl, answers);
    });
} else if (args.length === 1 && !knownCommands.includes(args[0]) && !isHelpOrVersion) {
    // Treat 1st arg as a URL shorthand and open wizard
    runWizard(args[0]).then(answers => {
        if (answers) performScan(answers.baseUrl, answers);
    });
} else {
    program.parse();
}
