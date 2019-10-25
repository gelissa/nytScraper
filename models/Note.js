// have to require mongoose so i can build by schema
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// start building my schema
var NoteSchema = new Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;