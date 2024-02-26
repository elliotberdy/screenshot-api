const puppeteer = require("puppeteer");

async function captureScreenshot(url, fullpage = false) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  let screenshotData;
  if (fullpage) {
    screenshotData = await page.screenshot({
      encoding: "base64",
      fullPage: true,
    });
  } else {
    screenshotData = await page.screenshot({ encoding: "base64" });
  }

  console.log("Screenshot data:", screenshotData);

  await browser.close();
  return screenshotData;
}

module.exports = captureScreenshot;
