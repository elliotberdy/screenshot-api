# Elliot Berdy Screenshot API

## Summary

Hi! This is a **screenshot API** that can be used to receive either a regular of full page screenshot of a given url returned either as a base64 encoding or as a url to a .png file stored in an AWS S3 bucket. It is in it's early stages of development still but I hope you get a chance to play around with it!

The screenshot API uses Puppeteer to launch a browser instance, wait for the page and images to load, and then takes the screenshot.

You can see a potential use case for this API at the following link: [https://screenshot-api-app.onrender.com/](https://screenshot-api-app.onrender.com/). This web app allows you to input a url and visualize either the regular or full page screenshot in the browser, as well as the API response for that given request (note: this web app is using the endpoints that return a link to the screenshot).

![Image](screenshot_api_webapp.png)

## Endpoints

There are currently four available endpoints, each corresponding to either a regular of full page screenshot that either returns a base64 encoding of the image or a link to the image.

### 1. Get url for regular screenshot

> GET /v1/screenshot/url

Retrieves a url for the screenshot of the passed in url website.

### Request

https://browserbase-work-trial.onrender.com/v1/screenshot/url

**cURL Request Example**

curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot/url?url=https://example.com/"

**Query parameters**

**url** | string (_required_)

Example: https://example.com/

Url of website to take screenshot of.

### Responses

**Content Type**

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

### Request

https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage/url

**cURL Request Example**

curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage/url?url=https://example.com/"

**Query parameters**

**url** | string (_required_)

Example: https://example.com/

Url of website to take screenshot of.

### Responses

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

### Request

https://browserbase-work-trial.onrender.com/v1/screenshot

**cURL Request Example**

curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot?url=https://example.com/"

**Query parameters**

**url** | string (_required_)

Example: https://example.com/

Url of website to take screenshot of.

### Responses

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

### Request

https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage

**cURL Request Example**

curl -X GET "https://browserbase-work-trial.onrender.com/v1/screenshot/fullpage?url=https://example.com/"

**Query parameters**

**url** | string (_required_)

Example: https://example.com/

Url of website to take screenshot of.

### Responses

**Content Type**

> 'application/json'

| Status Code | Response Examples                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 200         | `{"message":"Full page screenshot captured successfully","screenshotData":"iVBORw0KGgoAAAANSU...kJggg=="}`                          |
| 400         | `{"error":"URL parameter is required","example":"Example: /v1/screenshot/fullpage?url=https://example.com"}`                        |
| 400         | `{"error":"Invalid URL format. URL must be a valid web URL.","example":"Example: /v1/screenshot/fullpage?url=https://example.com"}` |
| 500         | `{ "error": "Error capturing full page screenshot. Make sure url exists." }`                                                        |

## The Development Story

In this section, I am aiming to give insight into the development process and how and why I made certain decisions and tradeoffs. To start off, we will assume I was given the vague task of "build a screenshot API". The API should be given a URL and return a screenshot and should not used a prebuilt screenshot API :)

### Choosing a programmable browser library

The first task I started researching and thinking about was what library I wanted to use for taking the screenshot. I had heard about a couple of libraries for programmable browsers, but I did not know much about them so I started by researching those.

I came across four popular options: Selenium, Playwright, Cypress, and Puppeteer. Below is a simple table that shows some of the pros and cons I found for each one.

| Tool               | Strengths                                                                                                                                                                               | Considerations                                                                                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selenium WebDriver | - Widely used<br>- Supports multiple programming languages<br>- Good community support<br>- Extensive documentation<br>- Effective for capturing screenshots of web pages               | - Might require more setup compared to some other tools<br>- Primarily designed for end-to-end testing, might be seen as overkill for just capturing screenshots<br>- If already familiar with Selenium or prefer its ecosystem, it can still be a viable option |
| Playwright         | - Developed by Microsoft<br>- Powerful capabilities for browser automation<br>- Supports multiple programming languages<br>- Features like cross-browser testing and headless mode      | - Ecosystem might not be as mature as other tools<br>- Actively maintained, but still gaining popularity<br>- Tailored for modern web development workflows                                                                                                      |
| Cypress            | - Easy to use<br>- Fast and reliable testing capabilities<br>- Can capture screenshots effectively                                                                                      | - Optimized for testing rather than general-purpose web automation<br>- Using it solely for screenshot capture might not leverage its full capabilities<br>- Tests run in controlled environments, may differ from production environments                       |
| Puppeteer          | - Developed by Google<br>- Specifically designed for automating tasks in Chromium-based browsers<br>- High-level API for automation tasks like screenshot capture, PDF generation, etc. | - Chrome/Chromium-specific, may lack cross-browser compatibility<br>- Easy to use with excellent documentation<br>- Well-suited for headless browser automation, including screenshot capture                                                                    |

