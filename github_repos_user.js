const request = require("request");
const util = require("util");
const cheerio = require("cheerio");

const handleGithubReposUser = async (username) => {
  const url = `https://github.com/${username}?tab=repositories`;
  console.log()
  let skills = {};
  const requestPromise = util.promisify(request);
  const response = await requestPromise(url);
  var $ = cheerio.load(response.body);
  console.log("response", $);
  var data = { entries: [], url: url }; // store repos in array
  var items = $(".source");

  // console.log('items.length:', items.length)
  for (var i = 1; i < items.length; i++) {
    var r = {};
    var parent = ".source:nth-child(" + i + ") ";
    // console.log(parent)
    var a = $(".wb-break-all > a", parent);
    if (a && a.length > 0) {
      a = a["0"];
      r.url = a.attribs.href;
      r.name = a.children[0].data.trim();
    }
    // see: http://stackoverflow.com/questions/7969414/ (find element by itemprop)
    var lang = $(parent + 'span[itemprop="programmingLanguage"]');

    if (lang && lang.length > 0) {
      r.lang = lang["0"].children[0].data;
      if (!(r.lang in skills)) {
        skills[r.lang] = 1;
      } else {
        skills[r.lang] += 1;
      }
    }
    r.desc = $(parent + ".repo-list-description")
      .first()
      .text()
      .trim();
    r.info =
      $(parent + ".repo-list-info")
        .first()
        .text()
        .trim() || "";
    r.stars = parseInt(
      $(parent + ".octicon-star")
        .parent()
        .first()
        .text()
        .trim(),
      10
    );
    r.forks = $(parent + ".octicon-git-branch")
      .parent()
      .first()
      .text()
      .trim();
    var updated = $(parent + " relative-time");
    if (updated && updated.length > 0) {
      r.updated = updated["0"].attribs.datetime;
    }

    data.entries.push(r);
  }

  console.log(skills);
  return skills;
};
module.exports = handleGithubReposUser;