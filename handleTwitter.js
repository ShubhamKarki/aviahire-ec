const stringSimilarity = require("string-similarity");
const handleTwitter = (data, username, name) => {
  const dataWithMatchPercent = data.map((element) => {
    var slug = element.url.split("/")[3];
    var twitterUserName = slug
     
    var twitterName = element.title.split("(")[0];
    const usernameMatch = stringSimilarity.compareTwoStrings(
      username.toLowerCase(),
      twitterUserName.toLowerCase()
    );
    const nameMatch = stringSimilarity.compareTwoStrings(
      name.toLowerCase(),
      twitterName.toLowerCase()
    );
    const nameUsernameMatch = stringSimilarity.compareTwoStrings(
      name.toLowerCase(),
      twitterUserName.toLowerCase()
    );
    return {
      ...element,
      match: element.isLocation
        ? (usernameMatch > 0.9 ? usernameMatch * 3 : usernameMatch) +
          nameMatch +
          nameUsernameMatch
        : username.toUpperCase() == twitterUserName.toUpperCase()
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


module.exports = handleTwitter;
