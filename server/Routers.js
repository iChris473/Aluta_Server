
const router = require("express").Router()
// User Controller
const userController = require("./controllers/UserController");
const postController = require("./controllers/PostController")
const chatController = require("./controllers/ChatController")

// USER ROUTES

// Create User and Save in Mongodb
router.post("/user/create", userController.createUser);
// Sign In User
router.post("/user/signin", userController.signInUser);
// update user
router.put("/user/update/:id", userController.updateUser)
// delete user
router.delete("/user/delete/:id", userController.deleteUser)
// get all user
router.get("/user", userController.getAllUser)
// get a user
router.get("/user/:id", userController.getUser)
// follow a user
router.put("/user/follow/:id", userController.followUser)
// get followers
router.get("/user/fans/:id", userController.getFollowers)
// unfollow a user
router.put("/user/unfollow/:id", userController.unfollowUser)
// forgot password
router.post("/user/forgotpassword", userController.forgotPassword)
// reset password
router.put("/user/resetpassword", userController.resetPassword)
// search user
router.get("/search/user", userController.searchUser)


// POST ROUTES

// create Post
router.post("/post/create", postController.createPost)
// update Post
router.put("/post/update/:id", postController.updatePost)
// delete post
router.delete("/post/delete/:id", postController.deletePost)
// react to a post
router.put("/post/react", postController.likePost)
// get reaction
router.get("/post/react/:id", postController.getReactions)
// get a post
router.get("/post/get/:id", postController.getPost)
// get feed
router.get("/post/feed", postController.getFeed)
// get timeline
router.get("/post/timeline/:id", postController.getTimeline)
// Search Post
router.get("/post/search", postController.searchPost)
// Create Comment
router.post("/post/comment/create", postController.createComment)
// get Comment
router.get("/post/comment/get/:id", postController.getComment)
// delete Comment
router.delete("/post/comment/delete/:id", postController.deleteComment)
// update Comment
router.put("/post/comment/update", postController.updateComment)


// Chat Routes

// create conversation
router.post("/chat/conversation", chatController.CreateConversation)
// get conversation
router.get("/chat/get/:id", chatController.getConversation)
// get conversation from profile
router.get("/chat/conversation", chatController.getConversationFromProfile)
// send message
router.post("/chat/message/send", chatController.createMessage)
// get message
router.get("/chat/message/get/:id", chatController.getMessages)




// message/get?friendId=61de1a4d83a5260ea90c9dde&userId=61de1d775b95a8b8cd6ccaa6

module.exports = router