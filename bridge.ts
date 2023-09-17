import { ethers, BigNumber } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const contractABI = [
  {
    name: "depositEth",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];
// Load private keys from private_keys.txt
const privateKeys = fs.readFileSync('private_keys.txt', 'utf-8').split('\n').map(key => key.trim()).filter(Boolean);

// Ethereum RPC and contract addresses with default values
const ethRpc = process.env.ETH_SEPOLIA_RPC || 'https://endpoints.omniatech.io/v1/eth/sepolia/public'; // Default RPC URL
const ethContractAddress = process.env.ARB_SEPOLIA_INBOX_ROUTER || '0xaAe29B0366299461418F5324a79Afc425BE5ae21'; // Default contract address

// Arbitrum RPC and contract addresses with default values
const arbRpc = process.env.ARB_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc'; // Default RPC URL
const arbContractAddress = process.env.ARB_STYLUS_INBOX_ROUTER || '0xe1e3b1CBaCC870cb6e5F4Bdf246feB6eB5cD351B'; // Default contract address

// Ethereum Sepolia explorer URL
const EXP_ETH_SEPOLIA = process.env.EXP_ETH_SEPOLIA || 'https://sepolia.etherscan.io'; // Default Arbitrum Sepolia Explorer URL
// Arbitrum Sepolia explorer URL
const EXP_ARB_SEPOLIA = process.env.EXP_ARB_SEPOLIA || 'https://sepolia-explorer.arbitrum.io'; // Default Arbitrum Sepolia Explorer URL

// Define gasLimit, maxFeePerGas, and maxPriorityFeePerGas here
const gasLimit = ethers.BigNumber.from('120000');
const maxFeePerGas = ethers.BigNumber.from('3000000000');
const maxPriorityFeePerGas = ethers.BigNumber.from('250000000');

// Function to send ETH to the contract using the depositEth function
async function sendEthToContract(privateKey: string, rpcUrl: string, ContractAddress: string, sendAmount: ethers.BigNumber, exp_url: string) {
  // Create a provider with the provided RPC URL
  const ethProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const wallet = new ethers.Wallet(privateKey, ethProvider);

  try {
    // Corrected ABI to call the 'depositEth' function
    const contract = new ethers.Contract(ContractAddress, contractABI, wallet);

    const nonce = await wallet.getTransactionCount();

    // Transaction data
    const tx = await contract.depositEth({
      value: sendAmount, // Send ETH amount as a BigNumber
      gasLimit: gasLimit, // Gas limit as a BigNumber
      maxFeePerGas: maxFeePerGas, // Max fee per gas as a BigNumber
      maxPriorityFeePerGas: maxPriorityFeePerGas, // Max priority fee per gas as a BigNumber
      nonce: nonce, // Nonce as a regular number

    });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    if (receipt.status === 0) {
      // Transaction failed (reverted)
      console.error(`⛔ Transaction reverted. Error message:\n ${receipt.logs[0]?.data}`);
    } else {
      console.log(`Sent ${ethers.utils.formatEther(sendAmount)} ETH from ${wallet.address} to the contract: 📃 ${ContractAddress} `);
      console.log(`View on Blockchain explorer: ${exp_url}/tx/${tx.hash}`);
      if (exp_url === EXP_ETH_SEPOLIA) {
        console.log("✅ Successfully Bridged to Arbitrum Sepolia");
      } else {
        console.log("✅ Successfully Bridged to Arbitrum Stylus");
      }
    }
  } catch (error) {
    console.error(`❌ Error sending ETH from address ${wallet.address} to the contract: 📃 ${ContractAddress}`);
  }

}
// Function to sleep for a specified duration in milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function sendEth(ethValue: BigNumber) {
  for (const privateKey of privateKeys) {
    let explorer: string = EXP_ETH_SEPOLIA;
    await sendEthToContract(privateKey, ethRpc, ethContractAddress, ethValue, explorer).catch((error) => {
      console.error('❌ Error bridge ETH via contract: 📃 ${contractAddress}', error);
    });
  }

  // Wait for the first cycle to complete before starting the second one with a delay of 6000 ms
  await new Promise((resolve) => setTimeout(resolve, 6000));

  for (const privateKey of privateKeys) {
    let explorer: string = EXP_ARB_SEPOLIA;
    await sendEthToContract(privateKey, arbRpc, arbContractAddress, ethValue, explorer).catch((error) => {
      console.error('❌ Error sending ETH to the contract: 📃 ${contractAddress}', error);
    });
  }
}



//sendEth();