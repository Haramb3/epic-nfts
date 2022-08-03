const main = async () => {
    const numNFTs = 10;
    const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);

    for (let index = 1; index < numNFTs; index++) {
        // Call the function.
        let txn = await nftContract.makeAnEpicNFT();
        // Wait for it to be mined.
        await txn.wait();
        console.log("Minted NFT %d", index);
    }
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