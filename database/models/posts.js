const mongoose = require('mongoose');
const { commentSchema } = require('./comments');
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = mongoose.Schema({
    user: { type: ObjectId, ref: 'users' },
    content: String,
    date: Date,
    likes: [{ type: ObjectId, ref: 'users' }],
    comments: [commentSchema],
    isPrivate: Boolean,
});

const Post = mongoose.model('posts', postSchema);

module.exports = { Post };