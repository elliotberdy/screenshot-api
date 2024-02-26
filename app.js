const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const captureScreenshot = require("./captureScreenshot");

const app = express();
const PORT = process.env.PORT || 3000;

const validUrl = require("valid-url");

app.use(bodyParser.json());

// Example Usage:
// GET request to http://localhost:3000/screenshot?url=https://apiflash.com/documentation
// GET request to http://localhost:3000/screenshot/fullpage?url=https://apiflash.com/documentation

app.get("/screenshot", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "URL parameter is required",
      example: "Example: /screenshot?url=https://example.com",
    });
  }

  if (!validUrl.isWebUri(url)) {
    return res.status(400).json({
      error: "Invalid URL format",
      example:
        "URL must be a valid web URL. Example: /screenshot?url=https://example.com",
    });
  }

  try {
    const screenshotData = await captureScreenshot(url, false);
    res
      .status(200)
      .json({ message: "Screenshot captured successfully", screenshotData });
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res.status(500).json({ error: "Error capturing screenshot" });
  }
});

app.get("/screenshot/fullpage", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "URL parameter is required",
      example: "Example: /screenshot/fullpage?url=https://example.com",
    });
  }

  if (!validUrl.isWebUri(url)) {
    return res.status(400).json({
      error: "Invalid URL format",
      example:
        "URL must be a valid web URL. Example: /screenshot/fullpage?url=https://example.com",
    });
  }

  try {
    const screenshotData = await captureScreenshot(url, true);
    res
      .status(200)
      .json({
        message: "Full-page screenshot captured successfully",
        screenshotData,
      });
  } catch (error) {
    console.error("Error capturing full-page screenshot:", error);
    res.status(500).json({ error: "Error capturing full-page screenshot" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
