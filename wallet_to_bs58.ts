import bs58 from "bs58";

(async() => {
    const privKey = "Qs36P6uJr2dcTvHKp6aQeKouRRVhMPAspzTJEYmUx9rwjVdNdTa9eEabvsyL1Uq13Wz7WjmbbHa9PBHkHGTNkR2";

    const decoded = bs58.decode(privKey);
    console.log(decoded);

    const encoded = bs58.encode(decoded);
    console.log(encoded);
})();