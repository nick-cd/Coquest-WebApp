const User = require('../models/regenquestUser');
const Task = require('../models/regenquestTask');
const Quest = require('../models/regenquestQuest');
const Post = require('../models/regenquestPost');
const Inventory = require('../models/regenquestInventory');
const Event = require('../models/regenquestEvent');
const Community = require('../models/regenquestCommunity');
const Genres = require('../models/regenquestGenres');
const LoggedIn = require('../models/regenquestLoggedInUsers');
const Notification = require('../models/regenquestNotification');
const Chat = require('../models/regenquestChat');
const Message = require('../models/regenquestMessage');
const CrossPlatformUser = require('../models/crossPlatform/User');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { Types: { ObjectId }} = require('mongoose');
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage();

// Convert a list of expandable type schemas, `expandable`, into a list of ID strings.
// If the object is expandable, function expects the property named `propName` to be present for use as the ID.
function coerceExpandable(expandable, propName) {
  return expandable?.map((e) => {
    if(e.type === "EXPANDED_OBJ") {
      return e.objValue[propName];
    } else if(e.type === "ID_STRING") {
      return e.strValue;
    } else {
      // *Shouldn't happen*
      return null;
    }
  }) ?? null;
}

// Introspects the type of an expandable instance and sniffs out the type of the object `expandableObj`.
// Returns one of the valid expandable member types: string or `expandedTypeName`
function deduceExpandableType(expandableObj, expandedTypeName) {
  if ('value' in expandableObj) {
    return 'string';
  } else if ('id' in expandableObj) {
    return expandedTypeName;
  } else {
    // *Shouldn't happen*
    return null;
  }
}

// Convert expandable array elements to shape that GraphQL expects based on the output type definition in `typeDefs.js`.
function toOutputFormat(arr) {
  return arr.map((elem) => {
    if(elem instanceof ObjectId) {
      return { value: elem.toString() };
    } else if(typeof elem === 'object') {
      return elem;
    } else {
      // *Shouldn't happen*
      return { value: '' };
    }
  });
}

