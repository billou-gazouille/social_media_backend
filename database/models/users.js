const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    token: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['USER', 'ADMIN'], 
        default: 'USER',
        required: true,
    },
    isAccountBlocked: { 
        type: Boolean, 
        required: true,
        default: false,
        set: () => false,
    },
    remainingLoginAttempts: { 
        type: Number, 
        required: true 
    },
    lastFailedLoginTime: { 
        type: Date, 
        required: true,
        default: null,
        set: () => null,
    },
    posts: [{ 
        type: ObjectId, 
        ref: 'posts', 
        required: true,
        set: () => [],
    }],
});

const User = mongoose.model('users', userSchema);

module.exports = { User };