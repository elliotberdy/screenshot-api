const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const captureScreenshot = require("./captureScreenshot");
const isValidUrlFormat = require("./captureScreenshot").isValidUrl;

const app = express();
const PORT = process.env.PORT || 3000;

const validUrl = require("valid-url");

app.use(bodyParser.json());

// Example Usage:
// GET request to http://localhost:3000/v1/screenshot?url=https://apiflash.com/documentation
// GET request to http://localhost:3000/v1/screenshot/fullpage?url=https://apiflash.com/documentation

app.get("/v1/screenshot", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "URL parameter is required",
      example: "Example: /v1/screenshot?url=https://example.com",
    });
  }

  if (!isValidUrlFormat(url)) {
    return res.status(400).json({
      error: "Invalid URL format. URL must be a valid web URL.",
      example: "Example: /v1/screenshot?url=https://example.com",
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

app.get("/v1/screenshot/fullpage", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "URL parameter is required",
      example: "Example: /v1/screenshot/fullpage?url=https://example.com",
    });
  }

  if (!isValidUrlFormat(url)) {
    return res.status(400).json({
      error: "Invalid URL format. URL must be a valid web URL.",
      example: "Example: /v1/screenshot/fullpage?url=https://example.com",
    });
  }

  try {
    const screenshotData = await captureScreenshot(url, true);
    res.status(200).json({
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
