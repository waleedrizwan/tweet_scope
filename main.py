from flask import Flask, Response, render_template, request, jsonify
import tweepy

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
analyser = SentimentIntensityAnalyzer()

# Uses the vade sentiment intensity analyzer model to predict sentiment in a given string


def sentiment_analyzer_scores(sentence):
    # where sentence is a sentence as a string
    score = analyser.polarity_scores(sentence)
    scoreDict = dict(score)
    return scoreDict


app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static'  # Name of directory for static files)
)

# hide these on the server bro
access_key = 'MdLc2PWvaUh4ZCQn0DJESoe4n'
access_token = 'M7PqFUKvpV2MtnvvLRpo0mvg5ZDQgaa5JlavUxy5YgFlDONEeL'
secret_key = '1309966965663035392-4YY7ERbSPWTFyPoAHwCQr0K7c0FtYC'
secret_token = 'RPBhXHjoumebhiURAQ7D5HZtq2EaBFwHsoZKQxn7bBiXo'


# historic Count of Tweets
totalTweetsScoped = 0


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/faq')
def faq():
    return render_template('faq.html')


@app.route('/update', methods=['POST', 'OPTIONS', 'GET'])
def update():
    return jsonify(str(totalTweetsScoped))

# gets invoked when user makes HTTP post request to <url>/user/


@app.route('/user', methods=['POST', 'OPTIONS', 'GET'])
def user():

    def userTweet(arg):
        print("User tweet func run")
        global totalTweetsScoped
        # requires multiple authorization methods
        auth = tweepy.OAuthHandler(access_key, access_token)
        auth.set_access_token(secret_key, secret_token)
        # Once authorized, API  object can utilize all Tweepy methods
        api = tweepy.API(auth)

        # if no tweets are found the api methods will throw an error
        try:
            # user timeline  method consumes a user name and returns the last 200 status objects
            userTweetList = api.user_timeline(
                screen_name=arg, count=200, tweet_mode="extended")
        except:
            # in the case of no tweets found return an empty array of tweets
            return []

        # Holds list of TweetDict
        tweetList = []

        # a list containing the compound score
        scores = []

        for tweet in userTweetList:

            # For each Tweet, holds date, text, username, favorite count, retweet count
            tweetDict = {}

            # Tweepy Status Object Attributes
            text = tweet.full_text  # full Tweet Text
            date = tweet.created_at  # Date Tweeted
            username = tweet.author.screen_name  # Twitter Handle of author
            favorites = tweet.favorite_count  # number of favorites
            retweets = tweet.retweet_count
            tweetID = tweet.id_str  # a tweet id is used to generate the URL hyperlink
            tweetDict['tweet'] = text

            # Retweets Require the usage of retweeted_status to retreive the full text
            if(text[0:2]) == "RT":
                try:
                    tweetDict['tweet'] = tweet.retweeted_status.full_text
                except:
                    print("Status Object Has No retweeted_status_Property")

            sentimentScore = sentiment_analyzer_scores(text)

            tweetDict['date'] = date
            tweetDict['username'] = username
            tweetDict['favorites'] = favorites
            tweetDict['retweets'] = retweets
            tweetDict['id'] = tweetID
            tweetDict['verified'] = tweet.author.verified
            tweetDict['sentiment'] = sentimentScore
            tweetList.append(tweetDict)

        totalTweetsScoped += len(tweetList)
        return tweetList

    def byHashTag(hashtag):
        global totalTweetsScoped
        auth = tweepy.OAuthHandler(access_key, access_token)
        auth.set_access_token(secret_key, secret_token)

        api = tweepy.API(auth)

        # search parameter must include hashtag
        searchParam = "#" + hashtag

        tweets = tweepy.Cursor(api.search,
                               q=searchParam,
                               lang="en", tweet_mode="extended").items(200)

        tweetList = []

        for tweet in tweets:

            tweetDict = {}
            text = tweet.full_text
            tweetDict['tweet'] = text

            if(tweetDict['tweet'][0:2]) == "RT":
                try:
                    text = tweet.retweeted_status.full_text
                    tweetDict['tweet'] = text
                except:
                    print("Status Object Has No retweeted_status_Property")
            sentimentScore = sentiment_analyzer_scores(text)
            tweetDict['date'] = tweet.created_at
            tweetDict['username'] = tweet.author.screen_name
            tweetDict['favorites'] = tweet.favorite_count
            tweetDict['retweets'] = tweet.retweet_count
            tweetDict['id'] = tweet.id_str
            tweetDict['verified'] = tweet.author.verified
            tweetDict['sentiment'] = sentimentScore
            tweetList.append(tweetDict)
        totalTweetsScoped += len(tweetList)
        return tweetList

    def byLikedTweets(username):
        global totalTweetsScoped
        auth = tweepy.OAuthHandler(access_key, access_token)
        auth.set_access_token(secret_key, secret_token)

        api = tweepy.API(auth)

        tweetList = []

        try:
            favorites = api.favorites(
                screen_name=username, tweet_mode="extended", count=200)
        except:
            return []

        for tweet in favorites:

            tweetDict = {}
            
            text = tweet.full_text
            tweetDict['tweet'] = text
            if(tweetDict['tweet']) == "RT":
                try:
                     text = tweet.retweeted_status.full_text
                     tweetDict['tweet'] =  text   
                except:
                    print("Status Object Has No retweeted_status_Property")
            sentimentScore = sentiment_analyzer_scores(text)
            tweetDict['date'] = tweet.created_at
            tweetDict['username'] = tweet.author.screen_name
            tweetDict['favorites'] = tweet.favorite_count
            tweetDict['retweets'] = tweet.retweet_count
            tweetDict['id'] = tweet.id_str
            tweetDict['verified'] = tweet.author.verified
            tweetDict['sentiment'] = sentimentScore
            tweetList.append(tweetDict)
        totalTweetsScoped += len(tweetList)
        return tweetList

    username = request.args.get('username')
    selection = request.args.get('selection')

    # if user selects tweets by username, call userTweet Function
    if selection == "username":
        recentTweets = userTweet(username)
    # if user selects tweets by hashtag, call byHashTag Function
    elif selection == "hashtag":
        recentTweets = byHashTag(username)
    # if user selects liked tweets by username call byLikedTweets function
    elif selection == "Liked Tweets By Username":
        recentTweets = byLikedTweets(username)
    # Returns jsonified array of dictionaries, containing all Tweet data
    return jsonify(recentTweets)


# hosted on local server
app.run(host='0.0.0.0', port=8080)
