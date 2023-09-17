import { BigNumber, ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const mintABI = [
  {
    type: "function",
    stateMutability: "payable",
    outputs: [],
    name: "mint",
    inputs: [
      {
        type: "uint256",
        name: "_mintAmount",
        internalType: "uint256",
      },
    ],
  },
];

// Load private keys from private_keys.txt
const privateKeys = fs.readFileSync('private_keys.txt', 'utf-8').split('\n').map(key => key.trim()).filter(Boolean);
// Arbitrum Stylus Testnet RPC and contract addresses with default values
const stylusRpc = process.env.STYLUS_TESTNET_RPC || 'https://stylus-testnet.arbitrum.io/rpc'; // Default RPC URL
const stylusContractAddress = process.env.STYLUS_OMNIBASE_CONTRACT || '0xA02573c4Ad15c16b48f10842aaC9c9eA405B65A3'; // Default contract address
// Arbitrum Stylus explorer URL
const EXP_STL_ARBITRUM = process.env.EXP_STL_ARBITRUM || 'https://stylus-testnet-explorer.arbitrum.io'; // Default Arbitrum Sepolia Explorer URL



let exp_url = EXP_STL_ARBITRUM
// Function to send ETH to the contract using the mint function
async function mintNFT(privateKey: string, rpcUrl: string, contractAddress: string, mintAmount: ethers.BigNumber) {
  // Create a provider with the provided RPC URL
  const ethProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const wallet = new ethers.Wallet(privateKey, ethProvider);

  try {
    // Create a contract instance with the mint ABI
    const contract = new ethers.Contract(contractAddress, mintABI, wallet);

    const nonce = await wallet.getTransactionCount();
    
    // Define gasLimit, maxFeePerGas, and maxPriorityFeePerGas mint cost here
    const maxFeePerGas = ethers.BigNumber.from('1650000000'); // 1.62 Gwei
    const maxPriorityFeePerGas = ethers.BigNumber.from('1000000000'); // 1 Gwei
    const gasLimit = ethers.BigNumber.from('800000'); // Adjust as needed
    const additionalValue = ethers.utils.parseEther('0.00023'); // Additional value in ETH
    // Calculate the total value to send (including gas fees)
    const gasFee = maxFeePerGas.mul(gasLimit);
    const priorityFee = maxPriorityFeePerGas.mul(gasLimit);
    const totalValue = gasFee.add(priorityFee).add(additionalValue);
    //const mintAmount = ethers.BigNumber.from('1'); // Set count of NFT
    const tx = await contract.mint(mintAmount,{
        value: ethers.BigNumber.from(totalValue), // Send the total value
        gasLimit: gasLimit,
        maxFeePerGas: maxFeePerGas, // Set gas price here
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        nonce: nonce,
    });

    const receipt = await tx.wait();

    if (receipt.status === 0) {
      // Transaction failed (reverted)
      console.error(`⛔ Transaction reverted. Error message:\n ${receipt.logs[0]?.data}`);
    } else {
      console.log(`✅ Successfuly minted ${ethers.utils.formatUnits(mintAmount, 0)} NFTs from ${wallet.address} to the contract: 📃 ${contractAddress}`);

      console.log(`View on Blockchain explorer: ${exp_url}/tx/${tx.hash}`);
    }
  } catch (error) {
    console.error(`❌ Error minting NFT from address ${wallet.address} to the contract: 📃 ${contractAddress}\n`,error);
  }
}

// Function to sleep for a specified duration in milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//const mintAmount = ethers.BigNumber.from('1'); // Set count of NFT

// Call the function to mint NFTs
export async function mintNFTs(mintAmount:BigNumber) {
  for (const privateKey of privateKeys) {
    await mintNFT(privateKey, stylusRpc, stylusContractAddress, mintAmount).catch((error) => {
      console.error('❌ Error minting NFT:', error);
    });
  }

  sleep(5000);
}
//mintNFTs();
