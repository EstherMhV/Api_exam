const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

let groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    admin_id: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    invitations: { type: Array,
        default: [] 
    },
    SecretSanta: [{
        giver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }
    ]
});

module.exports = mongoose.model('mongoose', groupSchema);

