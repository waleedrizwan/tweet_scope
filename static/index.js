console.log('Print test before async func call');

async function getTwitterUser(username) {
  try {
    var res = await fetch('http://localhost:8080', {
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
    console.log('Issue with line 20 index.js', err)
  }
}


getTwitterUser('scena360');
console.log('after all function callls in index.js');