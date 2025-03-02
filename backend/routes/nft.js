const express = require('express');
const router = express.Router();
const NFT = require('../models/nft');

// Store NFT Data
router.post('/store', async (req, res) => {
    try {
        const { nftName, nftDescription, nftLogoUrl, nftId, userWalletAddress } = req.body;
        const nft = new NFT({
            nftName,
            nftDescription,
            nftLogoUrl,
            nftId,
            userWalletAddress
        });
        await nft.save();
        res.status(200).json({ success: true, data: nft });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get NFT Data By ID
router.get('/:id', async (req, res) => {
    try {
        const nft = await NFT.findOne({ nftId: req.params.id });
        if (!nft) {
            return res.status(404).json({ success: false, error: 'NFT not found' });
        }
        res.status(200).json({ success: true, data: nft });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get NFT Gallery
router.get('/gallery/:walletAddress', async (req, res) => {
    try {
        const nfts = await NFT.find({ userWalletAddress: req.params.walletAddress });
        res.status(200).json({ success: true, data: nfts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;