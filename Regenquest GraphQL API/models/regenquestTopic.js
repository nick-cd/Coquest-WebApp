const { Schema, model } = require("mongoose");

const regenquestTopicSchema = new Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = model("regenquestTopic", regenquestTopicSchema);
