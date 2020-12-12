async function getTwitterUser(username, selection, endpoint = 'user') {
  try {
    var res = await fetch(`http://localhost:8080/${endpoint}?username=${username}&selection=${selection}`, {
      // this will be your heroku domain
      method: 'POST',
      mode: 'no-cors',
      
      cache: "no-cache",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
       
    })
    // user tweets are stored in body
    var body = await res.json()
    return body; 

  } catch (err) {
    console.log('Issue with line 20 index.js', err)
  }
}


function formatNumber(num) {

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')


}

async function getInput(e){

  // holds selection of how to retrieve the Tweets
  var dataChoice = document.getElementById("selectTag").value;


  // if user selects by username retrieve last 200 tweets of the given username or none if not found
  if (dataChoice == "Username") {
    //  block of code to be executed if the condition is true

    var x = document.getElementById("userinput").value;
  
    // holds 200 most recent tweets from user x 
    tweetArray = await getTwitterUser(x, "username");
    console.log(tweetArray)
  
    // Resets table elm, each time load data is pressed
    var tableElm = document.querySelector('#tablebody');
    var tableRows = document.querySelectorAll('.tweet');
    
    // nukes existing table rows before creating new from tweetArray
    tableRows.forEach(row => row.remove());
  
  

    for (i = 0; i < tweetArray.length; i++) {
  
      console.log("for loop run");
  
      var temp1 = document.createElement('tr');
      temp1.className = 'tweet'
      var temp2 = document.createElement('td');
      temp2.className = 'tweet'
      temp2.innerText = tweetArray[i]["date"]
      var temp3 = document.createElement('td');
      temp3.className = 'tweet'
      temp3.innerText = tweetArray[i]["username"]
      var temp4 = document.createElement('td');
      temp4.className = 'tweet'
      temp4.innerText = tweetArray[i]["tweet"]

      var temp5 = document.createElement('td');
      temp5.className = 'tweet'
      temp5.innerText = formatNumber(tweetArray[i]["favorites"])

      var temp6 = document.createElement('td');
      temp6.className = 'tweet'
      temp6.innerText = formatNumber(tweetArray[i]["retweets"])


      temp1.appendChild(temp2)
      temp1.appendChild(temp3)
      temp1.appendChild(temp4)
      temp1.appendChild(temp5)   
      temp1.appendChild(temp6)
      tableElm.appendChild(temp1)
      
  
  }
    


  } else if (dataChoice == "Hashtag") {
    
    var x = document.getElementById("userinput").value;
    
    tweetArray = await getTwitterUser(x,"hashtag");
    console.log(tweetArray)
  
    // Resets table elm, each time load data is pressed
    var tableElm = document.querySelector('#tablebody');
    var tableRows = document.querySelectorAll('.tweet');
    
    // nukes existing table rows before creating new from tweetArray
    tableRows.forEach(row => row.remove());
  
    for (i = 0; i < tweetArray.length; i++) {
  
      console.log("for loop run");
  
      var temp1 = document.createElement('tr');
      temp1.className = 'tweet'
      var temp2 = document.createElement('td');
      temp2.className = 'tweet'
      temp2.innerText = tweetArray[i]["date"]
      var temp3 = document.createElement('td');
      temp3.className = 'tweet'
      temp3.innerText = tweetArray[i]["username"]
      var temp4 = document.createElement('td');
      temp4.className = 'tweet'
      temp4.innerText = tweetArray[i]["tweet"]
  

      var temp5 = document.createElement('td');
      temp5.className = 'tweet'
      temp5.innerText = formatNumber(tweetArray[i]["favorites"])

      var temp6 = document.createElement('td');
      temp6.className = 'tweet'
      temp6.innerText = formatNumber(tweetArray[i]["retweets"])


      temp1.appendChild(temp2)
      temp1.appendChild(temp3)
      temp1.appendChild(temp4)
      temp1.appendChild(temp5)   
      temp1.appendChild(temp6)
      tableElm.appendChild(temp1)
  
  }
    



  }else if (dataChoice == "Liked Tweets By Username") {
    
    var x = document.getElementById("userinput").value;
    
    tweetArray = await getTwitterUser(x,"Liked Tweets By Username");
    
    console.log(tweetArray)
  
    // Resets table elm, each time load data is pressed
    var tableElm = document.querySelector('#tablebody');
    var tableRows = document.querySelectorAll('.tweet');
    
    // nukes existing table rows before creating new from tweetArray
    tableRows.forEach(row => row.remove());
  
    for (i = 0; i < tweetArray.length; i++) {
  
      console.log("for loop run");
  
      var temp1 = document.createElement('tr');
      temp1.className = 'tweet'
      var temp2 = document.createElement('td');
      temp2.className = 'tweet'
      temp2.innerText = tweetArray[i]["date"]
      var temp3 = document.createElement('td');
      temp3.className = 'tweet'
      temp3.innerText = tweetArray[i]["username"]
      var temp4 = document.createElement('td');
      temp4.className = 'tweet'
      temp4.innerText = tweetArray[i]["tweet"]
  
      var temp5 = document.createElement('td');
      temp5.className = 'tweet'
      temp5.innerText = formatNumber(tweetArray[i]["favorites"])

      var temp6 = document.createElement('td');
      temp6.className = 'tweet'
      temp6.innerText = formatNumber(tweetArray[i]["retweets"])


      temp1.appendChild(temp2)
      temp1.appendChild(temp3)
      temp1.appendChild(temp4)
      temp1.appendChild(temp5)   
      temp1.appendChild(temp6)
      tableElm.appendChild(temp1)
  }


  }


 



}

console.log(document.all)

var input = document.getElementsByTagName("input").value;
console.log(input)

input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submitButton").click();
  }
});