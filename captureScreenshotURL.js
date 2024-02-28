const AWS = require("aws-sdk");
const puppeteer = require("puppeteer");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { Readable } = require("stream");
require("dotenv").config();

const s3AccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const s3SecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3Region = process.env.S3_REGION;
const bucketName = process.env.S3_BUCKET;

async function captureScreenshotURL(url, fullpage = false) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: 1287,
      height: 959,
    });

    await page.goto(url, {
      waitUntil: ["networkidle2", "load"],
      timeout: 60000,
    });

    let screenshotDataBlob;
    if (fullpage) {
      screenshotDataBlob = await page.screenshot({
        fullPage: true,
        encoding: "binary",
      });
    } else {
      screenshotDataBlob = await page.screenshot({ encoding: "binary" });
    }

    // Configure AWS S3 client
    const s3Client = new AWS.S3({
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId,
        secretAccessKey: s3SecretAccessKey,
      },
    });

    // Upload the screenshot stream to S3 using Upload API
    const upload = await s3Client
      .upload({
        Bucket: bucketName,
        Key: `screenshot-${Date.now()}.png`, // Unique key for the image file
        Body: screenshotDataBlob,
      })
      .promise();

    console.log(upload.Location);

    console.log("Image uploaded successfully:", upload);
    return upload.Location;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return null; // Or handle the error as needed
  } finally {
    await browser.close();
  }
}

module.exports = captureScreenshotURL;
