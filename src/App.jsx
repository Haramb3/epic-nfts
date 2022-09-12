import React, {useEffect,useState} from 'react';
import {ethers} from 'ethers';
import './styles/App.css';
import githubLogo from './assets/iconmonstr-github-1.svg';
import myEpicNft from './utils/MyEpicNFT.json';

// Constants
const GITHUB_HANDLE = 'Haramb3';
const GITHUB_LINK = `https://github.com/${GITHUB_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS='0x3380cF8d21FFC0d9b88367F85e4258285B14f76F';

const options = {method: 'GET'};

const collection = fetch('https://testnets-api.opensea.io/api/v1/collection/randomnounsnft-wmalpqaaj1', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [mintCount,setMintCount] = useState(0);

  const getMintCount = async () => {
    try{
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        let mintCount = await connectedContract.getTotalMintedNFTs();
        console.log("Retrieved total mint count...", mintCount.toNumber());
        setMintCount(mintCount.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener()
    } else {
      console.log("No authorized account found");
    }
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
	    alert("You are not connected to the Rinkeby Test Network!");
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      setupEventListener()
    } catch (error) {
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  )

  useEffect(() => {
    checkIfWalletIsConnected();
    getMintCount();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Random Nouns NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <p className="mint-count">Minted: {mintCount}/{TOTAL_MINT_COUNT}</p>
          
<a href="https://testnets.opensea.io/collection/randomnounsnft-wmalpqaaj1">
<input type="button" className="opensea-button" value="View on OpenSea"></input></a>
          <p></p>
          
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div className="footer-container">
          <img alt="Github Logo" className="github-logo" src={githubLogo} />
          <a
            className="footer-text"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${GITHUB_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;