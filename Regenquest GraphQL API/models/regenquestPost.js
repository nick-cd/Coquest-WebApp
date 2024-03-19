const { model, Schema } = require("mongoose");

//postID: unique id of the post
//userID: ID of the user that made the post
//title: the title of the post
//description: the description of the post
//likes: number of likes the post has
//attachments: links to all the files attached to the post such as images
//createdAt: when was the post created
//comments: list of all the comments on the post
const regenquestPostSchema = new Schema({
  userID: String,
  title: String,
  description: String,
  likes: Number,
  attachments: [String],
  createdAt: String,
  comments: [{ username: String, body: String }],
});

module.exports = model("regenquestPost", regenquestPostSchema);
