'use client'; // Add this directive at the top

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const CustomConnectButton = () => {
    const [isClient, setIsClient] = useState(false);
    const { address, isConnected } = useAccount();

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Prevent rendering on server
    if (!isClient) {
        return null;
    }

    return (
        <div className="absolute top-4 right-4">
            <ConnectButton
                accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'full',
                }}
                showBalance={{
                    smallScreen: false,
                    largeScreen: true,
                }}
            />
        </div>
    );
};

export default CustomConnectButton;