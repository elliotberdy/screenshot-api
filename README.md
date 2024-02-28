# Elliot Berdy Screenshot API

## Summary

Hi! This is a **screenshot API** that can be used to receive either a regular of full page screenshot of a given url returned either as a base64 encoding or as a url to a .png file stored in an AWS S3 bucket. It is in it's early stages of development still but I hope you get a chance to play around with it!

The screenshot API uses Puppeteer to launch a browser instance, wait for the page and images to load, and then takes the screenshot.

You can see a potential use case for this API at the following link: [https://browserbase-webapp.onrender.com/](https://browserbase-webapp.onrender.com/). This web app allows you to input a url and visualize either the regular or full page screenshot in the browser, as well as the API response for that given request (note: this web app is using the endpoints that return a link to the screenshot).

![Image](screenshot_api_webapp.png)

## Endpoints

There are currently four available endpoints, each corresponding to either a regular of full page screenshot that either returns a base64 encoding of the image or a link to the image.

### 1. Get url for regular screenshot

> GET /v1/screenshot/url

Retrieves a url for the screenshot of the passed in url website.

#### Request

    https://browserbase-work-trial.onrender.com/v1/screenshot/url

##### **cURL Request Example**

    curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot/url?url=https://example.com/"

##### **Query parameters**

**url** | string (_required_)  
Example: https://example.com/  
Url of website to take screenshot of.

#### Responses

##### **Content Type**

> 'application/json'

| Status Code | Response Examples                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200         | `{"message":"Screenshot captured successfully","screenshotURL":"https://api-screenshots-browserbase.s3.us-west-2.amazonaws.com/screenshot-1709150937398.png"}` |
| 400         | `{"error":"URL parameter is required","example":"Example: /v1/screenshot/url?url=https://example.com"}`                                                        |
| 400         | `{"error":"Invalid URL format. URL must be a valid web URL.","example":"Example: /v1/screenshot/url?url=https://example.com"}`                                 |
| 500         | `{ "error": "Error capturing screenshot. Make sure url exists." }`                                                                                             |

### 2. Get url for full page screenshot

> GET /v1/screenshot/fullpage/url

Retrieves a url for the fulll page screenshot of the passed in url website.

#### Request

    https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage/url

**cURL Request Example**

    curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage/url?url=https://example.com/"

**Query parameters**

**url** | string (_required_)  
Example: https://example.com/  
Url of website to take screenshot of.

#### Responses

**Content Type**

> 'application/json'

| Status Code | Response Examples                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200         | `{"message":"Full page screenshot captured successfully","screenshotURL":"https://api-screenshots-browserbase.s3.us-west-2.amazonaws.com/screenshot-1709150937398.png"}` |
| 400         | `{"error":"URL parameter is required","example":"Example: /v1/screenshot/fullpage/url?url=https://example.com"}`                                                         |
| 400         | `{"error":"Invalid URL format. URL must be a valid web URL.","example":"Example: /v1/screenshot/fullpage/url?url=https://example.com"}`                                  |
| 500         | `{ "error": "Error capturing screenshot. Make sure url exists." }`                                                                                                       |

### 3. Get regular screenshot base64 encoding

> GET /v1/screenshot

Retrieves a base64 encoding of the screenshot of the passed in url website.

#### Request

    https://browserbase-work-trial.onrender.com/v1/screenshot

**cURL Request Example**

    curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot?url=https://example.com/"

**Query parameters**

**url** | string (_required_)  
Example: https://example.com/  
Url of website to take screenshot of.

#### Responses

**Content Type**

> 'application/json'

| Status Code | Response Examples                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| 200         | `{"message":"Screenshot captured successfully","screenshotData":"iVBORw0KGgoAAAANSU...kJggg=="}`                           |
| 400         | `{"error":"URL parameter is required","example":"Example: /v1/screenshot?url=https://example.com"}`                        |
| 400         | `{"error":"Invalid URL format. URL must be a valid web URL.","example":"Example: /v1/screenshot?url=https://example.com"}` |
| 500         | `{ "error": "Error capturing screenshot. Make sure url exists." }`                                                         |

### 4. Get full page screenshot base64 encoding

> GET /v1/screenshot/fullpage

Retrieves a base64 encoding of the full page screenshot of the passed in url website.

#### Request

    https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage

**cURL Request Example**

    curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage?url=https://example.com/"

**Query parameters**

**url** | string (_required_)  
Example: https://example.com/  
Url of website to take screenshot of.

#### Responses

**Content Type**

> 'application/json'

| Status Code | Response Examples                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 200         | `{"message":"Full page screenshot captured successfully","screenshotData":"iVBORw0KGgoAAAANSU...kJggg=="}`                         |
| 400         | `{"error":"URL parameter is required","example":"Example: /v1/screenshot/fullpage?url=https://example.com"}`                       |
| 400         | `"error":"Invalid URL format. URL must be a valid web URL.","example":"Example: /v1/screenshot/fullpage?url=https://example.com"}` |
| 500         | `{ "error": "Error capturing full page screenshot. Make sure url exists." }`                                                       |

## Shortcomings and Next Steps

### Concurrency and Scalability:

While the current deployment of the API on a starter instance on render.com is very convenient, it also comes with inherent limitations in terms of CPU access and RAM. As a result, during peak usage or when subjected to a high volume of simultaneous requests, the server may become overloaded, leading to prolonged response times, increased error rates, and potential service disruptions. Addressing these challenges requires implementing effective strategies to enhance both concurrency and scalability.

#### Scalability Strategies:

1.  **Horizontal Scaling with Render**: One option is to upgrade to more powerful instance types offered by Render or leveraging Render's support for automatic horizontal scaling based on demand. This would allow the application to dynamically adjust its capacity to handle changes in traffic volume.
2.  **Alternative Providers or Serverless Computing**: There are alternative cloud providers that offer higher-performance instances or it could be worth considering adopting a serverless computing solution like AWS Lambda. Serverless architectures abstract away infrastructure management, allowing for seamless scaling without the need to provision or manage servers.
3.  **Containerization with Docker**: Embrace containerization technology such as Docker to package the API and its dependencies into portable, lightweight containers. Containerization facilitates consistent deployment across different environments and enables efficient scaling across multiple hosts or instances.

#### Concurrency Improvement Strategies:

1.  **Request Queueing Mechanism**: Implement a request queuing mechanism to manage incoming requests during periods of high traffic. Queuing ensures that requests are processed in an orderly fashion, preventing overload and maintaining responsiveness.
2.  **Concurrency Limit and Load Balancing**: Set a concurrency limit to control the number of concurrent requests that the server can handle. Additionally, leverage load balancing techniques to evenly distribute incoming traffic across multiple server instances, optimizing resource utilization and enhancing scalability.
3.  **Caching Mechanism for Improved Response Times**: Introduce caching mechanisms to alleviate the need for repetitive browser instance launches and page loads. By caching frequently accessed data, certain API requests can be fulfilled more quickly, reducing latency and improving overall performance.

By implementing some or all of these strategies in combination, I could improve the resilience and performance of the API.

### Added API Customization

The API currently offers users the flexibility to choose between regular screenshots or full-page screenshots, as well as the option to receive the image as a base64 encoding or as a URL. However, expanding the range of customizable features can further empower users and cater to a wider array of requirements. Here are some potential enhancements:

- **Viewport Size Customization**: Allow users to specify the viewport dimensions, enabling simulation of different device resolutions or screen sizes.
- **Resolution Settings**: Provide options for users to define the resolution of captured screenshots, offering flexibility in output quality.
- **Screenshot Format Selection**: Support various image formats like JPEG, PNG, etc., giving users the freedom to choose based on their preferences or application requirements.
- **Custom Wait Strategies**: Enable users to define criteria for determining when a page is ready for screenshot capture, allowing for tailored wait strategies based on specific page characteristics or content loading behaviors.
- **Support for Different Browsers**: Introduce compatibility with different web browsers, providing users with the option to capture screenshots using their preferred browser environment.

While this list isn't exhaustive, these additional customizations could significantly enhance the versatility and usability of the API, catering to a diverse range of user needs and scenarios.

### Security Measures

### Loading Images

On certain larger webpages, not all images fully load before the screenshot is captured. Currently, the API relies on Puppeteer's `{waitUntil: "networkidle2"}` and `"load"`, which entails waiting for no more than two network connections for at least 500 ms and for the load event to fire. While this approach generally does a good job of loading images for a given page, it is not always entirely effective for larger pages.

One potential enhancement is to incorporate the Largest Contentful Paint (LCP) parameter. This metric signifies how quickly the main content of a web page loads, specifically measuring the time from when the user initiates loading the page until the largest image or text block is rendered within the viewport. By waiting for this amount of time before taking the screenshot, we can help ensure that the images fully load.

However, some webpages feature lazy-loaded images, requiring users to scroll down the webpage for the image to start loading. The strategies mentioned above may not address these images. To capture them, the API might need to utilize Puppeteer to scroll through the website before taking the screenshot.

### Web App Design

The current web app that utilizes the API to display a screenshot of a given url is not currently optimized for all screen sizes. The web app needs to be updated to adjust styling and positioning based on what size screen is being used. Additionally, the code for the web app needs to be cleaned up and organized more properly.
