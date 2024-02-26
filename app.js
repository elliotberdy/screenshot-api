const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

const validUrl = require("valid-url");

// Example Usage:
// http://localhost:3000/return_screenshot?url=https://apiflash.com/documentation&fullpage=true
// http://localhost:3000/return_screenshot?url=https://apiflash.com/documentation

app.get("/return_screenshot", async (req, res) => {
  const { url } = req.query;
  const { fullpage } = req.query;

  if (!url) {
    return res
      .status(400)
      .send(
        "URL parameter is required. Example: /return_screenshot?url=https://example.com"
      );
  }

  if (!validUrl.isWebUri(url)) {
    return res
      .status(400)
      .send(
        "Invalid URL format. URL must be a valid web URL. Example: https://example.com"
      );
  }

  try {
    const screenshotImg = await saveScreenshot(
      url,
      "/Users/elliotberdy/Library/CloudStorage/OneDrive-UCLAITServices/Notability/browserbase-work-trial/screenshot.png",
      fullpage
    );
    const screenshotData = await captureScreenshot(url, fullpage);
    res.send(screenshotData);
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res.status(500).send("Error capturing screenshot.", error);
  }
});

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

async function saveScreenshot(url, filename, fullpage = false) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  if (fullpage) {
    await page.screenshot({ path: filename, fullPage: true });
  } else {
    await page.screenshot({ path: filename });
  }

  await browser.close();
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
