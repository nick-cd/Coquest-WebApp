const { model, Schema } = require("mongoose");
const { locationSchema } = require("./common");

//eventID: unique id of the event
//name: name of the event
//theme: theme of the event
//location: location of the event
//time: time of the event
//description: description of the event
//layer: the layer this event blongs to
//hashtags[]: list of all the hashtags for this event
const regenquestEventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  theme: String,
  location: locationSchema,
  time: {
    type: Date,
    required: true
  },
  description: String,
  layer: String,
  hashtags: [{
    type: String
  }],
});

module.exports = model("regenquestEvent", regenquestEventSchema);
