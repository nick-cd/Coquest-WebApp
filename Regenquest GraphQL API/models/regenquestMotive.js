const { Schema, model } = require("mongoose");

const regenquestMotiveSchema = new Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = model("regenquestMotive", regenquestMotiveSchema);
