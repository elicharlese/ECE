import { nftService } from './nft.service';
import { Card } from '@prisma/client';

export class NFTAPIService {
  /**
   * Mint a card as an NFT
   * @param cardId The ID of the card to mint
   * @param ownerAddress The Solana wallet address of the owner
   * @returns The updated card with NFT details
   */
  public async mintCardNFT(cardId: string, ownerAddress: string): Promise<Card | null> {
    try {
      return await nftService.mintCardNFT(cardId, ownerAddress);
    } catch (error) {
      console.error('Error in NFT API - mintCardNFT:', error);
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
      return await nftService.getNFTDetails(cardId);
    } catch (error) {
      console.error('Error in NFT API - getNFTDetails:', error);
      throw error;
    }
  }
  
  /**
   * Sync NFT ownership for a card
   * @param cardId The ID of the card to sync
   * @returns The updated card
   */
  public async syncNFTOwnership(cardId: string): Promise<Card | null> {
    try {
      return await nftService.syncNFTOwnership(cardId);
    } catch (error) {
      console.error('Error in NFT API - syncNFTOwnership:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const nftAPIService = new NFTAPIService();