After doing this research, I came to the conclusion that I wanted to use Puppeteer. It seemed to be simple to use, have a lot of good documentation, and be well suited for simple automation tasks like taking a screenshot. The biggest drawback Puppeteer had for this use case was that it is Chrome specific, but I did not foresee that being an issue for this project.

### Building a simple API that can take a screenshot

The next step was to get familiar with Puppeteer and build a really simple version of the API - an MVP if you will. I found the following simple code to open a web page and take a screenshot of it:

    const puppeteer = require('puppeteer');
    (async () => { const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: 'example.png' });
    await browser.close(); })();

I used this code to set up an API endpoint that when given a url, essentially ran this code leading to a screenshot of the webpage being stored locally.

The next step was having the API return the image to the user instead of saving it locally. The two options that came to mind of doing this were to either return some sort of encoding of the image, or to store the image somewhere and return a URL to that stored image.

Below is a table demonstrating the pros and cons I came up with:

| Pros of base64                             | Cons of base64                                 |
| ------------------------------------------ | ---------------------------------------------- |
| - Simple                                   | - Increased payload size                       |
| - Don't need additional storage            | - Limited scalability                          |
| - Client receives the screenshot instantly | - Consumes more CPU resources to render base64 |

| Pros of storing and returning URL                                              | Cons of storing and returning URL |
| ------------------------------------------------------------------------------ | --------------------------------- |
| - Reduced payload size                                                         | - Need additional storage         |
| - More scalable                                                                | - More complex                    |
| - Allows for flexibility in terms of doing things later on with the screenshot | - Depends on external services    |

I came to the conclusion that ultimately storing the image somewhere and returning a URL to it would be better overall, but Puppeteer makes it really easy to receive the screenshot in a base64 encoding, so I went with that for simplicity at this point with the intention of implementing the URL version later down the line.

Puppeteer also has an easy way of taking a full page screenshot, and knowing a user may want that option, I created another endpoint that would return the full page screenshot in the base64 encoding as well.

Once I got that working, I was left with two API endpoints that when given a URL, could return the base64 encoding of a screenshot of that webpage.

### Deploying the API

Now that I had a basic functional API, my next step was to deploy the API. My next decision was to decide whether I wanted to use a Platform as a Service (PaaS) or an Infrastructure as a service (IaaS). Below is a table detailing the pros and cons I came up with after some research:

| Aspect | Infrastructure-as-a-Service (IaaS)                                                                                                                                                                     | Platform-as-a-Service (PaaS)                                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pros   | - Flexibility: Provides full control over infrastructure components, allowing customization and configuration according to specific requirements.                                                      | - Simplicity: Abstracts away infrastructure management, making deployment and management easier, especially for developers without deep expertise in infrastructure management.          |
|        | - Scalability: Offers scalability with the ability to scale resources up or down based on demand, allowing applications to handle varying workloads effectively.                                       | - Rapid Development: Provides tools and services for automating deployment, scaling, and monitoring, enabling rapid development and iteration of applications.                           |
|        | - Control: Allows fine-grained control over security, networking, and other infrastructure aspects, enabling customization and optimization based on application needs.                                | - Managed Services: Includes managed services such as databases, caching, and monitoring, reducing the operational overhead of managing these components separately.                     |
|        | - Vendor Neutrality: Offers the flexibility to choose from multiple cloud providers or even run on-premises infrastructure, reducing the risk of vendor lock-in.                                       | - Cost-Effectiveness: Often follows a pay-as-you-go pricing model, making it cost-effective for startups and small businesses, with no upfront investment in infrastructure.             |
| Cons   | - Complexity: Requires expertise in managing infrastructure components, including provisioning, configuration, and maintenance, which can be complex and time-consuming.                               | - Limited Control: Provides less control over underlying infrastructure components, limiting customization options and flexibility for applications with specific requirements.          |
|        | - Management Overhead: Involves managing and maintaining infrastructure components, including updates, patches, and security configurations, which can add operational overhead.                       | - Dependency on Provider: Relies on the provider for availability, support, and feature updates, which may limit control and flexibility and result in vendor lock-in.                   |
|        | - Scalability Management: Requires manual management of scalability aspects, such as provisioning additional resources and load balancing, which may be challenging to optimize and scale efficiently. | - Customization Constraints: May impose constraints on application customization and configuration, limiting the ability to tailor the environment to specific requirements.             |
|        | - Cost Considerations: While scalable, costs can increase with resource usage, and careful monitoring and optimization are needed to control expenses effectively.                                     | - Portability: Adapting applications to run on different PaaS platforms or migrating to alternative platforms may be challenging due to vendor-specific configurations and dependencies. |

