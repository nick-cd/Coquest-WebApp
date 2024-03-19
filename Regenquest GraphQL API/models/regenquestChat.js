const { model, Schema } = require("mongoose");

//chatID: unique id of the chat
//members: user ids of all the members
//name: name of the chat
//description: description of the chat
//createdAt: time the chat was created
const regenquestChatSchema = new Schema({
  members: [String],
  name: String,
  description: String,
  createdAt: String,
});

module.exports = model("regenquestChat", regenquestChatSchema);
