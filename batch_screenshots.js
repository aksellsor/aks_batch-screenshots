const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Load URLs from file
const urls = fs.readFileSync('urls.txt', 'utf-8').split('\n').filter(Boolean);

// Read custom CSS from .css file
const customCSS = fs.readFileSync('custom.css', 'utf-8');

// Create 'screens' folder if it doesn't exist
const folderPath = path.join(__dirname, 'screens');
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

(async () => {
  const browser = await puppeteer.launch();

  for (const url of urls) {
    const page = await browser.newPage();

    try {
      // Set viewport to desktop dimensions
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to the page and wait for the network to be idle
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Inject custom CSS
      await page.addStyleTag({ content: customCSS });

      // Wait for additional dynamic content to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
