const { Schema, model } = require("mongoose");

// name: name of the motive
const regenquestMotiveSchema = new Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = model("regenquestMotive", regenquestMotiveSchema);
