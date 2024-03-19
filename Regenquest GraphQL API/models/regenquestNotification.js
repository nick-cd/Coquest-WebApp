const { model, Schema } = require("mongoose");

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
  userID: String,
  title: String,
  content: String,
  image: String,
  link: String,
  date: String,
  isRead: Boolean,
  isDeleted: Boolean,
});

module.exports = model("regenquestNotification", regenquestNotificationSchema);
