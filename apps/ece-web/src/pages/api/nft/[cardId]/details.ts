import { NextApiRequest, NextApiResponse } from 'next';
import { nftAPIService } from '@/services/nft-api.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cardId } = req.query;
  
  if (!cardId || typeof cardId !== 'string') {
    return res.status(400).json({ error: 'Card ID is required' });
  }
  
  switch (req.method) {
    case 'GET':
      try {
        const nftDetails = await nftAPIService.getNFTDetails(cardId);
        
        return res.status(200).json({
          message: 'NFT details retrieved successfully',
          details: nftDetails
        });
      } catch (error: any) {
        console.error('Error getting NFT details:', error);
        
        // Handle specific error cases
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: 'Card not found' });
        }
        
        if (error.message.includes('not minted')) {
          return res.status(400).json({ error: 'Card is not minted as NFT' });
        }
        
        return res.status(500).json({ error: 'Failed to get NFT details' });
      }
    
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