## Shortcomings and Next Steps

### Concurrency and Scalability:

While the current deployment of the API on a starter instance on render.com is very convenient, it also comes with inherent limitations in terms of CPU access and RAM. As a result, during peak usage or when subjected to a high volume of simultaneous requests, the server may become overloaded, leading to prolonged response times, increased error rates, and potential service disruptions. Addressing these challenges requires implementing effective strategies to enhance both concurrency and scalability.

#### Scalability Strategies:

1.  **Horizontal Scaling with Render**: One option is to upgrade to more powerful instance types offered by Render or leverage Render's support for automatic horizontal scaling based on demand. This would allow the application to dynamically adjust its capacity to handle changes in traffic volume.

2.  **Alternative Providers or Serverless Computing**: There are alternative cloud providers that offer higher-performance instances or it could be worth considering adopting a serverless computing solution like AWS Lambda. Serverless architectures abstract away infrastructure management, allowing for seamless scaling without the need to provision or manage servers.

3.  **Containerization with Docker**: Embrace containerization technology such as Docker to package the API and its dependencies into portable, lightweight containers. Containerization facilitates consistent deployment across different environments and enables efficient scaling across multiple hosts or instances.

#### Concurrency Improvement Strategies:

Render provides a lot of the infrastructure and tools for these strategies. However, some of these strategies may require additional implementation, especially if the API is hosted elsewhere or on my own servers.

1.  **Request Queueing Mechanism**: Implement a request queuing mechanism to manage incoming requests during periods of high traffic. Queuing ensures that requests are processed in an orderly fashion, preventing overload and maintaining responsiveness.

2.  **Concurrency Limit and Load Balancing**: Set a concurrency limit to control the number of concurrent requests that the server can handle. Additionally, leverage load balancing techniques to evenly distribute incoming traffic across multiple server instances, optimizing resource utilization and enhancing scalability.

3.  **Caching Mechanism for Improved Response Times**: Introduce caching mechanisms to alleviate the need for repetitive browser instance launches and page loads. By caching frequently accessed data, certain API requests can be fulfilled more quickly, reducing latency and improving overall performance.

By implementing some or all of these strategies in combination, I could improve the resiliency and performance of the API.

### Added API Customization

The API currently offers users the flexibility to choose between regular screenshots or full-page screenshots, as well as the option to receive the image as a base64 encoding or as a URL. However, expanding the range of customizable features can further empower users and cater to a wider array of requirements. Here are some potential enhancements:

- **Viewport Size Customization**: Allow users to specify the viewport dimensions, enabling simulation of different device resolutions or screen sizes.

- **Resolution Settings**: Provide options for users to define the resolution of captured screenshots, offering flexibility in output quality.

- **Screenshot Format Selection**: Support various image formats like JPEG, PNG, etc., giving users the freedom to choose based on their preferences or application requirements.

- **Custom Wait Strategies**: Enable users to define criteria for determining when a page is ready for screenshot capture, allowing for tailored wait strategies based on specific page characteristics or content loading behaviors.

- **Support for Different Browsers**: Introduce compatibility with different web browsers, providing users with the option to capture screenshots using their preferred browser environment (this may not be reasonable while using the Puppeteer library).

While this list isn't exhaustive, these additional customizations could significantly enhance the versatility and usability of the API, catering to a diverse range of user needs and scenarios.

### Loading Images

On certain larger webpages, not all images fully load before the screenshot is captured. Currently, the API relies on Puppeteer's `{waitUntil: "networkidle2"}` and `"load"`, which entails waiting for no more than two network connections for at least 500 ms and for the load event to fire. While this approach generally does a good job of loading images for a given page, it is not always entirely effective for larger pages.

One potential enhancement is to incorporate the Largest Contentful Paint (LCP) parameter. This metric signifies how quickly the main content of a web page loads, specifically measuring the time from when the user initiates loading the page until the largest image or text block is rendered within the viewport. By waiting for this amount of time before taking the screenshot, we can help ensure that the images fully load.

However, some webpages feature lazy-loaded images, requiring users to scroll down the webpage for the image to start loading. The strategies mentioned above may not address these images. To capture them, the API might need to utilize Puppeteer to scroll through the website before taking the screenshot.

### Web App Design

The current web app that utilizes the API to display a screenshot of a given url is not currently optimized for all screen sizes. The web app needs to be updated to adjust styling and positioning based on what size screen is being used. Additionally, the code for the web app needs to be cleaned up and organized more properly.

### Security Measures

- api key?

- aws authentication?

- https?

- rate limiting?
