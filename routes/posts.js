const express = require('express');
const router = express.Router();

const { checkBody } = require('../modules/checkBody');


const { User } = require('../database/models/users');
const { Post } = require('../database/models/posts');
const { Comment } = require('../database/models/comments');


// get all posts:
router.get('/all', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({ result: true, posts });
    }
    catch(err) {
        res.status(500).json({ result: false, error: err.message });
    }
});


// get all posts from the given user:
router.post('/mine', async (req, res) => {
    if (! checkBody(req.body, ['userToken']))
        return res.status(400).json({ 
            result: false, 
            error: 'Invalid request body'
        });
    
    const { userToken } = req.body;
  
    try {
        const user = await User.findOne({ token: userToken });
        if (!user)
            return res.status(400).json({ 
                result: false, 
                error: 'No user found with the provided token'
            });
        try {
            const posts = await Post.find({ user: user._id });
            res.status(200).json({ result: true, posts });
        }
        catch(err){
            res.status(500).json({ result: false, error: err.message });
        }
    }
    catch(err) {
        res.status(500).json({ result: false, error: err.message });
    }
});


router.post('/new', async (req, res) => {
    if (! checkBody(req.body, ['userToken', 'content']))
        return res.status(400).json({ 
            result: false, 
            error: 'Invalid request body'
        });
    
    const { userToken, content } = req.body;
  
    try {
        const user = await User.findOne({ token: userToken });
        if (!user)
            return res.status(400).json({ 
                result: false, 
                error: 'No user found with the provided token'
            });
    
        const newPost = { 
            user: user._id,
            content,
            date: new Date(),
            likes: [],
            comments: [],
            isPrivate: false,
        };
        await Post.create(newPost);
        res.status(200).json({ result: true });
    }
  
    catch(err) {
        res.status(500).json({ result: false, error: err.message });
    }
});


router.post('/comment', async (req, res) => {
    if (! checkBody(req.body, ['userToken', 'postId', 'comment']))
        return res.status(400).json({ 
            result: false, 
            error: 'Invalid request body'
        });
    
    const { userToken, postId, comment } = req.body;
  
    try {
        const user = await User.findOne({ token: userToken });
        if (!user)
            return res.status(400).json({ 
                result: false, 
                error: 'No user found with the provided token'
            });

        const newComment = {
            user: user._id,
            text: comment
        };
        const newCommentDoc = await Comment.create(newComment);
        if (!newCommentDoc)
            return res.json({
                result: false,
                error: "Couldn't save the comment"
            });

        const addComment = await Post.updateOne(
            { _id: postId }, 
            { $push: { comments: newCommentDoc._id } }
        );
        if (addComment.updateCount === 0)
            return res.json({
                result: false,
                error: "Couldn't add comment to list"
            });

        res.status(200).json({ result: true });
    }
  
    catch(err) {
        res.status(500).json({ result: false, error: err.message });
    }
});


router.post('/like', async (req, res) => {
    if (! checkBody(req.body, ['userToken', 'postId']))
        return res.status(400).json({ 
            result: false, 
            error: 'Invalid request body'
        });
    
    const { userToken, postId } = req.body;
  
    try {
        const user = await User.findOne({ token: userToken });
        if (!user)
            return res.status(400).json({ 
                result: false, 
                error: 'No user found with the provided token'
            });

        const post = await Post.findById(postId);
        const alreadyLiked = post.likes.includes(user._id);
        const operation = alreadyLiked ? '$pull' : '$push';
        
        const toggleLike = await Post.updateOne(
            { _id: postId }, 
            { [operation] : { likes: user._id } }
        );

        if (toggleLike.updateCount === 0)
            return res.json({
                result: false,
                error: "Couldn't like or unlike the post"
            });

        res.status(200).json({ result: true });
    }
  
    catch(err) {
        res.status(500).json({ result: false, error: err.message });
    }
});


module.exports = router;