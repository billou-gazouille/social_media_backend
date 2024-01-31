const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = mongoose.Schema({
    user: { 
        type: ObjectId, 
        ref: 'users', 
        required: true,
        immutable: true,
    },
    content: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date,
        set: () => new Date(), 
        required: true,
        immutable: true,
    },
    likes: { 
        type: [{ 
            type: ObjectId, 
            ref: 'users', 
        }],
        default: [],
        required: true,
    },
    comments: {
        type: [{ 
            type: ObjectId, 
            ref: 'comments',
        }],
        default: [],
        required: true,
    },
    isPrivate: { 
        type: Boolean, 
        required: true,
        default: false, 
    },
});

const Post = mongoose.model('posts', postSchema);

module.exports = { Post };