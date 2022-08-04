const puppeteer = require("puppeteer");

const fs = require("fs/promises");

const URL = "https://www.chollometro.com";

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

    //Vamos a la URL
    await page.goto(URL, { waitUntil: "networkidle2" });

    //Hacemos click en el botón de cookies
    await page.click('[data-t="acceptAllBtn"]');

    //Esperamos un par de segundos
    await page.waitForTimeout(2000);

    //Hacemos click en la opción de menú nuevos
    await page.click("li.test-tablink-nuevos a");

    //Esperamos a que vaya a a la página de ofertas nuevas
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    //Esperamos a que esté disponible el listado de ofertas nuevas
    const offerList = await page.waitForSelector("#toc-target-deals");

    const offersJSON = await offerList.evaluate((node) => {
      const offers = node.querySelectorAll("article.thread--deal");

      const list = [];

      for (const offer of offers) {
        const image = offer.querySelector(".threadGrid-image img");
        const link = offer.querySelector(".threadGrid-title .thread-title a");
        const price = offer.querySelector(".threadGrid-title .thread-price");

        list.push({
          image: image.getAttribute("src"),
          link: link.getAttribute("href"),
          title: link.textContent,
          price: price?.textContent,
        });
      }

      return list;
    });

    await fs.writeFile(
      "./chollometro.json",
      JSON.stringify(offersJSON, null, 2)
    );

    await browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
