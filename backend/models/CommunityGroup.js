const mongoose = require('mongoose');

const CommunityGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String, // e.g., 'Pune', 'Maharashtra', 'Punjab'
        required: true
    },
    crop: {
        type: String, // e.g., 'Wheat', 'Rice'
        required: true
    },
    farmingStyle: {
        type: String, // e.g., 'Organic', 'Conventional', 'Hydroponic'
        default: 'Conventional'
    },
    membersCount: {
        type: Number,
        default: 0
    },
    icon: {
        type: String,
        default: 'groups'
    },
    lastMessage: {
        type: String
    },
    lastMessageTime: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('CommunityGroup', CommunityGroupSchema);
