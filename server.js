const express = require("express");
const app = express();
const url = require("url");
const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';



//Import puppeteer function
const searchGoogle = require("./searchGoogle");
const handleGithub = require("./handleGithub");
const handleLinkedin = require("./handleLinkedin");
const handleTwitter = require("./handleTwitter");

// Import cheerio
const githubRepoUsers = require("./github_repos_user");

app.use(express.json());

app.post("/search", async (req, res) => {
  console.log("called post");
  const { name, profile_url, location } = req.body;
  const givenUrl = url.parse(profile_url, true);
  console.log(name);
  console.log(profile_url);
  console.log(location);
  console.log(givenUrl.host); //returns 'localhost:8080'
  console.log(givenUrl.pathname); //returns '/default.htm'

  let result;
  let resultname;

  switch (givenUrl.host) {
    case "www.linkedin.com":
      var slug = givenUrl.pathname.split("/")[2];
      var split = slug.split("-");
      var username =
        split.length > 1
          ? split.slice(0, split.length - 1).join(" ")
          : split[0];

      // result = await searchGoogle("github.com", name, username, location);

      // resultname = handleGithub(result, username, name);

      
       [
        resultGithubSearch,
        resultTwitterSearch,
      ] = await Promise.all([
        searchGoogle("github.com", name, username, location),
        searchGoogle("twitter.com", name, username, location),
      ]);
      githubUrl = handleGithub(resultGithubSearch, username, name);
      twitterUrl = handleTwitter(resultTwitterSearch, username, name)

      res.status(200);
      res.json({
        twitterUrl: twitterUrl,
        githubUrl:githubUrl,
      });

      //   searchGoogle("gitlab.com", name, location ,  givenUrl.pathname);

      break;
    case "www.github.com":
      var username = givenUrl.pathname.split("/")[1]; // for https://github.com/ShubhamKarki
      console.log(username);

       [
        resultLinkedinSearch,
        resultTwitterSearch,
        skills,
      ] = await Promise.all([
        searchGoogle("linkedin.com", name, username, location),
        searchGoogle("twitter.com", name, username, location),
        githubRepoUsers(username),
      ]);
      linkedinUrl = handleLinkedin(resultLinkedinSearch, username, name);
      twitterUrl = handleTwitter(resultTwitterSearch, username, name)

      res.status(200);
      res.json({
        twitterUrl: twitterUrl,
        linkedinUrl:linkedinUrl,
        skills: skills,
      });
      break;
    // case "www.gitlab.com":
    //   searchGoogle("linkedin.com", name, location ,  givenUrl.pathname);
    //   searchGoogle("github.com", name,location ,   givenUrl.pathname);
    //   searchGoogle("twitter.com", name, location ,  givenUrl.pathname);
    //   break;
    case "www.twitter.com":
      var username = givenUrl.pathname.split("/")[1]; // for https://twitter.com/shimpigopal
      console.log(username);
       [
        resultLinkedinSearch,
        resultGithubSearch,
      ] = await Promise.all([
        searchGoogle("linkedin.com", name, username, location),
        searchGoogle("github.com", name, username, location),
      ]);

      linkedinUrl = handleLinkedin(resultLinkedinSearch, username, name);
      githubUrl = handleGithub(resultGithubSearch, username, name)
    

      res.status(200);
      res.json({
        linkedinUrl:linkedinUrl,
        githubUrl:githubUrl,
      });
      // searchGoogle("gitlab.com", name, location ,  givenUrl.pathname);

      break;
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
app.listen(port, ip, () => console.log(`Example app listening on port ${port}! and ip ${ip}`));
