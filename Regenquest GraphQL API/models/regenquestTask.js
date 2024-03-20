const { model, Schema, default: mongoose } = require("mongoose");

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
  userID: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'regenquestUser'
  },
  questID: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'regenquestQuest'
  },
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  description: String,
  requirements: [String],
  completionStatus: { type: Boolean, default: false },
  history: [String],
});

module.exports = model("regenquestTask", regenquestTaskSchema);
