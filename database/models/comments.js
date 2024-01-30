const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = mongoose.Schema({
    user: { 
        type: ObjectId, 
        ref: 'users',
        required: true, 
    },
    text: { 
        type: String,
        required: true
    },
    date: { 
        type: Date,
        required: true,
        default: () => new Date(),
        set: () => new Date(),
        immutable: true,
    },
    comments: {
        type: [{ 
            type: ObjectId, 
            ref: 'comments',
        }],
        required: true,
        default: [],
    },  // a comment can have its own comments
    likes: {
        type: [{ 
            type: ObjectId, 
            ref: 'users',
        }],
        required: true,
        default: [],
    },
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = { Comment };