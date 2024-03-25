const { Schema, model } = require("mongoose");

// name: name of the topic
const regenquestTopicSchema = new Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = model("regenquestTopic", regenquestTopicSchema);
