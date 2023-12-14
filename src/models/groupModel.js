const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

let groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('mongoose', groupSchema);

