const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    tokenHash: { type: String, required: true },
    device: { type: String },
    ip: { type: String },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);