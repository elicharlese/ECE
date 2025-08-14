import { PrismaClient } from '@prisma/client';
import { Card } from '@prisma/client';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';

export class NFTService {
  private prisma: PrismaClient;
  private connection: Connection;
  private metaplex: Metaplex;
  
  constructor() {
    this.prisma = new PrismaClient();
    this.initializeBlockchain();
  }
  
  /**
   * Initialize blockchain connection and Metaplex client
   */
  private async initializeBlockchain(): Promise<void> {
    // Initialize Solana connection
    this.connection = new Connection(process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com');
    
    // Initialize wallet for minting (in production, use a secure key management system)
    let wallet: Keypair;
    if (process.env.NFT_MINTING_WALLET_PRIVATE_KEY) {
      try {
        wallet = Keypair.fromSecretKey(
          Uint8Array.from(JSON.parse(process.env.NFT_MINTING_WALLET_PRIVATE_KEY))
        );
      } catch (error) {
        console.error('Error loading minting wallet, using new keypair:', error);
        wallet = Keypair.generate();
      }
    } else {
      console.warn('NFT_MINTING_WALLET_PRIVATE_KEY not found, using new keypair');
      wallet = Keypair.generate();
    }
    
    // Initialize Metaplex client
    this.metaplex = Metaplex.make(this.connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com',
        timeout: 60000,
      }));
  }
  
  /**
   * Mint a new NFT for a card
   * @param cardId The ID of the card to mint as an NFT
   * @param ownerAddress The Solana wallet address of the owner
   * @returns The minted NFT details
   */
  public async mintCardNFT(cardId: string, ownerAddress: string): Promise<Card | null> {
    try {
      // Fetch the card from the database
      const card = await this.prisma.card.findUnique({
        where: { id: cardId }
      });
      
      if (!card) {
        throw new Error(`Card with ID ${cardId} not found`);
      }
      
      // Check if card is already minted
      if (card.isMinted) {
        throw new Error(`Card with ID ${cardId} is already minted as an NFT`);
      }
      
      // Generate NFT metadata
      const metadata = await this.generateNFTMetadata(card);
      
      // Upload metadata to Arweave/IPFS
      const uploadedMetadata = await this.metaplex.nfts().uploadMetadata(metadata);
      
      // Mint the NFT on Solana
      const { nft } = await this.metaplex.nfts().create({
        uri: uploadedMetadata.uri,
        name: card.name,
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
          {
            address: this.metaplex.identity().publicKey,
            share: 100,
          }
        ],
        isMutable: true,
        primarySaleHappened: true,
      });
      
      // Update the card with NFT details
      const updatedCard = await this.prisma.card.update({
        where: { id: cardId },
        data: {
          tokenId: nft.address.toBase58(),
          contractAddress: nft.mint.address.toBase58(),
          mintAddress: nft.mint.address.toBase58(),
          blockchain: 'solana',
          metadataUri: uploadedMetadata.uri,
          isMinted: true
        }
      });
      
      return updatedCard;
    } catch (error) {
      console.error('Error minting card NFT:', error);
      throw error;
    }
  }
  
  /**
   * Generate NFT metadata for a card
   * @param card The card to generate metadata for
   * @returns The metadata object
   */
  public async generateNFTMetadata(card: Card): Promise<any> {
    return {
      name: card.name,
      description: card.description || `ECE Trading Card - ${card.name}`,
      image: card.imageUrl || '',
      attributes: [
        { trait_type: 'Rarity', value: card.rarity },
        { trait_type: 'Category', value: card.category },
        // Add more attributes based on card stats
      ],
      properties: {
        // Add any additional properties
      }
    };
  }
  
  /**
   * Sync NFT ownership from blockchain to database
   * @param cardId The ID of the card to sync
   * @returns The updated card
   */
  public async syncNFTOwnership(cardId: string): Promise<Card | null> {
    try {
      const card = await this.prisma.card.findUnique({
        where: { id: cardId }
      });
      
      if (!card || !card.isMinted || !card.tokenId) {
        throw new Error(`Card with ID ${cardId} is not minted as an NFT`);
      }
      
      // Fetch NFT details from blockchain
      const nft = await this.metaplex.nfts().findByMint({ mintAddress: new PublicKey(card.tokenId) });
      
      // Get current owner from blockchain
      const currentOwner = nft.token.ownerAddress?.toBase58();
      
      // If owner has changed, update in database
      if (currentOwner && currentOwner !== card.ownerId) {
        // Find user with this wallet address (would need to add wallet address to User model)
        // For now, we'll just log the change
        console.log(`NFT ownership change detected for card ${cardId}: ${card.ownerId} -> ${currentOwner}`);
        
        // In a full implementation, we would:
        // 1. Find the user with this wallet address
        // 2. Update the card's ownerId
        // 3. Create a transaction record
      }
      
      return card;
    } catch (error) {
      console.error('Error syncing NFT ownership:', error);
      throw error;
    }
  }
  
  /**
   * Get NFT details for a card
   * @param cardId The ID of the card
   * @returns The NFT details
   */
  public async getNFTDetails(cardId: string): Promise<any> {
    try {
      const card = await this.prisma.card.findUnique({
        where: { id: cardId }
      });
      
      if (!card || !card.isMinted || !card.tokenId) {
        throw new Error(`Card with ID ${cardId} is not minted as an NFT`);
      }
      
      // Fetch NFT details from blockchain
      const nft = await this.metaplex.nfts().findByMint({ mintAddress: new PublicKey(card.tokenId) });
      
      return {
        tokenId: card.tokenId,
        contractAddress: card.contractAddress,
        mintAddress: card.mintAddress,
        blockchain: card.blockchain,
        metadataUri: card.metadataUri,
        isMinted: card.isMinted,
        onChainMetadata: nft,
        owner: nft.token.ownerAddress?.toBase58()
      };
    } catch (error) {
      console.error('Error getting NFT details:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const nftService = new NFTService();
