const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware

const captureScreenshotEncoding = require("./captureScreenshotEncoding");
const captureScreenshotURL = require("./captureScreenshotURL");
const isValidUrlFormat = require("./validURL");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); // Add the cors middleware

// Example Usage:

// http://0.0.0.0:10000/v1/screenshot/fullpage?url=https://www.airbnb.com/

// GET request to http://localhost:3000/v1/screenshot?url=https://apiflash.com/documentation
// GET request to http://localhost:3000/v1/screenshot/fullpage?url=https://apiflash.com/documentation

// https://browserbase-work-trial.onrender.com/v1/screenshot/url?url=https://www.apple.com/
// https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage/url?url=https://www.apple.com/

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
    const screenshotData = await captureScreenshotEncoding(url, false);
    if (!screenshotData) {
      return res
        .status(500)
        .json({ error: "Error capturing screenshot. Make sure url exists." });
    }
    res
      .status(200)
      .json({ message: "Screenshot captured successfully", screenshotData });
  } catch (error) {
    console.error("Error capturing screenshot. Make sure url exists.:", error);
    res
      .status(500)
      .json({ error: "Error capturing screenshot. Make sure url exists." });
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
    const screenshotData = await captureScreenshotEncoding(url, true);
    if (!screenshotData) {
      return res
        .status(500)
        .json({ error: "Error capturing screenshot. Make sure url exists." });
    }
    res.status(200).json({
      message: "Full-page screenshot captured successfully",
      screenshotData,
    });
  } catch (error) {
    console.error("Error capturing full-page screenshot:", error);
    res.status(500).json({ error: "Error capturing full-page screenshot" });
  }
});

app.get("/v1/screenshot/url", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "URL parameter is required",
      example: "Example: /v1/screenshot/url?url=https://example.com",
    });
  }

  if (!isValidUrlFormat(url)) {
    return res.status(400).json({
      error: "Invalid URL format. URL must be a valid web URL.",
      example: "Example: /v1/screenshot/url?url=https://example.com",
    });
  }

  try {
    const screenshotURL = await captureScreenshotURL(url, false);
    if (!screenshotURL) {
      return res
        .status(500)
        .json({ error: "Error capturing screenshot. Make sure url exists." });
    }
    res
      .status(200)
      .json({ message: "Screenshot captured successfully", screenshotURL });
  } catch (error) {
    console.error("Error capturing screenshot. Make sure url exists.:", error);
    res
      .status(500)
      .json({ error: "Error capturing screenshot. Make sure url exists." });
  }
});

app.get("/v1/screenshot/fullpage/url", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "URL parameter is required",
      example: "Example: /v1/screenshot/fullpage/url?url=https://example.com",
    });
  }

  if (!isValidUrlFormat(url)) {
    return res.status(400).json({
      error: "Invalid URL format. URL must be a valid web URL.",
      example: "Example: /v1/screenshot/fullpage/url?url=https://example.com",
    });
  }

  try {
    const screenshotURL = await captureScreenshotURL(url, true);
    if (!screenshotURL) {
      return res
        .status(500)
        .json({ error: "Error capturing screenshot. Make sure url exists." });
    }
    res.status(200).json({
      message: "Fullpage screenshot captured successfully",
      screenshotURL,
    });
  } catch (error) {
    console.error("Error capturing fullpage screenshot:", error);
    res.status(500).json({ error: "Error capturing fullpagge screenshot" });
  }
});

app.listen(10000, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:10000`);
});
