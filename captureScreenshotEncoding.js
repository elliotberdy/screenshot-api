const puppeteer = require("puppeteer");

async function captureScreenshotEncoding(url, fullpage = false) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: 1287,
      height: 959,
    });

    await page.goto(url, { waitUntil: ["networkidle2", "load"] });

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

    return screenshotData;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return null; // Or handle the error as needed
  } finally {
    await browser.close();
  }
}

module.exports = captureScreenshotEncoding;
