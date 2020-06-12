const stringSimilarity = require("string-similarity");
const handleLinkedin = (data, username, name) => {
  const dataWithMatchPercent = data.map((element) => {
    var slug = element.url.split("/")[4];
    var split = slug.split("-");
    var linkedinUserName =
      split.length > 1 ? split.slice(0, split.length - 1).join("-") : split[0];
    console.log(username.toUpperCase() == linkedinUserName.toUpperCase(), "\n");
    var linkedinName = element.title.split("-")[0];
    const usernameMatch = stringSimilarity.compareTwoStrings(
      username.toLowerCase(),
      linkedinUserName.toLowerCase()
    );
    const nameMatch = stringSimilarity.compareTwoStrings(
      name.toLowerCase(),
      linkedinName.toLowerCase()
    );
    const nameUsernameMatch = stringSimilarity.compareTwoStrings(
      name.toLowerCase(),
      linkedinUserName.toLowerCase()
    );
    return {
      ...element,
      match: element.isLocation
        ? (usernameMatch > 0.9 ? usernameMatch * 3 : usernameMatch) +
          nameMatch +
          nameUsernameMatch
        : username.toUpperCase() == linkedinUserName.toUpperCase()
        ? usernameMatch * 3
        : 0,
    };
  });
  dataWithMatchPercent.sort(function (a, b) {
    return b.match - a.match;
  });
  console.log(dataWithMatchPercent);
  if (dataWithMatchPercent[0].match > 0.8) return dataWithMatchPercent[0];
  else return " no account found";
};


module.exports = handleLinkedin;
