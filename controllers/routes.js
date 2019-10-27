// i believe express makes a server for node
var express = require("express");
// idk what morgan does
var logger = require("morgan");
// mongoose builds the Schema/deals w DB
var mongoose = require("mongoose");
// the models
var models = require("../models");

// Initialize Express
var app = express();

// this first route will scrape the nyt
app.get("/scrape", function(req, res){
    axios.get("http://www.nytimes.com/").then(function(response){
        // load it into cheerio
        var $ = cheerio.load(response.data);
        $("article h2").each(function(i, element){
            // empty object instead of array idk why tho
            var result = {};
            // okay, wait so i guess it's dynamically creating the object that we can all from or whatever
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
        
        // making a new object out of the results i scrape
        db.Article.create(result)
            .then(function(dbArticle){
                // view result in console to test
                console.log(dbArticle);
            })
            .catch(function(err){
                // console error
                console.log(err);
            });
        });
        res.send("scrape complete!")
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    db.Article.find({}, (err, docs) => {
      if (err) throw err;
      res.json(docs)
    })
  });

  app.get("/articles/:id", function(req, res) {
    var id = req.params.id
    db.Article.findOne({_id: id})
    .populate("Note")
    .then(function(dbArticle){
      res.json(dbArticle);
    })
    .catch(function(err){
      res.json(err);
    })
  });

  // Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
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

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });

module.exports = app;
