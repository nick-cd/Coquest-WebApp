const { model, Schema } = require("mongoose");

//itemIDL unique id of the item
//userID: id of the current user that owns this item
//taskLink: id of the task this item belongs to
//itemName: name of the item
//createdAt: date and time of createion of the item
//description: description of the item
//image: link to the image of the item
//history: list of userID that owned this item previously
const regenquestInventorySchema = new Schema({
  userID: String,
  taskLink: String,
  itemName: String,
  createdAt: String,
  description: String,
  image: String,
  history: [String],
});

module.exports = model("regenquestInventory", regenquestInventorySchema);
