const { model, Schema } = require("mongoose");

//eventID: unique id of the event
//name: name of the event
//theme: theme of the event
//location: location of the event
//time: time of the event
//description: description of the event
//layer: the layer this event blongs to
//hashtags[]: list of all the hashtags for this event
const regenquestEventSchema = new Schema({
  name: String,
  theme: String,
  location: String,
  time: String,
  description: String,
  layer: String,
  hashtags: [String],
});

module.exports = model("regenquestEvent", regenquestEventSchema);
