import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountIdempotentInstruction,
    createInitializeMint2Instruction,
    createMintToCheckedInstruction,
    getAssociatedTokenAddressSync,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
  import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  import bs58 from "bs58";
  
  (async () => {
    const CONNECTION = new Connection(clusterApiUrl("devnet"));
    const PRIVATE_KEY =
      "Qs36P6uJr2dcTvHKp6aQeKouRRVhMPAspzTJEYmUx9rwjVdNdTa9eEabvsyL1Uq13Wz7WjmbbHa9PBHkHGTNkR2";
  
    const decoded = bs58.decode(PRIVATE_KEY);
    const MY_KEYPAIR = Keypair.fromSecretKey(decoded);
    const MINT_KEYPAIR = Keypair.generate();
    const { lastValidBlockHeight, blockhash } =
      await CONNECTION.getLatestBlockhash();
    const tx = new Transaction();
    const lamports = await CONNECTION.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );
  
    const makerATA = getAssociatedTokenAddressSync(
      MINT_KEYPAIR.publicKey,
      MY_KEYPAIR.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    tx.instructions = [
      SystemProgram.createAccount({
        fromPubkey: MY_KEYPAIR.publicKey,
        newAccountPubkey: MINT_KEYPAIR.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        MINT_KEYPAIR.publicKey,
        6,
        MY_KEYPAIR.publicKey,
        MY_KEYPAIR.publicKey,
        TOKEN_PROGRAM_ID
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        MY_KEYPAIR.publicKey,
        makerATA,
        MY_KEYPAIR.publicKey,
        MINT_KEYPAIR.publicKey,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      ),
      createMintToCheckedInstruction(
        MINT_KEYPAIR.publicKey,
        makerATA,
        MY_KEYPAIR.publicKey,
        1000 * 10 ** 6,
        6,
        undefined,
        TOKEN_PROGRAM_ID
      ),
    ];
    tx.feePayer = MY_KEYPAIR.publicKey;
    tx.recentBlockhash = blockhash;
  
    tx.sign(MY_KEYPAIR, MINT_KEYPAIR);
  
    const serialized = tx.serialize();
  
    const txHash = await CONNECTION.sendRawTransaction(serialized);
  
    console.log(txHash);
    //   Steps
    // 1. Mint Account
    // 2. Token Account
    // 3. Minting / Create Supply
  })();