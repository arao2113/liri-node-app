require("dotenv").config();

var keyz = require('./keys');
var fs = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keyz.spotify);
var client = new Twitter(keyz.twitter);

// Node arguments to be passed
var command = process.argv[2];
var search = process.argv.slice(3).join(" ");


// Conditionals to see what command user selects
if (command === "movie-this") {
    movie(search);
}
else if (command === "spotify-this-song") {
    music(search);
}
else if (command === "my-tweets") {
    twitt(search);
}
else if (command === "do-what-it-says") {
    doWhat();
}


// OMDB API Function
function movie(movieSearch) {
    request("http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=39954cd8", function(error, response, body) {
        if(!error && response.statusCode ===200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomato: " + JSON.parse(body).Ratings[0].Source.Value);
            console.log("Country: " +JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

// Spotify API Function
function music(songSearch) {
    spotify.search({type: 'track', query: songSearch, limit: 1}, function(err, data) {
        if(err) {
            console.log('Error occured: ' + err);
        }
        console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name));
        console.log("Song: " + JSON.stringify(data.tracks.items[0].name));
        console.log("Preview URL: " + JSON.stringify(data.tracks.items[0].preview_url));
        console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name));
    });
}

// Twitter API Function
function twitt() {
    var params = {screen_name: 'Ara92849278'};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    var i = 0;
    console.log('\nHere are your last 20 tweets:\n')
    while (i < tweets.length && i <= 20) {
        console.log(tweets[i].text)
        console.log(tweets[i].created_at);
        console.log();
        i++
    }
  } else {
      console.log("There was an error:");
      console.log(error);
  }
});
}

// Do what it says function
function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
            console.log(error);
        }
        console.log(data);
        var dataArr = data.split(",");
        
        music(dataArr[1]);

    });
}


