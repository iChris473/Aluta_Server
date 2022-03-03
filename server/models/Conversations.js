
const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    senderId: {
        type: String,
    },
    recieverId: {
        type: String,
    }
}, {timestamps: true})

ConversationSchema.index({senderId: 1, recieverId:1}, {unique: true})

module.exports = mongoose.model("Conversations", ConversationSchema)
