const { model, Schema } = require("mongoose");

//taskID: unique id of the task
//userID: Id of the user that this task currently belongs to
//questID: Id of teh quest that this task belongs to
//createdAt: time and date the task was created
//name: name of the task
//description: description of the task
//requirements: list of requirements
//completionStatus: true if task is completed, false if task is not completed
//history: history of the task
const regenquestTaskSchema = new Schema({
  userID: String,
  questID: String,
  createdAt: String,
  name: String,
  description: String,
  requirements: [String],
  completionStatus: Boolean,
  history: [String],
});

module.exports = model("regenquestTask", regenquestTaskSchema);
