// import bs58 from "bs58";
// import {Keypair, PublicKey, SystemProgram, Transaction,Connection, clusterApiUrl} from "@solana/web3.js"
// (async() => {
//     const CONNECTION = new Connection(clusterApiUrl("devnet"));

//     const privKey = "Qs36P6uJr2dcTvHKp6aQeKouRRVhMPAspzTJEYmUx9rwjVdNdTa9eEabvsyL1Uq13Wz7WjmbbHa9PBHkHGTNkR2";
//     const decoded = bs58.decode(privKey);

//     const myKeypair = Keypair.fromSecretKey(decoded);
//     console.log(myKeypair.publicKey);
//     console.log(myKeypair.secretKey);

//     const tx = new Transaction();
//     const newAccKeypair = Keypair.generate();
//     const rent = await CONNECTION.getMinimumBalanceForRentExemption(0);
//     tx.instructions = [
//         SystemProgram.createAccount({
//             fromPubkey: myKeypair.publicKey,
//             newAccountPubkey: newAccKeypair.publicKey,
//             lamports: rent,
//             space: 0,
//             programId: SystemProgram.programId
//         })];
    
//     const txHash = await CONNECTION.sendTransaction(tx, [myKeypair,newAccKeypair]);
//     console.log(txHash);
// })();

import bs58 from "bs58"
import {clusterApiUrl, Connection, Keypair, SystemProgram, Transaction} from "@solana/web3.js"

(async() => {
    const CONNECTION = new Connection(clusterApiUrl("devnet"));
    const { lastValidBlockHeight, blockhash } = await CONNECTION.getLatestBlockhash();

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

    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight
    tx.sign(myKeypair,newAccKeypair);
    tx.feePayer = myKeypair.publicKey;

    const txSerialized = tx.serialize();
    const txHash = await CONNECTION.sendRawTransaction(txSerialized);
    console.log(txHash);
})();