
const Conversation = require("../models/Conversations")
const Message = require("../models/Message")


exports.CreateConversation = async (req, res) => {
    try {
        const newConversation = new Conversation(req.body)
        await newConversation.save()
        res.status(200).json(newConversation)
    } catch (err) {
        res.status(400).json(err)
    }
}
// get conversations
exports.getConversation =  async (req, res) => {
    try {
        let sconversations = await Conversation.find({senderId:req.params.id})
        let rConversation =  await Conversation.find({recieverId:req.params.id})
        const bothConversations = sconversations.concat(...rConversation)
        res.status(200).json((bothConversations))
    } catch (err) {
        res.status(500).json(err)
    }
}
// get conversation from user profile
exports.getConversationFromProfile =  async (req, res) => {
    const {senderId, recieverId} = req.query
    try {
        let sconversations = await Conversation.find({senderId, recieverId})
        let rConversation =  await Conversation.find({senderId:recieverId, recieverId:senderId})
        const bothConversations = sconversations.concat(...rConversation)
        res.status(200).json(bothConversations)
    } catch (err) {
        res.status(500).json(err)
    }
}

// send message
exports.createMessage = async (req, res) => {
    try {
        const newMessage =  new Message(req.body);
        await newMessage.save()
        .then(data => res.status(200).json(data))
    } catch (err) {
        res.status(400).json(err)
    }
}

// get messages 
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({conversationId: req.params.id})
        res.status(200).json(messages)
    } catch (err) {
       res.status(400).json(err) 
    }
}
