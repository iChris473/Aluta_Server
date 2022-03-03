
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        max: 20,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPhoto: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default:[]
    },
    following: {
        type: Array,
        default: []
    },
    bio: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    from: {
        type: String,
        default: ""
    },
    relationship: {
        type: String,
        default: ""
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
    
}, {timestamps: true})

// userSchema.pre('save', async function(next) {
//     if(!this.isModified('password')){
//         next()
//     }
    
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(this.password, salt)
//     this.password = hashedPassword
//     next()
// })

userSchema.methods.getSignedToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

userSchema.methods.getResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken
}

module.exports = mongoose.model("User", userSchema)