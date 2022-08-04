require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

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

    //Vamos a la página de login de linkedin

    await page.goto("https://www.linkedin.com/uas/login", {
      waitUntil: "networkidle2",
    });

    //Escribimos el login
    await page.type("#username", process.env.LINKEDIN_USER);

    //Escribimos la password
    await page.type("#password", process.env.LINKEDIN_PASS);

    //Hacemos click en login
    await page.click('[data-litms-control-urn="login-submit"]');

    //Esperamos a que cargue la página principal
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    //Vamos a la página de búsqueda de trabajos
    await page.goto("https://www.linkedin.com/jobs/search/", {
      waitUntil: "networkidle2",
    });

    const inputBox = await page.waitForSelector(
      '[id^="jobs-search-box-keyword-id"]'
    );

    await inputBox.type("javascript");

    await page.click(".jobs-search-box__submit-button");

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    const jobList = await page.waitForSelector("ul.jobs-search-results__list");

    const jobOffersJSON = await jobList.evaluate((node) => {
      const offers = node.querySelectorAll("li.jobs-search-results__list-item");

      return Array.from(offers).map((offer) => {
        const link = offer.querySelector(".job-card-list__title");
        const company = offer.querySelector(
          ".job-card-container__company-name"
        );

        return {
          title: link.textContent.trim(),
          url: link.getAttribute("href"),
          company: company.textContent.trim(),
        };
      });
    });

    await fs.writeFile("./jobs.json", JSON.stringify(jobOffersJSON, null, 2));
    await browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
