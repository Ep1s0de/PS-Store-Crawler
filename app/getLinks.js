const puppeteer = require("puppeteer");

async function getLinks(link) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--user-agent=Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.36",
    ],
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(link);
  delay(400);
  let gameData = {};
  let error = await page.$$('.page-not-found');
  if(error.length > 0){
    gameData.name = 'Страница не найдена'
    gameData.price = 'Error'
    gameData.error = 1
    await page.close();
    await browser.close();
    return gameData
  }
  await page.launch;
  gameData = await page.evaluate(() => {
    res = {};
    res.name = document.querySelector(
      '[data-qa="mfe-game-title#name"]'
    ).innerHTML;
    res.price = document.querySelector(".psw-t-title-m").innerHTML;
    return res;
  });
  await page.close();
  await browser.close();
  return gameData;
}

module.exports = {
  getLinks,
};

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
