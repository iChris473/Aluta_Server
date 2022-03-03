
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    desc: {
        type: String,
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    },
    unlikes: {
        type: Array,
        default: []
    },
    location: {
        type: String
    }
    
}, {timestamps: true})

module.exports = mongoose.model("Post", PostSchema)