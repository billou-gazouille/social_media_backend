const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    token: String,
    isAccountBlocked: Boolean,
    remainingLoginAttempts: Number,
    lastFailedLoginTime: Date,
});

const User = mongoose.model('users', userSchema);

module.exports = { User };