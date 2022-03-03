const User = require("../models/User")
const bcrypt = require("bcrypt")
const sendMail = require('../middleware/sendEmail')

// Sign Up
exports.createUser = async (req, res) => {
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        // generate new password
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        })
        await newUser.save()
        const {password, isAdmin, createdAt, updatedAt, ...others} = newUser._doc
        res.status(200).json(others)
    } catch (err) {
        res.status(400).json(err)
    }
}

// Sign In
exports.signInUser = async (req, res) => {
    try {
        // finds user by email
        const user = await User.findOne({email: req.body.email});
        !user && res.status(404).json("No user found with this credentials");

        // compares password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).json("enter yur correct credentials")
        
        // hides password from client
        const {password, isAdmin, createdAt, updatedAt, ...others} = user._doc
        res.status(200).json(others)

    } catch (err) {
        res.status(400).json(err)
    }
}

// updates user account
exports.updateUser = async (req, res) => {
    // checks if it's user's account
    if(req.body.userID == req.params.id || req.body.isAdmin){
        try {
            if(req.body.password){
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashedPassword
            }
        await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
            res.status(200).json("account updated")
        } catch (err) {
            res.status(404).json(err)
        }
    
    }   else{
        res.status(403).json("you can only update your account")
        }
}

// Delete User
exports.deleteUser = async (req, res) => {
    if(req.body.userID == req.params.id || req.body.isAdmin){
        try {
            // const user = await User.findById(req.params.id);
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("user deleted")
        } catch (err) {
            res.status(404).json(err)
        }
    }
}

// get all user
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({})
       const allUsers = await Promise.all(
            users.map(user => {
                const {password, updatedAt, createdAt, isAdmin, ...others} = user._doc;
                return others
            })    
       ) 
        res.status(200).json(allUsers)
    } catch (err) {
        res.status(400).json(err)
    }
}

// get a user
exports.getUser = async (req, res) => {
        try {
           const user = await User.findById(req.params.id)
           const {password, isAdmin, createdAt, updatedAt, ...others} = user._doc
            res.status(200).json(others)
        } catch (err) {
           res.status(404).json(err) 
        }
    }

// follow a user 

exports.followUser = async (req, res) => {
    if(req.params.id !== req.body.userID){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userID);
            if(!user.followers.includes(req.body.userID)){
               followedUser = await user.updateOne({$push: {followers: req.body.userID}})
                followingUser = await currentUser.updateOne({$push: {following: req.params.id}})
            } else{
                res.status(403).json("youre already following this user")
            }
             res.status(200).json("you just followed this user")
        } catch (err) {
           res.status(403).json(err)
        }
    } else{
        res.status(403).json("you cant follow yourself")
    }
}

// unfollow a user
exports.unfollowUser = async (req, res) => {
    if(req.params.id !== req.body.userID){
        try {
            const followedUser = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userID)
           if(followedUser.followers.includes(req.body.userID)){
               await followedUser.updateOne({$pull: {followers: req.body.userID}})
               await currentUser.updateOne({$pull: {following: req.params.id}})
           } else{
               res.status(403).json("youre nit following this user")
            } 
            res.status(200).json("user unfollowed")
        } catch (err) {
            res.status(403).json(err)
        } 
    } else{
        res.status(403).json("you cant follow yourself")
    }
}

// get followers
exports.getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {followers, following, ...others} = user._doc;
        const fans =  { followers , following}
        res.status(200).json(fans)
    } catch (err) {
        res.status(400).json(err)
    }
}


// Forgot Password

exports.forgotPassword = async (req, res) => {
    const {email} = req.body

    try {
        const user = await User.findOne({email})

        !user && res.status(400).json(err)

        const resetToken = user.getResetPasswordToken()

        await user.save();

        const resetUrl = `https://localhost:2003/resetpassword?resettoken=${resetToken}`

        const message = `
            <h1>You have requested for a password reset</h1>
            <p>Please click the link below to reset your password, This link expires after 10 minutes </p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            await sendMail({
                to: user.email,
                subject: 'Password reset request',
                text: message
            })
            res.status(200).json('Email Sent')
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined

            await user.save()

            res.status(500).json('Email could not be sent')
        }

    } catch (err) {
        res.status(500).json('An error occured sening the email')
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.query.resettoken).digest('hex')

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}
        })

        !user && res.status(400).json('Invalid Reset Token')

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save()

        res.status(200).json("Password changed")

    } catch (error) {
        res.status(400).json('An error occured while resetting the password')
    }
}

// find a post by text 
exports.searchUser = async (req, res) => {
    const {username} = req.query
    try {
        const allUsers = await User.find()
        const filteredUsers = allUsers.filter(u => u.username.toLowerCase().includes(username.toLowerCase()))
        res.status(200).json(filteredUsers)
    } catch (err) {
        res.status(400).json(err)
    }
}