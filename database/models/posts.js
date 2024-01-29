const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = mongoose.Schema({
    user: { type: ObjectId, ref: 'users' },
    content: String,
    date: Date,
    likes: [{ type: ObjectId, ref: 'users' }],
    comments: [{ type: ObjectId, ref: 'comments' }],
    isPrivate: Boolean,
});

const Post = mongoose.model('posts', postSchema);

module.exports = { Post };