console.log('hi');

async function getTwitterUser(username) {
  try {
    var res = await fetch('https://localhost:8080', {
      // this will be your heroku domain
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        username,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      // body: { hello: "world" } 
    })
    console.log(res);
  } catch (err) {
    console.log('uh oh', err)
  }
}


getTwitterUser('scena360');
console.log('hi')