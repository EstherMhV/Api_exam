const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    groupId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group' 
    },
    role: {
        type: String,
        requires: true,
        default: 'user',
    }
});

module.exports = mongoose.model('User', userSchema);