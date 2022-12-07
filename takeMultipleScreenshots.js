const puppeteer = require('puppeteer');
const pages = require('./webPages.json');

async function takeMultipleScreenshots() {
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    let i = 0;

    for (const url of pages) {
      let path = `screens/00${i++}_${url
        .toString()
        .split('/')
        .join('-')
        .replace(':', '')
        .replace('https', '')
        .replace('http', '')
        .replace('--', '')}.jpeg`;

      await page.goto(url);
      await page.screenshot({
        path: path,
        fullPage: true,
      });
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

takeMultipleScreenshots();
