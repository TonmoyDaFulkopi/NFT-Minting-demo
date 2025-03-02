const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    nftName: {
        type: String,
        required: true
    },
    nftDescription: {
        type: String,
        required: true
    },
    nftLogoUrl: {
        type: String,
        required: true
    },
    nftId: {
        type: Number,
        required: true,
        unique: true
    },
    userWalletAddress: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('NFT', nftSchema);