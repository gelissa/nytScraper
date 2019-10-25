// saving a reference to mongoose
var mongoose = require("mongoose");

// saving mongoose into a schema
var Schema = mongoose.Schema;

// make a new object using the schema constructer that's built (defined?) by mongoose

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    // this note property will allow me to add notes, right now it's "empty"
    note: {
        // I can only assume that this means type: is holding the individual id of the note property
        type: Schema.Types.ObjectId,
        // and this is how I'll signify what the note is since I assume the object id will be changing?
        ref: "Note"
    }
// close the constructor
});

// when i export this model, i'll be referencing the constructor and calling it Article
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;