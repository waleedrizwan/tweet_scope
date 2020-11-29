from flask import Flask, Response, render_template, request, jsonify
import tweepy 


app = Flask(
  __name__, 
  template_folder='templates',
  static_folder='static'  # Name of directory for static files)
)


@app.route('/')
def index():
    return render_template('index.html')

# gets invoked when user makes HTTP post request to <url>/user/
@app.route('/user/', methods=['POST'])
def user():
   
    print("User function in main.py has been run ")
    resp = Response("user pivot")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    # get HTTP request body & use user name for something
    # call your twitter scripts here  
  
    print(request.json)
  
    def userTweet(arg):

      '''
      consumes username as a string returns
      list of last 200 tweets

      '''

      # API keys 
      access_key = 'MdLc2PWvaUh4ZCQn0DJESoe4n'
      access_token = 'M7PqFUKvpV2MtnvvLRpo0mvg5ZDQgaa5JlavUxy5YgFlDONEeL'
      secret_key = '1309966965663035392-4YY7ERbSPWTFyPoAHwCQr0K7c0FtYC'
      secret_token = 'RPBhXHjoumebhiURAQ7D5HZtq2EaBFwHsoZKQxn7bBiXo'

      auth = tweepy.OAuthHandler(access_key, access_token)
      auth.set_access_token(secret_key, secret_token)

      api = tweepy.API(auth)

      # user timeline  method consumes a user name and returns the last 200 tweets 
      tweetList = api.user_timeline(screen_name=arg, tweet_mode="extended", count = 200)

      return tweetList

    # holds username 
    username = request.json['body']['username']

    recentTweets = userTweet(username)

    

    # resp is what is returned after the API call 

    # todo: return jsonified response
    return resp

# other routes/API endpoints
# @app.route('/')


app.run(host='0.0.0.0', port=8080)
