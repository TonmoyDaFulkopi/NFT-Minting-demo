'use client'; // Add this directive at the top

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';

const NFTGallery = () => {
    const [nfts, setNfts] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const { address } = useAccount();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const fetchNFTs = async () => {
        if (!address) return;
        try {
            const response = await axios.get(`http://localhost:5000/api/nft/gallery/${address}`);
            setNfts(response.data.data);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    };

    useEffect(() => {
        if (address) {
            fetchNFTs();
        }
    }, [address]);

    // Prevent rendering on server
    if (!isClient) {
        return null;
    }

    // If no wallet is connected, return null
    if (!address) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Your NFT Gallery</h2>
            {nfts.length === 0 ? (
                <p className="text-gray-400">No NFTs found, please mint your first one using the widget above</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {nfts.map((nft) => (
                        <div key={nft.nftId} className="bg-[#1a1b1f] rounded-lg overflow-hidden">
                            <img
                                src={nft.nftLogoUrl}
                                alt={nft.nftName}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.target.src = '/default-nft.png';
                                }}
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-white">{nft.nftName}</h3>
                                <p className="text-gray-400 mt-2">{nft.nftDescription}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NFTGallery;