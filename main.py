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
  
    # get HTTP request body & use user name for something
    # call your twitter scripts here  

    print("username: ", request.args.get('username'))
    
    print("selection: ", request.args.get('selection'))

  
    def userTweet(arg):

      # API keys 
      access_key = 'MdLc2PWvaUh4ZCQn0DJESoe4n'
      access_token = 'M7PqFUKvpV2MtnvvLRpo0mvg5ZDQgaa5JlavUxy5YgFlDONEeL'
      secret_key = '1309966965663035392-4YY7ERbSPWTFyPoAHwCQr0K7c0FtYC'
      secret_token = 'RPBhXHjoumebhiURAQ7D5HZtq2EaBFwHsoZKQxn7bBiXo'

      auth = tweepy.OAuthHandler(access_key, access_token)
      auth.set_access_token(secret_key, secret_token)

      api = tweepy.API(auth)

      # user timeline  method consumes a user name and returns the last 200 status objects  
      tweetList = api.user_timeline(screen_name=arg , count = 200 ,tweet_mode="extended")
      actualTextList = []

      for x in tweetList:

        tempDict = {}

       
        text = x.full_text
        
        date = x.created_at
        username = x.author.screen_name
        favorites = x.favorite_count
        retweets = x.retweet_count
    

        tempDict['tweet'] = text
        
        # Retweets Require the usage of retweeded_status to retreive the full text
        if(text[0:2]) == "RT":
          tempDict['tweet'] = x.retweeted_status.full_text


        tempDict['date'] = date
        tempDict['username'] = username
        tempDict['favorites'] = favorites
        tempDict['retweets'] = retweets
      

        actualTextList.append(tempDict)

      # return list of dict 
      
      return actualTextList
      
    def byHashTag(hashtag):


      # API keys 
      access_key = 'MdLc2PWvaUh4ZCQn0DJESoe4n'
      access_token = 'M7PqFUKvpV2MtnvvLRpo0mvg5ZDQgaa5JlavUxy5YgFlDONEeL'
      secret_key = '1309966965663035392-4YY7ERbSPWTFyPoAHwCQr0K7c0FtYC'
      secret_token = 'RPBhXHjoumebhiURAQ7D5HZtq2EaBFwHsoZKQxn7bBiXo'

      auth = tweepy.OAuthHandler(access_key, access_token)
      auth.set_access_token(secret_key, secret_token)

      api = tweepy.API(auth)
      
      tempParam = "#" + hashtag

      actualTextList = []

      for tweet in tweepy.Cursor(api.search,q=tempParam, count=200, tweet_mode="extended").items():
          
          tempDict = {}       
          tempDict['tweet'] = tweet.full_text

          if(tempDict['tweet']) == "RT":   
            tempDict['tweet'] = tweet.retweeted_status.full_text


          tempDict['date'] = tweet.created_at
          tempDict['username'] = tweet.author.screen_name
          tempDict['favorites'] = tweet.favorite_count
          tempDict['retweets'] = tweet.retweet_count


          actualTextList.append(tempDict)
          
      return actualTextList



    def byLikedTweets(username):


      # API keys 
      access_key = 'MdLc2PWvaUh4ZCQn0DJESoe4n'
      access_token = 'M7PqFUKvpV2MtnvvLRpo0mvg5ZDQgaa5JlavUxy5YgFlDONEeL'
      secret_key = '1309966965663035392-4YY7ERbSPWTFyPoAHwCQr0K7c0FtYC'
      secret_token = 'RPBhXHjoumebhiURAQ7D5HZtq2EaBFwHsoZKQxn7bBiXo'

      auth = tweepy.OAuthHandler(access_key, access_token)
      auth.set_access_token(secret_key, secret_token)

      api = tweepy.API(auth)
      
      tempParam = "#" + username

      actualTextList = []

      favorites = api.favorites(screen_name='elonmusk', tweet_mode="extended", count = 200) 

      for tweet in favorites:

          tempDict = {}       
          tempDict['tweet'] = tweet.full_text

          if(tempDict['tweet']) == "RT":   
            tempDict['tweet'] = tweet.retweeted_status.full_text
            
          tempDict['date'] = tweet.created_at
          tempDict['username'] = tweet.author.screen_name
          tempDict['favorites'] = tweet.favorite_count
          tempDict['retweets'] = tweet.retweet_count
          
          actualTextList.append(tempDict)
          
      return actualTextList

    username = request.args.get('username')
    selection = request.args.get('selection')
   
    if selection == "username":
      recentTweets = userTweet(username)
      print(recentTweets)
    elif selection == "hashtag":
      recentTweets = byHashTag(username)
      print(recentTweets)
    elif selection == "Liked Tweets By Username":

      recentTweets = byLikedTweets(username)
      print(recentTweets)


    return jsonify(recentTweets)




app.run(host='0.0.0.0', port=8080)
