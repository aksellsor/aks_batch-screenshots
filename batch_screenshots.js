import {
  WAIT_FOR,
  WAIT_FOR_LAZYLOADED_CONTENT,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  DELAY_BETWEEN_SCROLL,
} from './config.js';

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load URLs from file
const urls = fs.readFileSync('urls.txt', 'utf-8').split('\n').filter(Boolean);

// Read custom CSS from .css file
const customCSS = fs.readFileSync('custom.css', 'utf-8');

// Create 'screens' folder if it doesn't exist
const folderPath = path.join(__dirname, 'screens');
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Function to scroll and trigger lazy loading
const scrollPage = async (page, delay) => {
  await page.evaluate(async (scrollDelay) => {
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
      }, scrollDelay);
    });
  }, delay);
};

(async () => {
  const browser = await puppeteer.launch();

  for (const url of urls) {
    const page = await browser.newPage();

    try {
      // Set viewport to desktop dimensions
      await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
      });

      // Navigate to the page and wait for the network to be idle
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Inject custom CSS
      await page.addStyleTag({ content: customCSS });

      // Skip lazy load handling if disabled
      if (WAIT_FOR_LAZYLOADED_CONTENT) {
        // Trigger lazy-loaded content
        await scrollPage(page, DELAY_BETWEEN_SCROLL);

        // Ensure all lazy-loaded elements are visible
        await page.evaluate(() => {
          document
            .querySelectorAll('img[loading="lazy"], iframe[loading="lazy"]')
            .forEach((el) => {
              if (el.dataset.src) {
                el.src = el.dataset.src;
              }
              if (el.tagName === 'IMG') {
                el.loading = 'eager';
              }
            });
        });
      }

      // Wait for any remaining dynamic content to load
      if (WAIT_FOR > 0) {
        await new Promise((resolve) => setTimeout(resolve, WAIT_FOR));
      }

      // Create a cleaner filename by transforming the URL
      let safeFileName = url
        .replace(/https?:\/\//, '') // Remove protocol
        .replace(/\//g, '_') // Replace slashes with underscores
        .replace(/[^\w-_]/g, '-'); // Replace other non-alphanumeric characters with hyphens

      // Remove trailing hyphen or underscore if any
      safeFileName = safeFileName.replace(/[-_]+$/, '');

      const filePath = path.join(folderPath, `${safeFileName}.jpeg`);

      await page.screenshot({
        path: filePath,
        type: 'jpeg',
        fullPage: true,
        quality: 80, // Adjust quality if needed
      });

      console.log(`Screenshot saved for ${url} at ${filePath}`);
    } catch (err) {
      console.error(`Failed to take screenshot for ${url}:`, err);
    }
    await page.close();
  }

  await browser.close();
})();
