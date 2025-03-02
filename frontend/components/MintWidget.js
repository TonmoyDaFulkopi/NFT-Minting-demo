import { useState } from 'react';
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt
} from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';
import axios from 'axios';

const MintWidget = ({ refreshGallery }) => {
    const [formData, setFormData] = useState({
        nftName: '',
        description: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);

    const { address } = useAccount();

    const {
        data: hash,
        writeContract,
        isPending
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    const generateUniqueId = async () => {
        return Math.floor(Math.random() * 1000000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!address) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            setLoading(true);
            const tokenId = await generateUniqueId();

            // Store metadata in backend
            const metadata = {
                nftName: formData.nftName,
                nftDescription: formData.description,
                nftLogoUrl: formData.imageUrl,
                nftId: tokenId,
                userWalletAddress: address
            };

            // Store in backend
            await axios.post('http://localhost:5000/api/nft/store', metadata);

            // Prepare mint transaction
            const metadataUrl = `http://localhost:5000/api/nft/${tokenId}`;

            // Mint NFT
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'mint',
                args: [tokenId, metadataUrl]
            });

            alert('NFT minting process initiated!');
            setFormData({ nftName: '', description: '', imageUrl: '' });
            if (refreshGallery) refreshGallery();
        } catch (error) {
            console.error('Error minting NFT:', error);
            alert('Error minting NFT');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-[#1a1b1f] p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Mint Your NFT</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="NFT Name"
                        className="w-full p-2 bg-[#2c2d33] text-white rounded"
                        value={formData.nftName}
                        onChange={(e) => setFormData({ ...formData, nftName: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        placeholder="Description"
                        className="w-full p-2 bg-[#2c2d33] text-white rounded"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Image URL"
                        className="w-full p-2 bg-[#2c2d33] text-white rounded"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || isPending || isConfirming}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
                >
                    {(loading || isPending || isConfirming) ? 'Minting...' : 'Mint NFT'}
                </button>
            </form>
        </div>
    );
};

export default MintWidget;