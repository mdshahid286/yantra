const mongoose = require('mongoose');

const CommunityMessageSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommunityGroup',
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'voice'],
        default: 'text'
    }
}, { timestamps: true });

module.exports = mongoose.model('CommunityMessage', CommunityMessageSchema);
