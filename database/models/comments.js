const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = mongoose.Schema({
    user: { type: ObjectId, ref: 'users' },
    text: String,
    date: Date,
    comments: [{ type: ObjectId, ref: 'comments' }],  // a comment can have its own comments
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = { Comment, commentSchema };