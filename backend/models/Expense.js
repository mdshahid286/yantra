const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Seeds', 'Fertilizer', 'Labor', 'Equipment', 'Pesticides', 'Other'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);
