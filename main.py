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
@app.route('/user', methods=['POST', 'OPTIONS', 'GET'])
def user():
   
    print("User function in main.python has been run ")
    resp = Response("user pivot")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    # get HTTP request body & use user name for something
    # call your twitter scripts here  

    print(request.args.get('username'))
    
    def userTweet(arg):
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

      actualTextList = []

      for x in tweetList:
        # remove any instances of @ and RT 
        text = x.full_text.replace("@", "").replace("RT", "")
        # removes non alphanumeric characters such as emojis
        for elm in text:
            if not(elm.isalnum()) and elm != " ":
                text = text.replace(elm, "")                 
        actualTextList.append(text)
      return actualTextList

    # holds username from site  
    username = request.args.get('username')
    recentTweets = userTweet(username)
       
    return jsonify(recentTweets)


# other routes/API endpoints to add after initial is figured out 

'''
@app.route('/hashtag', methods=['POST', 'OPTIONS', 'GET'])
def hashtag():

   print("Hashtag function in main.python has been run ")
    resp = Response("hashtag pivot")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    # get HTTP request body & use user name for something
    # call your twitter scripts here  

    print(request.args.get('username'))
    
    def userTweet(arg):
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

      actualTextList = []

      for x in tweetList:
        # remove any instances of @ and RT 
        text = x.full_text.replace("@", "").replace("RT", "")
        # removes non alphanumeric characters such as emojis
        for elm in text:
            if not(elm.isalnum()) and elm != " ":
                text = text.replace(elm, "")                 
        actualTextList.append(text)
      return actualTextList

    # holds username 
    username = request.args.get('username')
    recentTweets = userTweet(username)
    
    # resp is what is returned after the API call 

    # todo: return jsonified response
    #print(recentTweets)
  
    return jsonify(recentTweets)

'''

app.run(host='0.0.0.0', port=8080)
