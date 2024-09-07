import bs58 from "bs58";
import {Keypair, PublicKey, SystemProgram, Transaction,Connection, clusterApiUrl} from "@solana/web3.js"
(async() => {
    const CONNECTION = new Connection(clusterApiUrl("devnet"));

    const privKey = "Qs36P6uJr2dcTvHKp6aQeKouRRVhMPAspzTJEYmUx9rwjVdNdTa9eEabvsyL1Uq13Wz7WjmbbHa9PBHkHGTNkR2";
    const decoded = bs58.decode(privKey);

    const myKeypair = Keypair.fromSecretKey(decoded);
    console.log(myKeypair.publicKey);
    console.log(myKeypair.secretKey);

    const tx = new Transaction();
    const newAccKeypair = Keypair.generate();
    const rent = await CONNECTION.getMinimumBalanceForRentExemption(0);
    tx.instructions = [
        SystemProgram.createAccount({
            fromPubkey: myKeypair.publicKey,
            newAccountPubkey: newAccKeypair.publicKey,
            lamports: rent,
            space: 0,
            programId: SystemProgram.programId
        })];
    
    const txHash = await CONNECTION.sendTransaction(tx, [myKeypair,newAccKeypair]);
    console.log(txHash);
})();