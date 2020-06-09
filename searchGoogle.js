const puppeteer = require("puppeteer");
const urlParse = require("url");

//  // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)

// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// puppeteer.use(StealthPlugin());

//TODO  Failing AdblockerPlugin
// // Add adblocker plugin, which will transparently block ads in all pages you
// // create using puppeteer.
// const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

function parseUrl(href) {
  try {
    return urlParse.parse(href, true);
  } catch (e) {
    throw e;
  }
}

const searchGoogle = async (site, name, location, slug) => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  await page.exposeFunction('parseUrl', parseUrl);
  //turns request interceptor on
  await page.setRequestInterception(true);

  //if the page makes a  request to a resource type of image or stylesheet then abort that            request
  page.on("request", (request) => {
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet"
    )
      request.abort();
    else request.continue();
  });

  //use google search URL params to directly access the search results for our search query
  await page.goto(
    `https://google.com/search?q=site:${site}+${name}+${location}`
  );
  //Wait for one of the div classes to load
  await page.waitForSelector("div[id=search]");

  //Find all div elements with class 'bkWMgd'
  const searchResults = await page.$$eval("div[class=rc]", (results) => {
    //Array to hold all our results
    let data = [];

    //Iterate over all the results
    results.forEach((result) => {
      //Check if parent has h2 with text 'Web Results'

      //Target the title
      const title = result.querySelector(
        "div[class=rc] > div[class=r] > a >  h3"
      ).innerText;

      //Target the url
      const url = result.querySelector("div[class=rc] > div[class=r] > a").href;


      //Target the description
      const desciption = result.querySelector(
        "div[class=rc] > div[class=s] > div > span[class=st]"
      ).innerText;

      //Add to the return Array
      data.push({ title, desciption, url });
    });

    //Return the search results
    return data;
  });

  await page.screenshot({ path: "example.png" });

  // await browser.close();

  return searchResults;
};

module.exports = searchGoogle;
