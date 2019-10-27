// i believe express makes a server for node
var express = require("express");
// idk what morgan does
var logger = require("morgan");
// mongoose builds the Schema/deals w DB
var mongoose = require("mongoose");

// our scraping tools
// axios is a promised-based http library (apparently similar to ajax). works on client and server
// i assume this will go to the website
var axios = require("axios");
// idk what this does
var cheerio = require("cheerio");

// including the models
var db = require("./models");
var PORT = 3000;

// start express
var app = express();

// configure middleware

// morgan is a logger that will log requests you make
app.use(logger("dev")); // figure out what 'dev' means
// gonna start parsing things as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// make public a static folder

app.use(express.static("public"));

// connecting mongolab to mongoose
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
// starting the connection to the db
// this automatically makes a db in robo3t!!! so be careful
mongoose.connect("mongodb://localhost/nytScraper", {useNewUrlParser: true, useUnifiedTopology: true });

// ROUTES WOULD GO HERE BUT I THINK THEYT GO IN THE CONTROLLERS
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.nytimes.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("h2")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
          
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({}, (err, docs) => {
      if (err) throw err;
      res.json(docs)
    })
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    var id = req.params.id
    db.Article.findOne({_id: id})
    .populate("note")
    .then(function(dbArticle){
      res.json(dbArticle);
    })
    .catch(function(err){
      res.json(err);
    })
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    var id = req.params.id
    db.Note.create(req.body)
      .then(function(dbNotes){
        return db.Article.findOneAndUpdate({_id: id}, {note: dbNotes._id }, {new: true});
      })
      .then(function(dbArticles){
        res.json(dbArticles)
      })
      .catch(function(err){
        res.json(err);
      });
  });

// start the server
app.listen(PORT, function(){
    console.log("app listening on port " + PORT + "!");
});