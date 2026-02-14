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

        const newMessage = await CommunityMessage.create({
            groupId,
            senderId,
            senderName,
            text,
            type: type || 'text'
        });

        // Update group's last message
        await CommunityGroup.findByIdAndUpdate(groupId, {
            lastMessage: text,
            lastMessageTime: Date.now()
        });

        res.status(201).json(newMessage);
    } catch (error) {
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