module.exports = {
  registered: {
    // https://stackoverflow.com/a/62185990
    __resolveType(obj) {
      if ('boolValue' in obj) {
        return 'bool'; // Return the type name as a string
      } else if ('numValue' in obj) {
        return 'int';
      }
      return null; // Handle cases where the type cannot be determined
    },
  },
  expandableUser: {
    __resolveType(obj) {
      return deduceExpandableType(obj, 'regenquestUser');
    }
  },
  expandableCommunity: {
    __resolveType(obj) {
      return deduceExpandableType(obj, 'regenquestCommunity');
    }
  },
  Query: {
    //this method returns all the regenquest users
    async getUsers() {
      try {
        const result = await User.find();
        return result;
      } catch (err) {
        throw new Error('Error getting users');
      }
    },

    //this method returns all the regenquest tasks
    async getTasks() {
      try {
        const result = await Task.find();
        return result;
      } catch (err) {
        throw new Error('Error getting tasks');
      }
    },

    //this method returns all the regenquest quests
    async getQuests() {
      try {
        const result = await Quest.find();
        return result;
      } catch (err) {
        throw new Error('Error getting quests');
      }
    },

    //this method returns all the regenquest posts
    async getPosts() {
      try {
        const result = await Post.find();
        return result;
      } catch (err) {
        throw new Error('Error getting posts');
      }
    },

    //this method returns all the regenquest items
    async getItems() {
      try {
        const result = await Inventory.find();
        return result;
      } catch (err) {
        throw new Error('Error getting items');
      }
    },

    //this method returns all the regenquest events
    async getEvents() {
      try {
        const result = await Event.find();
        return result;
      } catch (err) {
        throw new Error('Error getting events');
      }
    },

    //this method returns all the regenquest communites
    async getCommunities() {
      try {
        const result = await Community.find();
        return result;
      } catch (err) {
        throw new Error('Error getting communities');
      }
    },

    //this method finds a user by their id
    async findUserbyID(parent, { id }, context, info) {
      try {
        const result = await User.findOne({ _id: id });

        if(typeof result.registered === 'boolean') {
          result.registered = {
            boolValue: result.registered
          };
        } else if(typeof result.registered === 'number') {
          result.registered = {
            numValue: result.registered
          };
        } else {
          /* Shouldn't happen */
          result.registered = { boolValue: false };
        }

        let user = result.toObject();
        user.communities = toOutputFormat(user.communities);

        return user;
      } catch (err) {
        throw new Error('Error finding user by ID');
      }
    },

    //this method finds a task by its id
    async findTaskbyID(parent, { taskID }, context, info) {
      try {
        result = await Task.findOne({ taskID: taskID });
        return result;
      } catch (err) {
        throw new Error('Error finding task by id');
      }
    },

    //this method finds a quest by its id
    async findQuestbyID(parent, { questID }, context, info) {
      try {
        result = await Quest.findOne({ questID: questID });
        return result;
      } catch (err) {
        throw new Error('Error finding quest by id');
      }
    },

    //this method finds a post by its id
    async findPostbyID(parent, { postID }, context, info) {
      try {
        result = await Post.findOne({ postID: postID });
        return result;
      } catch (err) {
        throw new Error('Error finding post by id');
      }
    },

    //this method finds an item by its id
    async findInventoryItembyID(parent, { itemID }, context, info) {
      try {
        result = await Inventory.findOne({ itemID: itemID });
        return result;
      } catch (err) {
        throw new Error('Error finding item by id');
      }
    },

    //this method finds an event by its id
    async findEventbyID(parent, { eventID }, context, info) {
      try {
        result = await Event.findOne({ eventID: eventID });
        return result;
      } catch (err) {
        throw new Error('Error finding event by id');
      }
    },

    //this method finds a community by its id
    async findCommunitybyID(parent, { id }, context, info) {
      try {
        const result = await Community.findOne({ _id: id });

        let community = result.toObject();
        community.members = toOutputFormat(community.members);

        return community;
      } catch (err) {
        throw new Error('Error finding community by id');
      }
    },

    //this method find all the chats a user is in by the chat id
    async getChatsByUserID(parent, { userID }, context, info) {
      //check if userID was provided as a parameter
      if (!userID) {
        throw new Error('Must provide userID');
      }

      //check if the user exists
      if (!(await User.exists({ userID: userID }))) {
        throw new Error('User not Found.');
      }

      //get the chats from the db
      try {
        const result = await Chat.find({ members: { $in: [userID] } });
        return result;
      } catch (err) {
        throw new Error('Error finding chats by user id');
      }
    },

    //this method find all messages belonging to a chat by using the chatID
    async getMessagesByChatID(parent, { chatID }, context, info) {
      //check if chatID was provided
      if (!chatID) {
        throw new Error('Must provide chatID.');
      }

      //check if that chat exists in the db
      if (!(await Chat.exists({ chatID: chatID }))) {
        throw new Error('Chat not Found.');
      }

      //get all the messages belonging to that chat
      try {
        const result = await Message.find({ chatID: chatID });
        return result;
      } catch (err) {
        throw new Error('Error finding messages by chat id');
      }
    },

    //this method return a list of all the genres in the db
    async getGenres(parent, {}, context, info) {
      try {
        result = await Genres.findOne();
        return result;
      } catch (err) {
        throw new Error('Error getting genres');
      }
    },

    //this method is used to login a regenquest user
    async loginRegenquestUser(parent, { username, password }, context, info) {
      //check if the user exists
      const user = await User.findOne({ username: username });
      if (!user) {
        throw new Error('user not found');
      }

      //check if password matches
      const result = await bcrypt.compare(password, user.password);

      if (!result) {
        throw new Error('Password does not match');
      }

      //generate a user token and add it to the db
      const newLogin = new LoggedIn({
        userID: user.userID,
      });

      try {
        const res = await newLogin.save();
        return { userID: newLogin.userID};
      } catch (err) {
        throw new Error('Error logging in');
      }
    },

    //this method gets all the notification for a user by thier id
    async getNotifications(parent, { userID }, context, info) {
      //check if userID is provided
      if (!userID) {
        throw new Error('Please provide a userID');
      }

      //get all the notifications from the db
      try {
        const res = await Notification.find({ userID: userID });
        return res;
      } catch (err) {
        throw new Error('Error gettign notifications');
      }
    },

    //this method gets all the unread notifications
    async getUnreadNotifications(parent, { userID }, context, info) {
      //check if a userID is provided
      if (!userID) {
        throw new Error('Please provide userID');
      }

      try {
        const res = await Notification.find({ userID: userID, isRead: false });
        return res;
      } catch (err) {
        throw new Error('Error getting unread notifications');
      }
    },

    //this method marks a notification as read
    async markNotificationAsRead(parent, { notificationID }, context, info) {
      //check if notification id is provided
      if (!notificationID) {
        throw new Error('Please provide notificationID');
      }

      //update the notification document in the db
      try {
        const res = await Notification.updateOne(
          { notificationID: notificationID },
          { isRead: true }
        );
        return { code: 0, response: 'successful' };
      } catch (err) {
        throw new Error('Error marking notification as read');
      }
    },

    //this method marks all notificcation as read for a user
    async markAllNotificationsAsRead(parent, { userID }, context, info) {
      //check if userID is provided
      if (!userID) {
        throw new Error('Please provide userID');
      }

      //update all the notification for the user in the db
      try {
        const res = await Notification.updateMany(
          { userID: userID },
          { isRead: true }
        );
        return { code: 0, response: 'successful' };
      } catch (err) {
        throw new Error('Error marking all notification as read');
      }
    },

    //this method deletes a notification by its id
    async deleteNotification(parent, { notificationID }, context, info) {
      //check if notification id is provided
      if (!notificationID) {
        throw new Error('Please provide notificationID');
      }

      //remove the notification from the db
      try {
        const res = await Notification.remove({
          notificationID: notificationID,
        });
        return { code: 0, response: 'successful' };
      } catch (err) {
        throw new Error('Error deleting notification');
      }
    },

    async generatePresignedURL() {
      const EXPIRES_IN_MINS  = 15;
      // Option object to be passed to the 'getSignedUrl()' method
      const options = {
        version: 'v4',
	      action: 'write',
	      expires: Date.now() + EXPIRES_IN_MINS * 60 * 1000,
        // Enforce an image mime type
	      conditions: [
	        ['starts-with', '$content-type', 'image/'],
        ],
      }
      try {
        const uniqueFileName = `${uuid.v4()}`;
        const [url] = await storage
	        .bucket(process.env.IMAGE_BUCKET_NAME)
          .file(`${process.env.DIR_PATH}/${uniqueFileName}`)
          .getSignedUrl(options);

        return url;
      } catch (err) {
        console.error('Error generating signed URL:', err);
        throw new Error(`Error generating signed URL: ${err}`);
      }
    }
  },
  Mutation: {
    //this method is the resolver for createRegenquestUser,
    //it creates and adds the user to the db
    async createRegenquestUser(
      parent,
      {
        userInput: {
          name,
          username,
          email,
          location,
          images,
          motives,
          biography,
          topics,
          communities,
          skills,
          badges,
          currentLevel,
          recommendations,
        },
      },
      context,
      info
    ) {

      //create a User object
      const newUser = new User({
        userID: null,
        name: name,
        username: username,
        email: email,
        registered: false,
        location: location ? location : null,
        images: images ? images : null,
        motives: motives ? motives : null,
        biography: biography ? biography : null,
        topics: topics ? topics : null,
        // Map given community list to a list of IDs, if not already
        communities: coerceExpandable(communities, 'id'),
        skills: skills ? skills : null,
        badges: badges ? badges : null,
        currentLevel: currentLevel ? currentLevel : -1,
        recommendations: recommendations ? recommendations : null,
      });

      //add the user to the db
      try {
        await newUser.save({ validateBeforeSave: false });
        // CrossPlatformUser manages the 3 web app users (lotuslearning, regenquest, spotstitch)
        // If the CrossPlatformUser has not been created with other platform, create a new one
        const crossPlatformUserExists = await CrossPlatformUser.findOne({
          email: newUser.email
        }).exec();

        if (crossPlatformUserExists) {
          newUser.userID = crossPlatformUserExists._id;
          crossPlatformUserExists.regenquestUserId = newUser._id;
          await crossPlatformUserExists.save();
        } else {
          /*
          Shouldn't occur because the registration logic always creates this document per user
          */
          const newCrossPlatformUser = new CrossPlatformUser({
            email: newUser.email,
            phoneNumber: '1234567890', // dummy phone number
            regenquestUserId: newUser._id,
          });
          await newCrossPlatformUser.save();
        }

        await newUser.save();

        return { code: 0, response: 'successful' };
      } catch (err) {
        console.log(err);
        return { code: 1, response: 'Error creating user.' };
      }
    },

    //resolver for createRegenquestTask,
    //this method creates and add a task to the db
    async createRegenquestTask(
      parent,
      {
        userInput: {
          taskID,
          userID,
          questID,
          name,
          description,
          requirements,
          completionStatus,
          history,
        },
      },
      context,
      info
    ) {

      //TODO: check Auth token
      
      //create a new task object
      const newTask = new Task({
        taskID: taskID ? taskID : null,
        userID: userID ? userID : null,
        questID: questID ? questID : null,
        createdAt: new Date().toLocaleString(),
        name: name ? name : null,
        description: description ? description : null,
        requirements: requirements ? requirements : null,
        completionStatus: completionStatus ? completionStatus : false,
        history: history ? history : null,
      });

      //add the task to the db
      try {
        const res = await newTask.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error creating task.' };
      }
    },

    //resolver for createRegenquestQuest,
    //this method creates and add a quest to the db
    async createRegenquestQuest(
      parent,
      {
        userInput: {
          questID,
          name,
          description,
          objective,
          initiative,
          type,
          duration,
          location,
          startDate,
          endDate,
          requirements,
          members,
          history,
          budget,
          tasks,
          hashtags,
        },
      },
      context,
      info
    ) {

      //TODO: check Auth token

      //create a new Quest object
      const newQuest = new Quest({
        questID: questID ? questID : null,
        name: name ? name : null,
        description: description ? description : null,
        objective: objective ? objective : null,
        initiative: initiative ? initiative : null,
        type: type ? type : null,
        duration: duration ? duration : null,
        location: location ? location : null,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
        requirements: requirements ? requirements : null,
        members: members ? members : null,
        history: history ? history : null,
        budget: budget ? budget : null,
        tasks: tasks ? tasks : null,
        hashtags: hashtags ? hashtags : null,
      });

      //add the quest to the db
      try {
        const res = await newQuest.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error creating quest.' };
      }
    },

    //resolver for createRegenquestPost,
    //this method creates and add a post to the db
    async createRegenquestPost(
      parent,
      {
        userInput: {
          postID,
          userID,
          title,
          description,
          attachments,
          comments,
        },
      },
      context,
      info
    ) {
      //TODO: check Auth token

      //create a new Post object
      const newPost = new Post({
        postID: postID ? postID : null,
        userID: userID ? userID : null,
        title: title ? title : null,
        description: description ? description : null,
        likes: 0,
        attachments: attachments ? attachments : null,
        createdAt: new Date().toLocaleString(),
        comments: comments ? comments : null,
      });

      //add the post to the db
      try {
        const res = await newPost.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error creating post.' };
      }
    },

    //resolver for createRegenquestInventory,
    //this method creates and add an inventory item to the db
    async createRegenquestInventory(
      parent,
      {
        userInput: {
          itemID,
          userID,
          taskLink,
          itemName,
          description,
          image,
          history,
        },
      },
      context,
      info
    ) {
      //TODO: check Auth token

      //create a new Inventory item object
      const newInventory = new Inventory({
        itemID: itemID ? itemID : null,
        userID: userID ? userID : null,
        taskLink: taskLink ? taskLink : null,
        itemName: itemName ? itemName : null,
        createdAt: new Date().toLocaleString(),
        description: description ? description : null,
        image: image ? image : null,
        history: history ? history : null,
      });

      //add the item to the db
      try {
        const res = await newInventory.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error creating item.' };
      }
    },

    //resolver for createRegenquestEvent,
    //this method created and add an event to the db
    async createRegenquestEvent(
      parent,
      {
        userInput: {
          eventID,
          name,
          theme,
          location,
          time,
          description,
          layer,
          hashtags,
        },
      },
      context,
      info
    ) {
      //TODO: check Auth token

      //create a new event object
      const newEvent = new Event({
        eventID: eventID ? eventID : null,
        name: name ? name : null,
        theme: theme ? theme : null,
        location: location ? location : null,
        time: time ? time : null,
        description: description ? description : null,
        layer: layer ? layer : null,
        hashtags: hashtags ? hashtags : null,
      });

      //add the event to the db
      try {
        const res = await newEvent.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error creating Event.' };
      }
    },

    //resolver for createRegenquestCommunity,
    //this method creates and add a community to the db
    async createRegenquestCommunity(
      parent,
      {
        userInput: {
          name,
          description,
          members,
          tags,
          location,
          images,
        },
      },
      context,
      info
    ) {
      // TODO: check if session token in Auth header is valid

      //create a new community object
      const newCommunity = new Community({
        name: name,
        description: description,
        // Map given members list to a list of IDs, if not already
        members: coerceExpandable(members, 'id'),
        tags: tags ? tags : null,
        location: location,
        images: images ? images : null,
      });

      //add the community to the db
      try {
        const res = await newCommunity.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        console.log(err);
        return { code: 1, response: 'Error creating community.' };
      }
    },

    //resolver for createRegenquestNotification,
    //this method creates and stores a notification to the db
    async createRegenquestNotification(
      parent,
      {
        userInput: {
          userID,
          notificationID,
          title,
          content,
          image,
          link,
          isRead,
          isDeleted,
          myname,
        },
      },
      context,
      info
    ) {
      //check if the userID is provided
      if (!userID) {
        return { code: 1, response: 'Error! must provide userID' };
      }

      //check if the notificationID is provided
      if (!notificationID) {
        return { code: 1, response: 'Error! must provide notificationID' };
      }

      //create a new notificaiton object
      const newNotification = new Notification({
        userID: userID,
        notificationID: notificationID,
        title: title ? title : null,
        content: content ? content : null,
        image: image ? image : null,
        link: link ? link : null,
        date: new Date().toLocaleString(),
        isRead: isRead === undefined ? null : isRead,
        isDeleted: isDeleted === undefined ? null : isDeleted,
      });

      //try to save the notification to the db
      try {
        const res = await newNotification.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error creating notification.' };
      }
    },

    //resolver for createRegenqestChat,
    //this method creates and add a chat to the db
    async createRegenquestChat(
      parent,
      { userInput: { chatID, members, name, description } },
      context,
      info
    ) {
      //check if chatid is provided
      if (!chatID) {
        return { code: 1, response: 'Error! must provide chatID' };
      }
      //check if member list is provided
      if (!members) {
        return { code: 1, response: 'Error! must provide list of members' };
      }

      //create a new chat object
      const newChat = new Chat({
        chatID: chatID,
        members: members,
        name: name ? name : null,
        description: description ? description : null,
        createdAt: new Date().toLocaleString(),
      });

      //try adding the chat to the db
      try {
        const res = await newChat.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error creating chat.' };
      }
    },

    //resolver for sendRegenquestMessage,
    //this method creates and stores messages to the db
    async sendRegenquestMessage(
      parent,
      { userInput: { messageID, chatID, sentFrom, message } },
      context,
      info
    ) {
      //check if message id is provided
      if (!messageID) {
        return { code: 1, response: 'Error! must provide messageID' };
      }
      //check is chat id is provided
      if (!chatID) {
        return { code: 1, response: 'Error! must provide chatID' };
      }
      //check if sentFrom is provided
      if (!sentFrom) {
        return { code: 1, response: 'Error! must provide sentFrom' };
      }
      //check if message is provided
      if (!message) {
        return { code: 1, response: 'Error! must provide message' };
      }

      //check if the chat exists
      if (!(await Chat.exists({ chatID: chatID }))) {
        return { code: 1, response: 'Error! chat not found' };
      }

      //get all the members from the chat
      const memberList = await Chat.findOne({ chatID: chatID });

      //create a new message object
      const newMessage = new Message({
        messageID: messageID,
        chatID: chatID,
        sentFrom: sentFrom,
        message: message,
        time: new Date().toLocaleString(),
        unreadBy: memberList.members.remove(sentFrom),
      });

      //add the message to the db
      try {
        const res = await newMessage.save();
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error creating message.' };
      }
    },

    //resolver for addMemberToChat,
    //this method add a member to a chat
    async addMemberToChat(
      parent,
      { userInput: { chatID, userID } },
      context,
      info
    ) {
      //check if chatID is provided
      if (!chatID) {
        return { code: 1, response: 'Error! must provide chatID' };
      }
      //check if userID is provided
      if (!userID) {
        return { code: 1, response: 'Error! must provide userID' };
      }

      //check if the chat exists
      if (!(await Chat.exists({ chatID: chatID }))) {
        return { code: 1, response: 'Error! chat does not exist' };
      }

      //check if the user exists
      if (!(await User.exists({ userID: userID }))) {
        return { code: 1, response: 'Error! must provide user does not exist' };
      }

      //update the member list of the chat
      try {
        const res = await Chat.updateOne(
          { chatID: chatID },
          { $push: { members: userID } }
        );
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error adding member to chat.' };
      }
    },

    //resolver for markMessageAsRead,
    //this method marks a message as read for a given user
    async markMessageAsRead(
      parent,
      { userInput: { messageID, userID } },
      context,
      info
    ) {
      //check if message id was provided
      if (!messageID) {
        return { code: 1, response: 'Error! must provide messageID' };
      }
      //check if user id was provided
      if (!userID) {
        return { code: 1, response: 'Error! must provide userID' };
      }
      //check if the message exists
      if (!(await Message.exists({ messageID: messageID }))) {
        return { code: 1, response: 'Error! message does not exist' };
      }

      //mark the message as read for the given user
      try {
        const res = await Message.updateOne(
          { messageID: messageID },
          { $pull: { unreadBy: userID } }
        );
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error marking message as read.' };
      }
    },

    //this method updates propeties for a user
    async updateRegenquestUser(
      parent,
      {
        userInput: {
          id,
          name,
          username,
          email,
          registered,
          location,
          images,
          motives,
          biography,
          topics,
          communities,
          skills,
          badges,
          currentLevel,
          recommendations,
        },
      },
      context,
      info
    ) {
      // TODO: check if session token in Auth header is valid

      //check if user id is provided
      if (!id) {
        return { code: 1, response: 'Error! must provide userID' };
      }

      //check is user is valid
      if (!(await User.exists({ _id: id }))) {
        return { code: 1, response: 'Error! user not found' };
      }

      //create an update user object
      const updateUser = { _id: id };

      //update all the properties that were provided
      if (motives) {
        updateUser.motives = motives;
      }
      if (name) {
        updateUser.name = name;
      }
      if (username) {
        updateUser.username = username;
      }
      if (email) {
        updateUser.email = email;
      }
      if (registered) {
        if(registered.type === "BOOLEAN") {
          updateUser.registered = registered.boolValue;
        } else if(registered.type === "NUMBER") {
          updateUser.registered = registered.numValue;
        } else {
          registered.registered = null;
        }
      }
      if (location) {
        updateUser.location = location;
      }
      if (images) {
        updateUser.images = images;
      }
      if (biography) {
        updateUser.biography = biography;
      }
      if (topics) {
        updateUser.topics = topics;
      }
      if (communities) {
        updateUser.communities = coerceExpandable(communities, 'id');
      }
      if (skills) {
        updateUser.skills = skills;
      }
      if (badges) {
        updateUser.badges = badges;
      }
      if (currentLevel) {
        updateUser.currentLevel = currentLevel;
      }
      if (recommendations) {
        updateUser.recommendations = recommendations;
      }

      try {
        const res = await User.updateOne(
          { _id: id },
          updateUser,
          {runValidators: true}
        );
        return { code: 0, response: 'successful' };
      } catch (err) {
        console.log(err);
        return { code: 1, response: 'Error updating user.' };
      }
    },

    //this method updates all the properties of a task
    async updateRegenquestTask(
      parent,
      {
        userInput: {
          taskID,
          userID,
          questID,
          name,
          description,
          requirements,
          completionStatus,
          history,
        },
      },
      context,
      info
    ) {

      //TODO: check Auth token

      //check if task id is provided
      if (!taskID) {
        return { code: 1, response: 'Error! must provide taskID' };
      }

      //check if task exists
      if (!(await Task.exists({ taskID: taskID }))) {
        return { code: 1, response: 'Error! task not found' };
      }

      const updateTask = { taskID: taskID };

      //update all the given properties
      if (userID) {
        updateTask.userID = userID;
      }
      if (questID) {
        updateTask.questID = questID;
      }
      if (name) {
        updateTask.name = name;
      }
      if (description) {
        updateTask.description = description;
      }
      if (requirements) {
        updateTask.requirements = requirements;
      }
      if (completionStatus !== undefined) {
        updateTask.completionStatus = completionStatus;
      }
      if (history) {
        updateTask.history = history;
      }

      try {
        const res = await Task.updateOne({ taskID: taskID }, updateTask);
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error updating task.' };
      }
    },

    //this method updates all the properties of a quest
    async updateRegenquestQuest(
      parent,
      {
        userInput: {
          questID,
          name,
          description,
          objective,
          initiative,
          type,
          duration,
          location,
          startDate,
          endDate,
          requirements,
          members,
          history,
          budget,
          tasks,
          hashtags,
        },
      },
      context,
      info
    ) {
      //TODO: check Auth token

      //check is quest id is provided
      if (!questID) {
        return { code: 1, response: 'Error! must provide questID' };
      }

      //check is quest id is valid
      if (!(await Quest.exists({ questID: questID }))) {
        return { code: 1, response: 'Error! quest not found' };
      }

      const updateQuest = { questID: questID };

      //update all the given properties of the quest
      if (name) {
        updateQuest.name = name;
      }
      if (description) {
        updateQuest.description = description;
      }
      if (objective) {
        updateQuest.objective = objective;
      }
      if (initiative) {
        updateQuest.initiative = initiative;
      }
      if (type) {
        updateQuest.type = type;
      }
      if (duration) {
        updateQuest.duration = duration;
      }
      if (location) {
        updateQuest.location = location;
      }
      if (startDate) {
        updateQuest.startDate = startDate;
      }
      if (endDate) {
        updateQuest.endDate = endDate;
      }
      if (requirements) {
        updateQuest.requirements = requirements;
      }
      if (members) {
        updateQuest.members = members;
      }
      if (history) {
        updateQuest.history = history;
      }
      if (budget) {
        updateQuest.budget = budget;
      }
      if (tasks) {
        updateQuest.tasks = tasks;
      }
      if (hashtags) {
        updateQuest.hashtags = hashtags;
      }

      try {
        const res = await Quest.updateOne({ questID: questID }, updateQuest);
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error updating quest.' };
      }
    },

    //this method updates all the properties of a post
    async updateRegenquestPost(
      parent,
      {
        userInput: {
          postID,
          userID,
          title,
          description,
          attachments,
          comments,
        },
      },
      context,
      info
    ) {
      //TODO: check Auth token

      //check if post id is provided
      if (!postID) {
        return { code: 1, response: 'Error! must provide postID' };
      }

      //check if its a valid post
      if (!(await Post.exists({ postID: postID }))) {
        return { code: 1, response: 'Error! post not found' };
      }

      const updatePost = { postID: postID };

      //update all the given properties of the post
      if (userId) {
        updatePost.userID = userID;
      }
      if (title) {
        updatePost.title = title;
      }
      if (description) {
        updatePost.description = description;
      }
      if (attachments) {
        updatePost.attachments = attachments;
      }
      if (comments) {
        updatePost.comments = comments;
      }

      try {
        const res = await Post.updateOne({ postID: postID }, updatePost);
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error updating post.' };
      }
    },

    //this methods updates all the propeties of an inventory item
    async updateRegenquestInventory(
      parent,
      {
        userInput: {
          itemID,
          userID,
          taskLink,
          itemName,
          description,
          image,
          history,
        },
      },
      context,
      info
    ) {
      //TODO: check Auth token

      //check if item id is provided
      if (!itemID) {
        return { code: 1, response: 'Error! must provide itemID' };
      }
      //check if item is valid
      if (!(await Inventory.exists({ itemID: itemID }))) {
        return { code: 1, response: 'Error! item not found' };
      }

      const updateItem = { itemID: itemID };
      //update all the given properties of the item
      if (userID) {
        updateItem.userID = userID;
      }
      if (taskLink) {
        updateItem.taskLink = taskLink;
      }
      if (itemName) {
        updateItem.itemName = itemName;
      }
      if (description) {
        updateItem.description = description;
      }
      if (image) {
        updateItem.image = image;
      }
      if (history) {
        updateItem.history = history;
      }

      try {
        const res = await Inventory.updateOne({ itemID: itemID }, updateItem);
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error updating inventory.' };
      }
    },

    //this method updates all the properties of an event
    async updateRegenquestEvent(
      parent,
      {
        userInput: {
          eventID,
          name,
          theme,
          location,
          time,
          description,
          layer,
          hashtags,
        },
      },
      context,
      info
    ) {
      //TODO: check Auth token

      //check if event id is provided
      if (!eventID) {
        return { code: 1, response: 'Error! must provide eventID' };
      }

      //check if its a valid event
      if (!(await Event.exists({ eventID: eventID }))) {
        return { code: 1, response: 'Error! event not found' };
      }

      const updateEvent = { eventID: eventID };
      //update all the given properties of the event
      if (name) {
        updateEvent.name = name;
      }
      if (theme) {
        updateEvent.theme = theme;
      }
      if (location) {
        updateEvent.location = location;
      }
      if (time) {
        updateEvent.time = time;
      }
      if (description) {
        updateEvent.description = description;
      }
      if (layer) {
        updateEvent.layer = layer;
      }
      if (hashtags) {
        updateEvent.hashtags = hashtags;
      }

      try {
        const res = await Event.updateOne({ eventID: eventID }, updateEvent);
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error updating event.' };
      }
    },

    //this method updates all the properties of a community
    async updateRegenquestCommunity(
      parent,
      {
        userInput: {
          id,
          name,
          description,
          members,
          tags,
          location,
          image,
        },
      },
      context,
      info
    ) {
      // TODO: check if session token in Auth header is valid

      //check if community id is provided
      if (!id) {
        return { code: 1, response: 'Error! must provide id' };
      }

      //check if community id is valid
      if (!(await Community.exists({ _id: id }))) {
        return { code: 1, response: 'Error! community not found' };
      }

      const updateCommunity = { id: id };
      //update all the given properties of the community
      if (name) {
        updateCommunity.name = name;
      }
      if (description) {
        updateCommunity.description = description;
      }
      if (members) {
        updateCommunity.members = coerceExpandable(members, 'id');
      }
      if(tags) {
        updateCommunity.tags = tags;
      }
      if (location) {
        updateCommunity.location = location;
      }
      if (image) {
        updateCommunity.images = images;
      }

      try {
        const res = await Community.updateOne(
          { _id: id },
          updateCommunity,
          { runValidators: true }
        );
        return { code: 0, response: 'successful' };
      } catch (err) {
        console.log(err);
        return { code: 1, response: 'Error updating community.' };
      }
    },

    //the method updates the list genres
    async updateRegenquestGenres(
      parent,
      { userInput: { genre } },
      context,
      info
    ) {
      //check if list of genres is provided
      if (!genre) {
        return { code: 1, response: 'Error! must provide genre list' };
      }

      try {
        const result = await Genres.count();

        if (result === 0) {
          const newGenres = new Genres({ genre: genre });
          const res = await newGenres.save();
        } else {
          const updateGenres = { genre: genre };
          const res = await Genres.updateMany(updateGenres);
        }

        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error updating genres.' };
      }
    },

    //this method updates all the properties of a notification
    async updateRegenquestNotification(
      parent,
      {
        userInput: {
          userID,
          notificationID,
          title,
          content,
          image,
          link,
          isRead,
          isDeleted,
        },
      },
      context,
      info
    ) {
      //check if notification id is provided
      if (!notificationID) {
        return { code: 1, response: 'Error! must provide notificationID' };
      }

      //check if notification id is valid
      if (!(await Notification.exists({ notificationID: notificationID }))) {
        return { code: 1, response: 'Error! notification not found' };
      }

      const updateNotification = {
        notificationID: notificationID,
      };
      //update all the given properties of the notification
      if (userID) {
        updateNotification.userID = userID;
      }
      if (title) {
        updateNotification.title = title;
      }
      if (content) {
        updateNotification.content = content;
      }
      if (image) {
        updateNotification.image = image;
      }
      if (link) {
        updateNotification.link = link;
      }
      if (isRead !== undefined) {
        updateNotification.isRead = isRead;
      }
      if (isDeleted !== undefined) {
        updateNotification.isDeleted = isDeleted;
      }

      try {
        const res = await Notification.updateOne(
          { notificationID: notificationID },
          updateNotification
        );
        return { code: 0, response: 'successful' };
      } catch (err) {
        return { code: 1, response: 'Error updating notification.' };
      }
    },
  },
};
