const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    const userCount = await prisma.user.count();
    console.log('✅ Database connected successfully');
    console.log('User count:', userCount);
    
    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        walletAddress: 'test-wallet-123',
        username: 'test-user',
        eceBalance: 100.0
      }
    });
    console.log('✅ User created:', testUser.username);
    
    // Clean up
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
