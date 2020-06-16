const stringSimilarity = require("string-similarity");

const handleGithub = (data, username, name) => {
  const dataWithMatchPercent = data.map((element) => {
    var res = element.title.split(" ");
    var githubUserName = res[0];
    var githubNameWithBracket = element.title.match(/\((.*?)\)/g);
    var githubName;
    if (githubNameWithBracket == null) {
      githubName = "";
    } else {
      githubName = githubNameWithBracket.map((b) =>
        b.replace(/\(|(.*?)\)/g, "$1")
      )[0];
    }

    console.log(element.title);
    console.log(
      stringSimilarity.compareTwoStrings( 
        username.toLowerCase(),
        githubUserName.toLowerCase()
      )
    );
    const usernameMatch = stringSimilarity.compareTwoStrings(
      username.toLowerCase(),
      githubUserName.toLowerCase()
    );
    console.log(githubUserName.toLowerCase(), username.toLowerCase());
    console.log("");
    console.log(
      stringSimilarity.compareTwoStrings(
        name.toLowerCase(),
        githubName.toLowerCase()
      )
    );
    const nameMatch = stringSimilarity.compareTwoStrings(
      name.toLowerCase(),
      githubName.toLowerCase()
    );
    const nameUsernameMatch = stringSimilarity.compareTwoStrings(
      name.toLowerCase(),
      githubUserName.toLowerCase()
    );

    return {
      ...element,
      match: element.isLocation
        ? (usernameMatch > 0.9 ? usernameMatch * 3 : usernameMatch) +
          nameMatch +
          nameUsernameMatch
        : username.toUpperCase() == githubUserName.toUpperCase()
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
module.exports = handleGithub;
