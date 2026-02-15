const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Login/Register user with mobile number
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { mobile } = req.body;

        // Validate mobile number
        if (!mobile) {
            return res.status(400).json({ success: false, message: 'Please provide a mobile number' });
        }

        // Check if mobile number is valid (10 digits)
        if (!/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
        }

        // Find user by mobile or create new user
        let user = await User.findOne({ mobile });

        if (!user) {
            // Create new user with mobile number
            user = await User.create({
                mobile,
                name: 'Farmer',
                profileCompleted: false,
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Complete user profile
// @route   POST /api/auth/complete-profile
// @access  Private
exports.completeProfile = async (req, res) => {
    try {
        const { farmerName, location, farmSize, farmSizeUnit } = req.body;

        // Validate required fields
        if (!farmerName || !location || !location.state || !location.district || !farmSize || !farmSizeUnit) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: farmerName, location (state, district), farmSize, farmSizeUnit'
            });
        }

        // Update user profile
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                farmerName,
                name: farmerName, // Also update name field
                location: {
                    state: location.state,
                    district: location.district,
                    latitude: location.latitude || null,
                    longitude: location.longitude || null,
                },
                farmSize,
                farmSizeUnit,
                profileCompleted: true,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile completed successfully',
            user: {
                id: user._id,
                mobile: user.mobile,
                name: user.name,
                farmerName: user.farmerName,
                location: user.location,
                farmSize: user.farmSize,
                farmSizeUnit: user.farmSizeUnit,
                profileCompleted: user.profileCompleted,
            },
        });
    } catch (error) {
        console.error('Complete profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                mobile: user.mobile,
                name: user.name,
                farmerName: user.farmerName,
                email: user.email,
                location: user.location,
                farmSize: user.farmSize,
                farmSizeUnit: user.farmSizeUnit,
                profileCompleted: user.profileCompleted,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { farmerName, location, farmSize, farmSizeUnit, email } = req.body;

        const updateFields = {};
        if (farmerName) {
            updateFields.farmerName = farmerName;
            updateFields.name = farmerName;
        }
        if (location) updateFields.location = location;
        if (farmSize !== undefined) updateFields.farmSize = farmSize;
        if (farmSizeUnit) updateFields.farmSizeUnit = farmSizeUnit;
        if (email) updateFields.email = email;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                mobile: user.mobile,
                name: user.name,
                farmerName: user.farmerName,
                email: user.email,
                location: user.location,
                farmSize: user.farmSize,
                farmSizeUnit: user.farmSizeUnit,
                profileCompleted: user.profileCompleted,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            mobile: user.mobile,
            name: user.name,
            farmerName: user.farmerName,
            email: user.email,
            location: user.location,
            farmSize: user.farmSize,
            farmSizeUnit: user.farmSizeUnit,
            profileCompleted: user.profileCompleted,
        },
    });
};
