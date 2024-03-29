async function getTwitterUser(username, selection, endpoint = "user") {
  try {
    // change this address to deployed site
    var res = await fetch(
      `http://localhost:8080/${endpoint}?username=${username}&selection=${selection}`,
      {
        // this will be your heroku domain
        method: "POST",
        mode: "no-cors",

        cache: "no-cache",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    );
    // user tweets are stored in body
    var body = await res.json();
    return body;
  } catch (err) {
    console.log("Issue with line 20 index.js", err);
  }
}

async function updateTotalTweets() {
  try {
    // change this address to deployed site
    var res = await fetch(`http://localhost:8080/update`, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    var body = await res.json();
    return body;
  } catch (err) {
    console.log("Issue with line 47 index.js", err);
  }
}

async function callUpdate() {
  return formatNumber(await updateTotalTweets());
}

// formats any large number with comma's and appropriate spacing
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

async function getInput(e) {
  // Returns drop down menu selection of how to retreive Tweets
  var dataChoice = document.getElementById("selectTag").value;

  // if user selects filter by username retrieve last 200 tweets of the given username or none if not found
  if (dataChoice == "Username") {
    var x = document.getElementById("userinput").value;

    // holds 200 most recent tweets from user 'x'
    tweetArray = await getTwitterUser(x, "username");

    totalTweets = await callUpdate();
    console.log(totalTweets);
    var total = document.getElementById("totalTweets");
    total.innerText = `${totalTweets} Tweets Scope To Date `;

    var searchResults = document.getElementById("searchResults");
    searchResults.innerText =
      tweetArray.length + ": Total Tweets By Username: @" + x;

    // if no tweets are found
    if (tweetArray.length === 0) {
      var noResults = document.getElementById("notweets");
      noResults.innerText = `No Tweets Found For ${x}, Try changing your search`;
      searchResults.innerText = "";
    } else {
      var noResults = document.getElementById("notweets");
      noResults.innerText = "";
    }

    if (tweetArray.length > 0) {
      // array of compound scores
      var sentimentScores = tweetArray.map(
        (elm) => elm["sentiment"]["compound"]
      );
      var total = 0;
      for (var i = 0; i < sentimentScores.length; i++) {
        total += sentimentScores[i];
      }

      var avgScore = (total / sentimentScores.length).toFixed(3);

      var overallScore = "Neutral";

      if (avgScore >= 0.05) {
        overallScore = "Positive";
      } else if (avgScore <= -0.05) {
        overallScore = "Negative";
      }

      var scoreTag = document.getElementById("sentimentScore");
      scoreTag.innerText = `Resulting in an Overall ${overallScore} Sentiment, with an average compound score of:  ${avgScore}`;
    } else {
      var scoreTag = document.getElementById("sentimentScore");
      scoreTag.innerText = "";
    }

    console.log("Average Sentiment Score ", avgScore);

    console.log(tweetArray);

    // Resets table elm, each time load data is pressed
    var tableElm = document.querySelector("#tablebody");
    var tableRows = document.querySelectorAll(".tweet");

    // nukes existing table rows before creating new from tweetArray
    tableRows.forEach((row) => row.remove());

    // iterates over array containing all Tweets
    for (i = 0; i < tweetArray.length; i++) {
      // href link so user can click row and redirect to actual Tweet itself
      var tweetLink = document.createElement("a");
      tweetLink.className = "tweet";
      // the link is created using this url and adding the Tweet's ID to the end
      tweetLink.href =
        "https://twitter.com/twitter/statuses/" + tweetArray[i]["id"];
      // setting the target to blank so that it opens in a new window
      tweetLink.target = "_blank";

      // Creates new row tag to hold Tweet Data
      var newRow = document.createElement("tr");
      newRow.className = "tweet";

      // creates column to hold Date
      var date = document.createElement("td");
      date.className = "tweet";
      date.innerText = tweetArray[i]["date"];

      // creates column to hold the username
      var handle = document.createElement("td");
      handle.className = "tweet";

      if (tweetArray[i]["verified"]) {
        handle.innerText = tweetArray[i]["username"] + "☑️";
      } else {
        handle.innerText = tweetArray[i]["username"];
      }

      // creates column to hold the text of the Tweet
      var tweetText = document.createElement("td");
      tweetText.className = "tweet";
      tweetText.innerText = tweetArray[i]["tweet"];

      // creates column to hold favorite count
      var favoriteCount = document.createElement("td");
      favoriteCount.className = "tweet";
      favoriteCount.innerText = formatNumber(tweetArray[i]["favorites"]);

      // creates column to hold Retweet count
      var retweetCount = document.createElement("td");
      retweetCount.className = "tweet";
      retweetCount.innerText = formatNumber(tweetArray[i]["retweets"]);

      // column for sentiment analysis
      var sentiment = document.createElement("td");
      sentiment.className = "tweet";
      sentiment.innerText = tweetArray[i]["sentiment"]["compound"];

      // adds columns to new row
      newRow.appendChild(date);
      newRow.appendChild(handle);

      // wraps text column in a tag for href, then add the <a> to the row itself
      tweetLink.appendChild(tweetText);
      newRow.appendChild(tweetLink);

      newRow.appendChild(favoriteCount);
      newRow.appendChild(retweetCount);
      newRow.appendChild(sentiment);

      // adds new row to existing table element
      tableElm.appendChild(newRow);
    }

    // if user selects Twwets by Hashtag, retrieve last 200 tweets containing the hashtag or none if not found
  } else if (dataChoice == "Hashtag") {
    var x = document.getElementById("userinput").value;

    tweetArray = await getTwitterUser(x, "hashtag");
    console.log(tweetArray);

    var searchResults = document.getElementById("searchResults");
    searchResults.innerText =
      tweetArray.length + ": Total Tweets By hashtag: #" + x;

    totalTweets = await callUpdate();
    console.log(totalTweets);
    var total = document.getElementById("totalTweets");
    total.innerText = `${totalTweets} Tweets Scope To Date `;

    // if no tweets are found
    if (tweetArray.length === 0) {
      var noResults = document.getElementById("notweets");
      noResults.innerText = `No Tweets Found For ${x}, Try changing your search`;
      searchResults.innerText = "";
    } else {
      var noResults = document.getElementById("notweets");
      noResults.innerText = "";
    }

    if (tweetArray.length > 0) {
      // array of compound scores
      var sentimentScores = tweetArray.map(
        (elm) => elm["sentiment"]["compound"]
      );
      var total = 0;
      for (var i = 0; i < sentimentScores.length; i++) {
        total += sentimentScores[i];
      }

      var avgScore = (total / sentimentScores.length).toFixed(3);

      var overallScore = "Neutral";

      if (avgScore >= 0.05) {
        overallScore = "Positive";
      } else if (avgScore <= -0.05) {
        overallScore = "Negative";
      }

      var scoreTag = document.getElementById("sentimentScore");
      scoreTag.innerText = `Resulting in an Overall ${overallScore} Sentiment, with an average compound score of:  ${avgScore}`;
    } else {
      var scoreTag = document.getElementById("sentimentScore");
      scoreTag.innerText = "";
    }

    // Resets table elm, each time load data is pressed
    var tableElm = document.querySelector("#tablebody");
    var tableRows = document.querySelectorAll(".tweet");

    // nukes existing table rows before creating new from tweetArray
    tableRows.forEach((row) => row.remove());

    // iterates over array containing all relevant Tweet information
    for (i = 0; i < tweetArray.length; i++) {
      // href link so user can click row and redirect to actual Tweet itself
      var tweetLink = document.createElement("a");
      tweetLink.className = "tweet";
      // the link is creating using this url and adding the Tweets ID to the end
      tweetLink.href =
        "https://twitter.com/twitter/statuses/" + tweetArray[i]["id"];
      // setting the target to blank so that it opens in a new window
      tweetLink.target = "_blank";

      // Creates new row tag to hold Tweet Data
      var newRow = document.createElement("tr");
      newRow.className = "tweet";

      // creates column to hold Date
      var date = document.createElement("td");
      date.className = "tweet";
      date.innerText = tweetArray[i]["date"];

      // creates column to hold the username
      var handle = document.createElement("td");
      handle.className = "tweet";
      if (tweetArray[i]["verified"]) {
        handle.innerText = tweetArray[i]["username"] + "☑️";
      } else {
        handle.innerText = tweetArray[i]["username"];
      }

      // creates column to hold the text of the Tweet
      var tweetText = document.createElement("td");
      tweetText.className = "tweet";
      tweetText.innerText = tweetArray[i]["tweet"];

      // creates column to hold favorite count
      var favoriteCount = document.createElement("td");
      favoriteCount.className = "tweet";
      favoriteCount.innerText = formatNumber(tweetArray[i]["favorites"]);

      // creates column to hold Retweet count
      var retweetCount = document.createElement("td");
      retweetCount.className = "tweet";
      retweetCount.innerText = formatNumber(tweetArray[i]["retweets"]);

      // column for sentiment analysis
      var sentiment = document.createElement("td");
      sentiment.className = "tweet";
      sentiment.innerText = tweetArray[i]["sentiment"]["compound"];

      // adds columns to new row
      newRow.appendChild(date);
      newRow.appendChild(handle);

      // wraps text column in a tag for href, then add the <a> to the row itself
      tweetLink.appendChild(tweetText);
      newRow.appendChild(tweetLink);

      newRow.appendChild(favoriteCount);
      newRow.appendChild(retweetCount);
      newRow.appendChild(sentiment);

      // adds new row to existing table element
      tableElm.appendChild(newRow);
    }

    // if user selects Liked Tweets By username, retrieve last 200 liked Tweets of the user or 0 if none exist or if the user does not exist
  } else if (dataChoice == "Liked Tweets By Username") {
    var x = document.getElementById("userinput").value;

    tweetArray = await getTwitterUser(x, "Liked Tweets By Username");

    console.log(tweetArray);

    var searchResults = document.getElementById("searchResults");
    searchResults.innerText =
      tweetArray.length + ": Total Liked Tweets By Username: @" + x;

    totalTweets = await callUpdate();
    console.log(totalTweets);
    var total = document.getElementById("totalTweets");
    total.innerText = `${totalTweets} Tweets Scope To Date `;

    // if no tweets are found
    if (tweetArray.length === 0) {
      var noResults = document.getElementById("notweets");
      noResults.innerText = `No Tweets Found For ${x}, Try changing your search`;
      searchResults.innerText = "";
    } else {
      var noResults = document.getElementById("notweets");
      noResults.innerText = "";
    }

    if (tweetArray.length > 0) {
      // array of compound scores
      var sentimentScores = tweetArray.map(
        (elm) => elm["sentiment"]["compound"]
      );
      var total = 0;
      for (var i = 0; i < sentimentScores.length; i++) {
        total += sentimentScores[i];
      }

      var avgScore = (total / sentimentScores.length).toFixed(3);

      var overallScore = "Neutral";

      if (avgScore >= 0.05) {
        overallScore = "Positive";
      } else if (avgScore <= -0.05) {
        overallScore = "Negative";
      }

      var scoreTag = document.getElementById("sentimentScore");
      scoreTag.innerText = `Resulting in an Overall ${overallScore} Sentiment, with an average compound score of:  ${avgScore}`;
    } else {
      var scoreTag = document.getElementById("sentimentScore");
      scoreTag.innerText = "";
    }

    // Resets table elm, each time load data is pressed
    var tableElm = document.querySelector("#tablebody");
    var tableRows = document.querySelectorAll(".tweet");

    // nukes existing table rows before creating new from tweetArray
    tableRows.forEach((row) => row.remove());

    // iterates over array containing all relevant Tweet information
    for (i = 0; i < tweetArray.length; i++) {
      // href link so user can click row and redirect to actual Tweet itself
      var tweetLink = document.createElement("a");
      tweetLink.className = "tweet";
      // the link is creating using this url and adding the Tweets ID to the end
      tweetLink.href =
        "https://twitter.com/twitter/statuses/" + tweetArray[i]["id"];
      // setting the target to blank so that it opens in a new window
      tweetLink.target = "_blank";

      // Creates new row tag to hold Tweet Data
      var newRow = document.createElement("tr");
      newRow.className = "tweet";

      // creates column to hold Date
      var date = document.createElement("td");
      date.className = "tweet";
      date.innerText = tweetArray[i]["date"];

      // creates column to hold the username
      var handle = document.createElement("td");
      handle.className = "tweet";
      if (tweetArray[i]["verified"]) {
        handle.innerText = tweetArray[i]["username"] + "☑️";
      } else {
        handle.innerText = tweetArray[i]["username"];
      }

      // creates column to hold the text of the Tweet
      var tweetText = document.createElement("td");
      tweetText.className = "tweet";
      tweetText.innerText = tweetArray[i]["tweet"];

      // creates column to hold favorite count
      var favoriteCount = document.createElement("td");
      favoriteCount.className = "tweet";
      favoriteCount.innerText = formatNumber(tweetArray[i]["favorites"]);

      // creates column to hold Retweet count
      var retweetCount = document.createElement("td");
      retweetCount.className = "tweet";
      retweetCount.innerText = formatNumber(tweetArray[i]["retweets"]);

      // column for sentiment analysis
      var sentiment = document.createElement("td");
      sentiment.className = "tweet";
      sentiment.innerText = tweetArray[i]["sentiment"]["compound"];

      // adds columns to new row
      newRow.appendChild(date);
      newRow.appendChild(handle);

      // wraps text column in a tag for href, then add the <a> to the row itself
      tweetLink.appendChild(tweetText);
      newRow.appendChild(tweetLink);

      newRow.appendChild(favoriteCount);
      newRow.appendChild(retweetCount);
      newRow.appendChild(sentiment);

      // adds new row to existing table element
      tableElm.appendChild(newRow);
    }
  }
} // Ends Conditional Block
