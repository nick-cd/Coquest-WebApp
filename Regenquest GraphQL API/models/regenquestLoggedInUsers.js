const { model, Schema, default: mongoose } = require("mongoose");

//id of the logged in user
const regenquestLoggedInUsersSchema = new Schema({
  userID: {
    type: mongoose.ObjectId,
    ref: 'regenquestUser', // Reference to the User model
    required: true,
    unique: true
  },
});

module.exports = model(
  "regenquestLoggedInUsers",
  regenquestLoggedInUsersSchema
);
