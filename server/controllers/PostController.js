
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comments");

// create a post 
exports.createPost = async (req, res) => {
    try {
        const newPost =  new Post(req.body);
        await newPost.save()
        res.status(200).json(newPost)
    } catch (err) {
        res.status(400).json(err)
    }
}

// update a post 
exports.updatePost = async (req, res) => {
        try {
            await Post.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },{new: true}).then(() => res.status(200).json("post updated"))
        } catch (err) {
            res.status(400).json(err)
        }
}

// delete a post
exports.deletePost = async (req, res) => {
       try {
            await Post.findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json("post deleted"))
       }
       catch (err) {
         res.status(401).json(err)  
       }
}
// like a post
exports.likePost = async (req, res) => {

    const {like, dislike} = req.query

    if(like){

        try {
            const post = await Post.findById(like)
            if(!post.likes.includes(req.body.userID)){
                if(post.unlikes.includes(req.body.userID)){
                    await post.updateOne({$pull:{unlikes: req.body.userID}})  
                }
                await post.updateOne({$push:{likes: req.body.userID}})
                res.status(200).json("post liked")
            } else{
                await post.updateOne({$pull:{likes: req.body.userID}})
                res.status(200).json("post unliked")
            }

        } catch (err) {
            res.status(400).json(err)
        }
    } else if(dislike){

        try {
            const post = await Post.findById(dislike)
            if(!post.unlikes.includes(req.body.userID)){
                if(post.likes.includes(req.body.userID)){
                    await post.updateOne({$pull:{likes: req.body.userID}})  
                }
                await post.updateOne({$push:{unlikes: req.body.userID}})
                res.status(200).json("post unliked clicked")
            } else{
                await post.updateOne({$pull:{unlikes: req.body.userID}})
                res.status(200).json("post unliked canceled")
            }
        } catch (err) {
            res.status(400).json(err)
        }
    }


}


// get likes
exports.getReactions = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const {likes, unlikes, ...others} = post._doc;
        const reaction =  { like: likes, dislike: unlikes}
        res.status(200).json(reaction)
    } catch (err) {
        res.status(400).json(err)
    }
}
// get a post
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(400).json(err)
    }
}

// get timeline
exports.getTimeline= async (req, res) => {
    const {text} = req.query
    try {
        const currentUser = await User.findById(req.params.id)
        const usersPost = await Post.find({userID: currentUser._id})
        const followingFriendPost = await Promise.all(
            currentUser.following.map(user =>  (
                Post.find({userID: user})
        ))
        ) 
        const followedFriendPost = await Promise.all(
            currentUser.followers.map(user =>  (
               Post.find({userID: user})
        ))
        ) 
        const allTimeLine = usersPost.concat(...followingFriendPost, ...followedFriendPost).filter((v, i, a) => a.findIndex(a => a._id == v._id) === i);
        let searched= []
        const userNames = await Promise.all(
           allTimeLine.map(async user =>  {
               const res = await User.find({_id: user.userID})
               searched = [user, res[0].username]
               return searched
           })
           )

        const filteredTimeline = userNames.filter(u => u[0].desc.toLowerCase().includes(text.toLowerCase()) || u[1].toLowerCase().includes(text.toLowerCase())).map(p => p[0])
        .sort((a,b) => {
            if(a.createdAt > b.createdAt) return -1
            if(a.createdAt < b.createdAt) return 1
        })
       

        res.status(200).json(filteredTimeline)
    } catch (err) {
        res.status(400).json(err)
    }
}

// get Feed
exports.getFeed = async (req, res) => {
    try {
        const post = await Post.find({}).sort({createdAt: -1})
        res.status(200).json(post)
    } catch (err) {
        res.status(405).json(err)
    }
}

exports.createComment = async (req, res) => {
    try {
        const newComment =  new Comment(req.body);
        await newComment.save()
        res.status(200).json(newComment)
    } catch (err) {
        res.status(400).json(err)
    }
    // try {
    //     const post = await Post.findById(req.params.id)
    //     await post.updateOne({$push:{comment: {
    //         userID,
    //         text,
    //         time: Date.now()
    //     }}})
    //     res.status(201).json("Comment created")
        
    // } catch (err) {
    //     res.status(401).json(err)
    // }
}

// get Comments
exports.getComment = async (req, res) => {
    const {userid, text, time,} = req.query
    const postid = req.params.id
    try {
        if(userid && text && time){ 
            const thisComment = await Comment.findOne({
            postId:postid,
            text,
            userId: userid,
            time
        })
        res.status(200).json(thisComment)
        }
        const allComment = await Comment.find({ postId: postid }).sort({ createdAt: 1 })
        res.status(200).json(allComment)
    }
     catch (err) {
        res.status(400).json(err)
    }
}

// delete comment
exports.deleteComment = async (req, res) => {
    const {userid, text, time} = req.query
    const postid = req.params.id
    try {
         await Comment.findOneAndDelete({
            userId: userid,
            postId: postid,
            time,
            text
        })
        
        res.status(200).json('comment deleted')
    } catch (err) {
        res.status(400).json(err)
    }
}

// Edit comment
exports.updateComment = async (req, res) => {
    const {userid, newComment, oldComment, postid, time} = req.body
    try {
        await Comment.findOneAndUpdate({
            userId: userid,
            postId: postid,
            time,
            text: oldComment
        }, {$set: {text: newComment}}, {new: true})
        
        res.status(200).json('comment updated')
    } catch (err) {
        res.status(400).json(err)
    }
}

// find a post by text 
exports.searchPost = async (req, res) => {
    const {text} = req.query
    try {
        const allPosts = await Post.find({})
        let searched= []
         const userNames = await Promise.all(
            allPosts.map(async user =>  {
                const res = await User.find({_id: user.userID})
                searched = [user, res[0].username]
                return searched
            })
            ) 
           const filteredPost = userNames.filter(u => u[0].desc.toLowerCase().includes(text.toLowerCase()) || u[1].toLowerCase().includes(text.toLowerCase())).map(p => p[0]).sort((a,b) => {
               if(a.createdAt > b.createdAt) return -1
               if(a.createdAt < b.createdAt) return 1
           })
        res.status(200).json(filteredPost)
    } catch (err) {
        res.status(400).json(err)
    }
}