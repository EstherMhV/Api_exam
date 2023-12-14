const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        required : true,
        unique: true,
    },
    password: {
        type: String,
        required : true,
    },
    firstName: {
        type: String,
        required : true,
    },
    role: {
        type: String,
        required : true,
        defaultValue: 'user',
    }
});

module.exports = mongoose.model('User', userSchema);