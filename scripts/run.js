const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();

    console.log("NFT Contract deployed to ", nftContract.address);

    let nftTxn = await nftContract.makeAnEpicNFT();
    await nftTxn.wait();

    let totalMinted = await nftContract.getTotalMintedNFTs();
    console.log("Total Minted: ", totalMinted.toNumber());


    nftTxn = await nftContract.makeAnEpicNFT();
    await nftTxn.wait();

    totalMinted = await nftContract.getTotalMintedNFTs();
    console.log("Total Minted: ", totalMinted.toNumber());

};
const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();