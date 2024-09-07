import bs58 from "bs58";
import {Keypair, PublicKey, SystemProgram, Transaction,Connection, clusterApiUrl, LAMPORTS_PER_SOL} from "@solana/web3.js"
(async() => {
    const CONNECTION = new Connection(clusterApiUrl("devnet"));

    const privKey = "Qs36P6uJr2dcTvHKp6aQeKouRRVhMPAspzTJEYmUx9rwjVdNdTa9eEabvsyL1Uq13Wz7WjmbbHa9PBHkHGTNkR2";
    const decoded = bs58.decode(privKey);

    const myKeypair = Keypair.fromSecretKey(decoded);
    console.log(myKeypair.publicKey);
    console.log(myKeypair.secretKey);

    const tx = new Transaction();
    tx.instructions = [
        SystemProgram.transfer({
            fromPubkey: myKeypair.publicKey,
            toPubkey: new PublicKey("ES6Pt68agYcG5wVaVPvQh8i3Jd3u6UifRXGtpRdgpptH"),
            lamports: 0.05 * LAMPORTS_PER_SOL,
            programId: SystemProgram.programId,
        })];
    
    const txHash = await CONNECTION.sendTransaction(tx, [myKeypair]);
    console.log(txHash);
})();