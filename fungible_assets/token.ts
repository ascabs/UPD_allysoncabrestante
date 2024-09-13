import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js"
import bs58 from 'bs58'
import {createMint, getOrCreateAssociatedTokenAccount,mintTo} from "@solana/spl-token"

(async() => {
    const connection = new Connection(clusterApiUrl("devnet"));

    const myPrivkey = "Qs36P6uJr2dcTvHKp6aQeKouRRVhMPAspzTJEYmUx9rwjVdNdTa9eEabvsyL1Uq13Wz7WjmbbHa9PBHkHGTNkR2";
    const decoded = bs58.decode(myPrivkey);
    const myKeypair = Keypair.fromSecretKey(decoded);

    const tokenMint = await createMint(connection, myKeypair, myKeypair.publicKey, null, 2,);
    console.log(`Created token mint: ${tokenMint.toString()}`);

    const tokenMintAccount = new PublicKey("CDKu42aiRTjWwh2JsWkdQQy5HEzp7y8rcdiKSguUBK6m");
    const recipient = myKeypair.publicKey;
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, myKeypair, tokenMintAccount, recipient);
    console.log(`token account ${tokenAccount.address.toBase58()}`);

    const recipientAssociatedTokenAccount = new PublicKey("BULbDYaUVGAtvCcDTtFBhSHaei2p8pBHEYGYGtuAgHhR");
    
    const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10,2);
    const txHash = await mintTo(connection, myKeypair, tokenMintAccount, recipientAssociatedTokenAccount, myKeypair, 10 * MINOR_UNITS_PER_MAJOR_UNITS);
    console.log("txhash: ", txHash);

})();