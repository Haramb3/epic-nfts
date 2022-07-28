const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();

    console.log("NFT Contract deployed to ", nftContract.address);

    let nftTxn = await nftContract.makeAnEpicNFT();
    await nftTxn.wait();

    nftTxn = await nftContract.makeAnEpicNFT();
    await nftTxn.wait();

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