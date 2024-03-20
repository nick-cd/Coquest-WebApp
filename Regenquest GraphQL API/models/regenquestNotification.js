const { model, Schema, default: mongoose } = require("mongoose");
const { imageSchema } = require("./common");

//userID: id of the user that this notification belongs to
//notificationID: unique id of the notification
//title: title of the notification
//content: content of the notification
//image: image link for this notification
//link: link to the notification
//date: when this notification was created
//isRead: has this notification been read?
//isDeleted: has this notification been deleted?
const regenquestNotificationSchema = new Schema({
  userID: {
    type: mongoose.ObjectId,
    ref: 'regenquestUser',
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: imageSchema,
  link: String,
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

module.exports = model("regenquestNotification", regenquestNotificationSchema);
