
import bs58 from "bs58"
import {clusterApiUrl, Connection, Keypair, SystemProgram, Transaction} from "@solana/web3.js"

(async() => {
    const CONNECTION = new Connection(clusterApiUrl("devnet"));

    const myPrivkey = "Qs36P6uJr2dcTvHKp6aQeKouRRVhMPAspzTJEYmUx9rwjVdNdTa9eEabvsyL1Uq13Wz7WjmbbHa9PBHkHGTNkR2";
    const myKeypair = Keypair.fromSecretKey(bs58.decode(myPrivkey));

    const newAccKeypair = Keypair.generate();
    const tx = new Transaction();
    tx.instructions = [
        SystemProgram.createAccount({
            fromPubkey: myKeypair.publicKey,
            newAccountPubkey: newAccKeypair.publicKey,
            lamports: await CONNECTION.getMinimumBalanceForRentExemption(0) ,
            space: 0,
            programId: SystemProgram.programId,
        })
    ]

    const { lastValidBlockHeight, blockhash } = await CONNECTION.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight
    tx.sign(myKeypair,newAccKeypair);
    tx.feePayer = myKeypair.publicKey;

    const txSerialized = tx.serialize();
    const txHash = await CONNECTION.sendRawTransaction(txSerialized);
    console.log(txHash);
})();