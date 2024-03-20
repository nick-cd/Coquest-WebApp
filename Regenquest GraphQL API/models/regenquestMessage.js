const { model, Schema, default: mongoose } = require("mongoose");

//messageID: unique id of the message
//chatID: id of the chat the message belongs to
//sentFrom: id of the user that sent this message
//message: content of the message
//time: time this message was sent
//unreadBy: list of users from chat that have not read the message
const regenquestMessageSchema = new Schema({
  chatID: {
    type: mongoose.ObjectId,
    ref: 'regenquestChat',
    required: true
  },
  sentFrom: {
    type: mongoose.ObjectId,
    ref: 'regenquestUser',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  unreadBy: [{
    type: mongoose.ObjectId,
    ref: 'regenquestUser'
  }],
});

module.exports = model("regenquestMessage", regenquestMessageSchema);
