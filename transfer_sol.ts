import bs58 from "bs58"
import {Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl} from "@solana/web3.js"

(async()=>{
    const CONNECTION = new Connection(clusterApiUrl("devnet"));
    const myPrivkey = "Qs36P6uJr2dcTvHKp6aQeKouRRVhMPAspzTJEYmUx9rwjVdNdTa9eEabvsyL1Uq13Wz7WjmbbHa9PBHkHGTNkR2";
    const decoded = bs58.decode(myPrivkey);
    const myKeypair = Keypair.fromSecretKey(decoded);

    const sendKeypair = Keypair.fromSecretKey(decoded);
    const receivePubkey = "ES6Pt68agYcG5wVaVPvQh8i3Jd3u6UifRXGtpRdgpptH";

    const tx = new Transaction()
    tx.instructions = [
        SystemProgram.transfer({
            fromPubkey: sendKeypair.publicKey,
            toPubkey: new PublicKey(receivePubkey) ,
            lamports: 0.05 * LAMPORTS_PER_SOL,
        })
    ]

    const txHash = await CONNECTION.sendTransaction(tx,[myKeypair]);
    console.log(txHash);


})();