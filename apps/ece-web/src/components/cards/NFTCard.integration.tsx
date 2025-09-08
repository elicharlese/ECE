'use client';

import React, { useState } from 'react';
// TODO: Re-enable Solana wallet integration when dependencies are available
// import { useWallet } from '@solana/wallet-adapter-react';

// Local, flexible NFT card type for this integration component
interface NFTCardData {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: string;
  imageUrl?: string;
  // Optional NFT fields
  isMinted?: boolean;
  tokenId?: string;
  contractAddress?: string;
  mintAddress?: string;
  blockchain?: string;
  metadataUri?: string;
}

interface NFTCardIntegrationProps {
  card: NFTCardData;
  onMint?: (cardId: string) => void;
}

const NFTCardIntegration: React.FC<NFTCardIntegrationProps> = ({ card, onMint }) => {
  // TODO: Re-enable when Solana wallet integration is available
  const publicKey = null;
  const connected = false;

  const [nftDetails, setNftDetails] = useState<{
    tokenId?: string;
    contractAddress?: string;
    mintAddress?: string;
    blockchain?: string;
    metadataUri?: string;
    isMinted?: boolean;
    owner?: string;
    onChainMetadata?: {
      name: string;
      description: string;
      image?: string;
      attributes: Array<{ trait_type: string; value: string }>;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNFTDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would call your backend API
      // const response = await fetch(`/api/nft/${card.id}/details`);
      // const details = await response.json();
      
      // setNftDetails(details);
      
      // For now, we'll simulate the data
      setNftDetails({
        tokenId: card.tokenId,
        contractAddress: card.contractAddress,
        mintAddress: card.mintAddress,
        blockchain: card.blockchain,
        metadataUri: card.metadataUri,
        isMinted: card.isMinted,
        owner: 'Unknown',
        onChainMetadata: {
          name: card.name,
          description: card.description,
          image: card.imageUrl,
          attributes: [
            { trait_type: 'Rarity', value: card.rarity },
            { trait_type: 'Category', value: card.category },
          ]
        }
      });
    } catch (err) {
      setError('Failed to fetch NFT details');
      console.error('Error fetching NFT details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMint = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!onMint) {
      setError('Minting not available');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the mint function passed from parent
      onMint(card.id);
      
      // Refresh NFT details after minting
      await fetchNFTDetails();
    } catch (err) {
      setError('Failed to mint NFT');
      console.error('Error minting NFT:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Card Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h3 className="text-xl font-bold">{card.name}</h3>
        <p className="text-sm opacity-90">{card.description}</p>
      </div>
      
      {/* Card Image */}
      <div className="p-4">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.name} 
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      
      {/* Card Details */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">Rarity</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            {card.rarity}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">Category</span>
          <span className="text-sm font-medium">{card.category}</span>
        </div>
        
        {/* NFT Status */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">NFT Status</span>
            <span className={`px-2 py-1 text-xs font-medium rounded ${card.isMinted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {card.isMinted ? 'Minted' : 'Not Minted'}
            </span>
          </div>
          
          {card.isMinted && nftDetails && (
            <div className="mt-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Token ID:</span>
                <span className="font-mono truncate max-w-[100px]">{nftDetails.tokenId?.substring(0, 6)}...{nftDetails.tokenId?.substring(nftDetails.tokenId.length - 4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Owner:</span>
                <span className="font-mono truncate max-w-[100px]">{nftDetails.owner?.substring(0, 6)}...{nftDetails.owner?.substring(nftDetails.owner.length - 4)}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Wallet Connection Status */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Wallet</span>
            <span className={`px-2 py-1 text-xs font-medium rounded ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          
          {connected && publicKey && (
            <div className="mt-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="font-mono truncate max-w-[100px]">Wallet Connected</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {!card.isMinted ? (
            <button
              onClick={handleMint}
              disabled={loading || !connected}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-white ${connected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} transition-colors`}
            >
              {loading ? 'Minting...' : 'Mint NFT'}
            </button>
          ) : (
            <button
              onClick={fetchNFTDetails}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          )}
          
          {card.isMinted && (
            <button
              className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              View on Explorer
            </button>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-3 p-2 bg-red-50 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCardIntegration;
