console.log('Print test before async func call');



async function getTwitterUser(username, endpoint = 'user') {
  try {
    var res = await fetch(`http://localhost:8080/${endpoint}?username=${username}`, {
      // this will be your heroku domain
      method: 'POST',
      mode: 'no-cors',
      // body: JSON.stringify({
      //   username,
      // }),
      cache: "no-cache",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      // body: { hello: "world" } 
    })

    // user tweets are stored 
    var body = await res.json()
    
    return body; 

  } catch (err) {
    console.log('Issue with line 20 index.js', err)
  }
}

// update state t
/* this.state = {
  tweets: [];
}

*/

/*
const newTweets = await getTweets();
this.setState({ tweets: newTweets })

render() { return <div>{this.state.tweets.toString()}</div>}
*/

// async function returns a promise , need to await promise to use response or else tweets will be undefined 
// get twitter user returns promise, can only be accessed with await
// how to get text value from input react


// (async function () {

//   // must call getTwitterUser on button click from drop down menu  
//   var tweets = await getTwitterUser('scena360', 'user');

//   // to access a different function on the API change the end point to the new endpoint with the new function  

//   console.log(tweets)
//   var p = document.createElement('p');
//   p.innerText = tweets.toString();
//   var body = document.querySelector('#body')
//   body.appendChild(p)
// })()


async function getInput(){

  var x = document.getElementById("userinput").value;
  let count = 0

  // holds 200 most recent tweets from user x 
  tweetArray = await getTwitterUser(x);
  console.log(tweetArray)

  // Resets table elm, each time load data is pressed
  var tableElm = document.querySelector('#tablebody');
  var tableRows = document.querySelectorAll('.tweet');
  // nukes existing table before creating new from tweetArray
  tableRows.forEach(row => row.remove());


  // revamp return value to return screen name and date and time then tweet as a column of its own 

  // clear all the children.
  // tableElm.removeChi

  for (i = 0; i < tweetArray.length; i++) {

    console.log("for loop run");

    // if (document.querySelector(`#tweet-${i}`) !== null) {
    //   continue;
    // }
    var temp = document.createElement('tr');
    temp.className = 'tweet'
    temp.innerText = "                " + (i + 1) + ":                " + tweetArray[i]
    temp.id = `tweet-${i}`; // todo replace i with some unique id
    tableElm.appendChild(temp)    

}

console.log("getInput has run ")

}


console.log('End of index.js');

