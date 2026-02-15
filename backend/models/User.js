const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: [true, 'Please add a mobile number'],
        unique: true,
        match: [
            /^[0-9]{10}$/,
            'Please add a valid 10-digit mobile number',
        ],
    },
    name: {
        type: String,
        default: 'Farmer',
    },
    farmerName: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        sparse: true, // Allow null values but enforce uniqueness when present
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
    },
    location: {
        state: {
            type: String,
            default: '',
        },
        district: {
            type: String,
            default: '',
        },
        latitude: {
            type: Number,
            default: null,
        },
        longitude: {
            type: Number,
            default: null,
        },
    },
    farmSize: {
        type: Number,
        default: 0,
    },
    farmSizeUnit: {
        type: String,
        enum: ['acres', 'hectares', ''],
        default: '',
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
