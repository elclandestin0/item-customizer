
import { ethers } from 'ethers';
import ERC1155_ABI from './abi/ERC1155.json';

const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const HARDHAT_URL = "http://127.0.0.1:8545";

let contractInstance: ethers.Contract | null = null;

export const getTokenContract = () => {
  if (!contractInstance) {
    const provider = new ethers.JsonRpcProvider(HARDHAT_URL);
    
    // Create the contract instance
    contractInstance = new ethers.Contract(
      CONTRACT_ADDRESS,
      ERC1155_ABI,
      provider
    );
  }
  return contractInstance;
};

// Optional: Function to get a signer instance for transactions
export const getTokenContractWithSigner = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      ERC1155_ABI,
      signer
    );
  }
  
  throw new Error("Please install MetaMask!");
}; 
