const puppeteer = require("puppeteer");

async function main() {
  try {
    //Abrimos navegador
    const browser = await puppeteer.launch({ headless: true });

    //Creamos un nuevo tab
    const page = await browser.newPage();

    //Configuramos el user-agent
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0"
    );

    //Navegamos a una página
    await page.goto("https://www.eltiempo.es/", { waitUntil: "networkidle2" });

    const mapSelector = "#map";

    //Esperamos a que el selector #map esté disponible en la página (si no dará un error)
    await page.waitForSelector(mapSelector);

    //Seleccionamos el botón de cookies
    const cookieAgreeButton = await page.$("#didomi-notice-agree-button");

    //Hacemos click en el botón de cookies
    if (cookieAgreeButton) await cookieAgreeButton.click();

    //Seleccionamos el mapa
    const map = await page.$("#map");

    //Esperamos un par de segundos por seguridad
    await page.waitForTimeout(2000);

    //Guardamos una captura del elemento del mapa
    await map.screenshot({ path: "mapa-tiempo.png" });
    // await page.pdf({ path: "pagina-tiempo.pdf" });

    //Cerramos browser
    await browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
