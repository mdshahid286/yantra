const CommunityGroup = require('../models/CommunityGroup');
const CommunityMessage = require('../models/CommunityMessage');

// Get all groups with optional filtering
exports.getGroups = async (req, res) => {
    try {
        const { location, crop, farmingStyle } = req.query;
        let query = {};

        if (location) query.location = location;
        if (crop) query.crop = crop;
        if (farmingStyle) query.farmingStyle = farmingStyle;

        let groups = await CommunityGroup.find(query).sort({ lastMessageTime: -1 });

        // Seed initial groups if none exist
        if (groups.length === 0 && !location && !crop) {
            groups = await seedInitialGroups();
        }

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error: error.message });
    }
};

// Get messages for a group
exports.getMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const messages = await CommunityMessage.find({ groupId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { groupId, text, senderId, senderName, type } = req.body;

        console.log('Received message request:', { groupId, text, senderId, senderName, type });

        // Validate required fields
        if (!groupId || !text || !senderId || !senderName) {
            console.error('Missing required fields');
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['groupId', 'text', 'senderId', 'senderName']
            });
        }

        // Validate groupId format
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            console.error('Invalid groupId format:', groupId);
            return res.status(400).json({ message: 'Invalid groupId format' });
        }

        const newMessage = await CommunityMessage.create({
            groupId,
            senderId,
            senderName,
            text,
            type: type || 'text'
        });

        console.log('Message created successfully:', newMessage._id);

        // Emit live message via Socket.io
        const io = req.app.get('socketio');
        if (io) {
            io.to(groupId.toString()).emit('receive_message', newMessage);
        }

        // Update group's last message
        await CommunityGroup.findByIdAndUpdate(groupId, {
            lastMessage: text,
            lastMessageTime: Date.now()
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

// Helper to seed initial groups
async function seedInitialGroups() {
    const samples = [
        {
            name: 'Pune Wheat Farmers',
            description: 'Discussion for wheat growers in Pune region.',
            location: 'Pune',
            crop: 'Wheat',
            farmingStyle: 'Conventional',
            membersCount: 156,
            icon: 'wheat'
        },
        {
            name: 'Organic Tomato Punjab',
            description: 'Exclusively for organic tomato cultivation in Punjab.',
            location: 'Punjab',
            crop: 'Tomato',
            farmingStyle: 'Organic',
            membersCount: 89,
            icon: 'leaf'
        },
        {
            name: 'Maharashtra Rice Experts',
            description: 'Expert advice on rice farming in Maharashtra.',
            location: 'Maharashtra',
            crop: 'Rice',
            farmingStyle: 'Conventional',
            membersCount: 210,
            icon: 'water'
        },
        {
            name: 'Hydroponics Hub India',
            description: 'National group for hydroponic farming enthusiasts.',
            location: 'National',
            crop: 'Various',
            farmingStyle: 'Hydroponic',
            membersCount: 45,
            icon: 'flask'
        }
    ];

    return await CommunityGroup.insertMany(samples);
}
