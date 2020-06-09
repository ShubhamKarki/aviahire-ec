const express = require("express");
const app = express();
const url = require("url");
const port = 3000;

//Import puppeteer function
const searchGoogle = require("./searchGoogle");
const handleGithub = require("./handleGithub");

app.use(express.json());

app.post("/search", (req, res) => {
  console.log("called post");
  const { name, profile_url, location } = req.body;
  const givenUrl = url.parse(profile_url, true);
  console.log(name);
  console.log(profile_url);
  console.log(location);
  console.log(givenUrl.host); //returns 'localhost:8080'
  console.log(givenUrl.pathname); //returns '/default.htm'

  switch (givenUrl.host) {
    case "www.linkedin.com":
      var slug = givenUrl.pathname.split("/")[2];
      var split = slug.split("-");
      var username =
        split.length > 1
          ? split.slice(0, split.length - 1).join(" ")
          : split[0];

      searchGoogle("github.com", name, location, givenUrl.pathname).then(
        (results) => {
          console.log(results);
          const result = handleGithub(results, username, name);
          console.log(result);
          //Returns a 200 Status OK with Results JSON back to the client.
          res.status(200);
          res.json(result);
        }
      );
      //   searchGoogle("gitlab.com", name, location ,  givenUrl.pathname);
      //   searchGoogle("twitter.com", name, location ,  givenUrl.pathname);
      break;
    case "www.github.com":
      searchGoogle("linkedin.com", name, location, givenUrl.pathname);
      //   searchGoogle("gitlab.com", name, location ,  givenUrl.pathname);
      //   searchGoogle("twitter.com", name, location ,  givenUrl.pathname);
      break;
    // case "www.gitlab.com":
    //   searchGoogle("linkedin.com", name, location ,  givenUrl.pathname);
    //   searchGoogle("github.com", name,location ,   givenUrl.pathname);
    //   searchGoogle("twitter.com", name, location ,  givenUrl.pathname);
    //   break;
    // case "www.twitter.com":
    //   searchGoogle("linkedin.com", name, location ,  givenUrl.pathname);
    //   searchGoogle("github.com", name, location ,  givenUrl.pathname);
    //   searchGoogle("gitlab.com", name, location ,  givenUrl.pathname);

    //   break;
    default:
      break;
  }

  //   return res.send("Received a POST HTTP method");
});

//Catches requests made to localhost:3000/search
app.get("/search", (request, response) => {
  //Holds value of the query param 'searchquery'.
  const searchQuery = request.query.searchquery;

  //Do something when the searchQuery is not null.
  if (searchQuery != null) {
    searchGoogle(searchQuery).then((results) => {
      console.log(results);
      //Returns a 200 Status OK with Results JSON back to the client.
      response.status(200);
      response.json(results);
    });
  } else {
    response.end();
  }
});

//Catches requests made to localhost:3000/
app.get("/", (req, res) => res.send("Hello World!"));

//Initialises the express server on the port 30000
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
