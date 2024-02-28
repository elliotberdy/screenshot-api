# Elliot Berdy Screenshot API

## Summary

Hi! This is a **screenshot API** that can be used to receive either a regular of full page screenshot of a given url as either a base64 encoding or as a link to a .png file stored in an AWS S3 bucket. It is in it's early stages of development still but I hope you get a chance to play around with it!

You can see a potential use case for this API at the following link: [https://browserbase-webapp.onrender.com/](https://browserbase-webapp.onrender.com/). This web app allows you to input a url and visualize either the regular or full page screenshot in the browser, as well as the API response for that API request.

INPUT IMAGE HERE

## Endpoints

There are currently four available endpoints, each corresponding to either a regular of full page screenshot that either returns a base64 encoding of the image or a link to the image.

### Get regular screenshot base64 encoding

> GET /v1/screenshot

Retrieves a base64 encoding of the screenshot of the passed in url.

**Request**

    https://browserbase-work-trial.onrender.com/v1/screenshot

**cURL Request Example**

    curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot?url=https://example.com/"

**Query parameters**

**_url_** | string (_required_)
Example: https://example.com/
Url of website to take screenshot of.

**Responses**

**_Content Type_**

> 'application/json'

**_200_**

    {"message":"Screenshot captured successfully","screenshotData":"iVBORw0KGgoAAAANSU...kJggg=="}

**_400_**

    {"error":"URL parameter is required","example":"Example: /v1/screenshot?url=https://example.com"}

or

    {"error":"Invalid URL format. URL must be a valid web URL.","example":"Example: /v1/screenshot?url=https://example.com"}

**_500_**

    { "error": "Error capturing screenshot. Make sure url exists." }
