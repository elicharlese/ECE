// ECE Token Contract Tests
// Run with: anchor test

const { PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program } = require('@coral-xyz/anchor');
const { expect } = require('chai');

describe('ece-token', () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.EceToken;
  const user = anchor.web3.Keypair.generate();

  it('should initialize the token', async () => {
    // Airdrop SOL to user
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    );

    // Initialize token
    const [tokenAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('token'), user.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initialize()
      .accounts({
        tokenAccount,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    // Check token balance
    const account = await program.account.tokenAccount.fetch(tokenAccount);
    expect(account.balance.toNumber()).to.equal(0);
  });

  it('should mint tokens', async () => {
    const [tokenAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('token'), user.publicKey.toBuffer()],
      program.programId
    );

    const mintAmount = 100;

    await program.methods
      .mint(new anchor.BN(mintAmount))
      .accounts({
        tokenAccount,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    // Verify mint
    const account = await program.account.tokenAccount.fetch(tokenAccount);
    expect(account.balance.toNumber()).to.equal(mintAmount);
  });

  it('should transfer tokens', async () => {
    const [tokenAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('token'), user.publicKey.toBuffer()],
      program.programId
    );

    const recipient = anchor.web3.Keypair.generate();
    const [recipientAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('token'), recipient.publicKey.toBuffer()],
      program.programId
    );

    const transferAmount = 50;

    await program.methods
      .transfer(new anchor.BN(transferAmount))
      .accounts({
        from: tokenAccount,
        to: recipientAccount,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    // Verify transfer
    const senderAccount = await program.account.tokenAccount.fetch(tokenAccount);
    const receiverAccount = await program.account.tokenAccount.fetch(recipientAccount);

    expect(senderAccount.balance.toNumber()).to.equal(50);
    expect(receiverAccount.balance.toNumber()).to.equal(transferAmount);
  });
});
