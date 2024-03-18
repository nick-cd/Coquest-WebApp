//This file exports a gql object that contains all the
//graphql types and graphql end-points
const { gql } = require("apollo-server-cloud-functions");

/*
Normative Note about Output ID fields:

- should be non-nullable to conform to mongoose's default _id query behaviour;
- should be named _id to match MongoDB
*/
module.exports = gql`
  """
  Type wrappers for union types.
  Use these object types in conjunction with other union member types instead of their fundamental type counterparts.
  """
  type bool {
    boolValue: Boolean!
  }

  type int {
    numValue: Int!
  }

  type string {
    value: String!
  }

  """
  Temporary enums containing hard-coded values in place of an independant collections.

  In the future, we will dynamically fetch available topics and motives.
  """
  enum topic {
    SPORTS
    ARTS
    MUSIC
    GENERATIVE_ART
    BASKETBALL
  }
  
  enum motive {
    VOLUNTEER
    INITIATER
    ORGANIZER
    SPECTATOR
  }

  """
  Discriminator types for unionized types 
  """
  enum registeredRepType {
    BOOLEAN
    NUMBER
  }
  
  enum expandedRepType {
    EXPANDED_OBJ
    ID_STRING
  }

  """"""
  type skill {
    skillName: String
    skillLevel: String
  }

  input skillInput {
    skillName: String
    skillLevel: String
  }

  type badge {
    badgeName: String
    badgeDescription: String
  }

  input badgeInput {
    badgeName: String
    badgeDescription: String
  }

  type recommendations {
    name: String
    comment: String
  }

  input recommendationsInput {
    name: String
    comment: String
  }

  type location {
    lat: Float
    lng: Float
  }

  input locationInput {
    lat: Float
    lng: Float
  }

  type comment {
    username: String
    body: String
  }

  input commentInput {
    username: String
    body: String
  }
  
  type image {
    contentType: String
    path: String
  }

  input imageInput {
    contentType: String
    path: String
  }

  input registeredInput {
    type: registeredRepType!
    boolValue: Boolean
    numValue: Int
  }

  input communityInput {
    type: expandedRepType!
    objValue: regenquestCommunityInput
    strValue: String
  }

  union registered = bool | int

  union expandableUser = regenquestUser | string
  union expandableCommunity = regenquestCommunity | string

  type regenquestNotification {
    _id: String
    notificationID: String
    title: String
    content: String
    image: [image]
    link: String
    date: String
    isRead: Boolean
    isDeleted: Boolean
  }

  input regenquestNotificationInput {
    id: String
    notificationID: String
    title: String
    content: String
    image: [imageInput]
    link: String
    isRead: Boolean
    isDeleted: Boolean
  }

  type regenquestUser {
    _id: String!
    userID: String
    name: String
    username: String
    email: String
    registered: registered
    location: location
    images: [image]
    motives: [motive]
    biography: String
    topics: [topic]
    communities: [expandableCommunity]
    skills: [skill]
    badges: [badge]
    currentLevel: Int
    recommendations: [recommendations]
  }

  input regenquestUserInput {
    id: String
    userID: String
    name: String
    username: String
    email: String
    registered: registeredInput
    location: locationInput
    images: [imageInput]
    motives: [motive]
    biography: String
    topics: [topic]
    communities: [communityInput]
    skills: [skillInput]
    badges: [badgeInput]
    currentLevel: Int
    recommendations: [recommendationsInput]
  }

  type regenquestTask {
    _id: String
    _id: String
    userID: String
    questID: String
    createdAt: String
    name: String
    description: String
    requirements: [String]
    completionStatus: Boolean
    history: [String]
  }

  input regenquestTaskInput {
    id: String
    id: String
    userID: String
    questID: String
    name: String
    description: String
    requirements: [String]
    completionStatus: Boolean
    history: [String]
  }

  """
  TODO: Modify data definition at a later time 
  """
  type regenquestQuest {
    _id: String
    _id: String
    name: String
    description: String
    objective: String
    initiative: String
    type: String
    duration: String
    location: location
    startDate: String
    endDate: String
    requirements: [String]
    members: [String]
    history: [String]
    budget: Float
    tasks: [String]
    hashtags: [String]
  }

  input regenquestQuestInput {
    id: String
    id: String
    name: String
    description: String
    objective: String
    initiative: String
    type: String
    duration: String
    location: locationInput
    startDate: String
    endDate: String
    requirements: [String]
    members: [String]
    history: [String]
    budget: Float
    tasks: [String]
    hashtags: [String]
  }

  type regenquestPost {
    _id: String
    _id: String
    userID: String
    title: String
    description: String
    likes: Int
    attachments: [String]
    createdAt: String
    comments: [comment]
  }

  input regenquestPostInput {
    id: String
    id: String
    userID: String
    title: String
    description: String
    attachments: [String]
    comments: [commentInput]
  }

  type regenquestInventory {
    _id: String
    _id: String
    userID: String
    taskLink: String
    itemName: String
    createdAt: String
    description: String
    image: [image]
    history: [String]
  }

  input regenquestInventoryInput {
    id: String
    id: String
    userID: String
    taskLink: String
    itemName: String
    description: String
    image: [imageInput]
    history: [String]
  }

  type regenquestEvent {
    _id: String
    _id: String
    name: String
    theme: String
    location: location
    time: String
    description: String
    layer: String
    hashtags: [String]
  }

  input regenquestEventInput {
    id: String
    id: String
    name: String
    theme: String
    location: locationInput
    time: String
    description: String
    layer: String
    hashtags: [String]
  }

  type regenquestCommunity {
    _id: String!
    name: String
    description: String
    members: [expandableUser]
    tags: [topic]
    location: location
    images: [image]
  }

  input userInput {
    type: expandedRepType!
    objValue: regenquestUserInput
    strValue: String
  }

  input regenquestCommunityInput {
    id: String,
    name: String
    description: String
    members: [userInput]
    tags: [topic]
    location: locationInput
    images: [imageInput]
  }

  type regenquestGenres {
    genre: [String]
  }

  input regenquestGenresInput {
    genre: [String]
  }

  type mutationResponse {
    code: Int
    response: String
  }

  type regenquestLoggedInUsers {
    _id: String
  }

  input loginUser {
    username: String
    password: String
  }

  type regenquestChat {
    _id: String
    _id: String
    members: [String]
    name: String
    description: String
    createdAt: String
  }

  input regenquestChatInput {
    id: String
    id: String
    members: [String]
    name: String
    description: String
  }

  type regenquestMessage {
    _id: String
    _id: String
    chatID: String
    sentFrom: String
    message: String
    time: String
    unreadBy: [String]
  }

  input regenquestMessageInput {
    id: String
    id: String
    chatID: String
    sentFrom: String
    message: String
  }

  input addMemberToChatInput {
    _id: String
    _id: String
    userID: String
  }

  input markMessageAsReadInput {
    _id: String
    _id: String
    userID: String
  }

  type Query {
    getUsers: [regenquestUser]
    getTasks: [regenquestTask]
    getQuests: [regenquestQuest]
    getPosts: [regenquestPost]
    getItems: [regenquestInventory]
    getEvents: [regenquestEvent]
    getCommunities: [regenquestCommunity]
    getGenres: regenquestGenres

    findUserbyID(id: String): regenquestUser
    findTaskbyID(taskID: String): regenquestTask
    findQuestbyID(questID: String): regenquestQuest
    findPostbyID(postID: String): regenquestPost
    findInventoryItembyID(itemID: String): regenquestInventory
    findEventbyID(eventID: String): regenquestEvent
    findCommunitybyID(id: String): regenquestCommunity

    getChatsByUserID(userID: String): [regenquestChat]
    getMessagesByChatID(chatID: String): [regenquestMessage]

    getNotifications(userID: String): [regenquestNotification]
    getUnreadNotifications(userID: String): [regenquestNotification]
    markNotificationAsRead(notificationID: String): mutationResponse
    markAllNotificationsAsRead(userID: String): mutationResponse
    deleteNotification(notificationID: String): mutationResponse

    generatePresignedURL: String!
  }

  
  """
  TODO: Declare and implement delete routines for all necessary models
  """
  type Mutation {
    createRegenquestUser(userInput: regenquestUserInput): mutationResponse
    createRegenquestTask(userInput: regenquestTaskInput): mutationResponse
    createRegenquestQuest(userInput: regenquestQuestInput): mutationResponse
    createRegenquestPost(userInput: regenquestPostInput): mutationResponse
    createRegenquestInventory(
      userInput: regenquestInventoryInput
    ): mutationResponse
    createRegenquestEvent(userInput: regenquestEventInput): mutationResponse
    createRegenquestCommunity(
      userInput: regenquestCommunityInput
    ): mutationResponse
    createRegenquestNotification(
      userInput: regenquestNotificationInput
    ): mutationResponse

    createRegenquestChat(userInput: regenquestChatInput): mutationResponse
    sendRegenquestMessage(userInput: regenquestMessageInput): mutationResponse
    addMemberToChat(userInput: addMemberToChatInput): mutationResponse
    markMessageAsRead(userInput: markMessageAsReadInput): mutationResponse

    updateRegenquestUser(userInput: regenquestUserInput): mutationResponse
    updateRegenquestTask(userInput: regenquestTaskInput): mutationResponse
    updateRegenquestQuest(userInput: regenquestQuestInput): mutationResponse
    updateRegenquestPost(userInput: regenquestPostInput): mutationResponse
    updateRegenquestInventory(
      userInput: regenquestInventoryInput
    ): mutationResponse
    updateRegenquestEvent(userInput: regenquestEventInput): mutationResponse
    updateRegenquestCommunity(
      userInput: regenquestCommunityInput
    ): mutationResponse
    updateRegenquestGenres(userInput: regenquestGenresInput): mutationResponse
    updateRegenquestNotification(
      userInput: regenquestNotificationInput
    ): mutationResponse
  }
`;
