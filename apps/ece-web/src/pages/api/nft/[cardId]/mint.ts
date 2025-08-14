import { NextApiRequest, NextApiResponse } from 'next';
import { nftAPIService } from '@/services/nft-api.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cardId } = req.query;
  
  if (!cardId || typeof cardId !== 'string') {
    return res.status(400).json({ error: 'Card ID is required' });
  }
  
  switch (req.method) {
    case 'POST':
      try {
        const { ownerAddress } = req.body;
        
        if (!ownerAddress) {
          return res.status(400).json({ error: 'Owner address is required' });
        }
        
        const mintedCard = await nftAPIService.mintCardNFT(cardId, ownerAddress);
        
        return res.status(200).json({
          message: 'Card successfully minted as NFT',
          card: mintedCard
        });
      } catch (error: any) {
        console.error('Error minting card as NFT:', error);
        
        // Handle specific error cases
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: 'Card not found' });
        }
        
        if (error.message.includes('already minted')) {
          return res.status(409).json({ error: 'Card is already minted as NFT' });
        }
        
        return res.status(500).json({ error: 'Failed to mint card as NFT' });
      }
    
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
