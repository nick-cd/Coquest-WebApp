const { model, Schema } = require("mongoose");

//questID: unique id of the quest
//name: name of the quest
//description: description of the quest
//objective: objective of the quest
//initiative: initiative of the quest
//type: what type of quest is it? project, program, coop
//duration: how long is it?
//location: location of the quest
//startDate: start date of the quest
//endDate: end date of the quest
//requirements: list of requirements for the quest
//members: list of IDs of the members
//history: history of the quest
//budget: budget for the quest
//tasks: list of Ids of the tasks that belong to this quest
//hashtags: list of hashtags corresponding to the quest
const regenquestQuestSchema = new Schema({
  name: String,
  description: String,
  objective: String,
  initiative: String,
  type: String,
  duration: String,
  location: String,
  startDate: String,
  endDate: String,
  requirements: [String],
  members: [String],
  history: [String],
  budget: Number,
  tasks: [String],
  hashtags: [String],
});

module.exports = model("regenquestQuest", regenquestQuestSchema);
