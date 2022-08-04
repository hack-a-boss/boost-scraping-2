const puppeteer = require("puppeteer");

async function main() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0"
    );

    await page.goto("https://amazon.es", { waitUntil: "networkidle2" });

    await page.screenshot({ path: "captura-amazon.png", fullPage: true });
    // await page.pdf({ path: "amazon.pdf" });

    await browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
