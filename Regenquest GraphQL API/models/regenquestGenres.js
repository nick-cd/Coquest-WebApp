const { model, Schema } = require("mongoose");

//list of availible genres
const regenquestGenresSchema = new Schema({
  genre: [{
    type: String,
    required: true,
    unique: true
  }],
});

module.exports = model("regenquestGenres", regenquestGenresSchema);
