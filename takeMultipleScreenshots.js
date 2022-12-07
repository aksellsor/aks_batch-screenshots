const puppeteer = require("puppeteer");
const slugify = require("slugify");
const pages = require("./webPages.json");

async function takeMultipleScreenshots() {
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    let i = 0;
    for (const url of pages) {
      await page.goto(url);
      await page.screenshot({ path: `screens/00${i++}_${slugify(url)}.jpeg`, fullPage: true });
      // console.log(`${name} - (${url})`);
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

takeMultipleScreenshots();