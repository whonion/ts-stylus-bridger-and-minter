import { ethers, BigNumber } from 'ethers';
import { sendEth } from './bridge.js';
import { mintNFTs } from './mint.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function displayMenu() {
  console.log("Select action:");
  console.log("1. Bridge ETH from Ethereum Sepolia to Arbitrum Sepolia and next Bridge to Arbitrum Stylus Testnet");
  console.log("2. Mint Omnibase NFT to Arbitrum Stylus Test");
  console.log("0. Exit");
}

async function performAction(action: number) {
  switch (action) {
    case 1:
      rl.question("How many ETH do you want to send? ", async (amountETH) => {
        const ethValue = ethers.BigNumber.from(ethers.utils.parseEther(amountETH));
        console.log("🌐 Starting the script to bridge ETH via https://bridge.arbitrum.io");
        await sendEth(ethValue);
        console.log("ETH bridging complete.");
        continueMenu();
      });
      break;
    case 2:
      rl.question("How many NFTs do you want to mint? ", async (count) => {
        const mintAmount = ethers.BigNumber.from(count);
        console.log("🌐 Starting the script to mint NFT via https://power.omnibase.xyz/");
        await mintNFTs(mintAmount);
        console.log("NFT minting complete.");
        continueMenu();
      });
      break;
    case 0:
      console.log("Exiting...");
      rl.close();
      break;
    default:
      console.log("Invalid selection. Please enter the correct action.");
      continueMenu();
      break;
  }
}

async function continueMenu() {
  await displayMenu();

  rl.question("Enter your choice: ", (choice) => {
    const action = parseInt(choice);

    if (isNaN(action)) {
      console.log("Incorrect choice. Please enter the correct number.");
      continueMenu();
    } else {
      if (action === 0) {
        console.log("Exiting...");
        rl.close();
      } else {
        performAction(action);
      }
    }
  });
}

async function startMenu() {
  await continueMenu();
}

// Start menu
startMenu();
