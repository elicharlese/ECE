import { nftService } from '../src/services/nft.service';
import { PrismaClient } from '@prisma/client';

async function testNFTService() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing NFT Service...');
    
    // Create a test card if none exists
    let testCard = await prisma.card.findFirst({
      where: { name: 'Test NFT Card' }
    });
    
    if (!testCard) {
      console.log('Creating test card...');
      testCard = await prisma.card.create({
        data: {
          name: 'Test NFT Card',
          description: 'A test card for NFT integration',
          rarity: 'Rare',
          category: 'Technology',
          imageUrl: 'https://example.com/test-card.png',
          // Add other required fields as needed
        }
      });
      console.log('Created test card:', testCard.id);
    } else {
      console.log('Using existing test card:', testCard.id);
    }
    
    // Test NFT minting
    console.log('Testing NFT minting...');
    const ownerAddress = '8wH58mD3658L9c3W23456789012345678901234567890'; // Example address
    
    if (!testCard.isMinted) {
      const mintedCard = await nftService.mintCardNFT(testCard.id, ownerAddress);
      console.log('Minted NFT card:', mintedCard);
    } else {
      console.log('Card already minted as NFT');
    }
    
    // Test getting NFT details
    console.log('Testing NFT details retrieval...');
    const nftDetails = await nftService.getNFTDetails(testCard.id);
    console.log('NFT Details:', JSON.stringify(nftDetails, null, 2));
    
    // Test syncing ownership
    console.log('Testing NFT ownership sync...');
    const syncedCard = await nftService.syncNFTOwnership(testCard.id);
    console.log('Synced card:', syncedCard);
    
    console.log('NFT Service test completed successfully!');
  } catch (error) {
    console.error('Error testing NFT Service:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testNFTService();
}
