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


// connecting mongolab to mongoose
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// including the models
var db = require("./models");
var PORT = 3000;

// start express
var app = express();

// configure middleware

// morgan is a logger that will log requests you make
app.use(logger("dev")); // figure out what 'dev' means
// gonna start parsing things as JSON
app.use(express.urlencoded({extended : true}));
app.use(express.json());

// make public a static folder

app.use(express.static("public"));

// starting the connection to the db
// this automatically makes a db in robo3t!!! so be careful
mongoose.connect("mongodb://localhost/nytScraper", {useNewUrlParser: true });

// ROUTES WOULD GO HERE BUT I THINK THEYT GO IN THE CONTROLLERS

// start the server
app.listen(PORT, function(){
    console.log("app listening on port " + PORT + "!");
});