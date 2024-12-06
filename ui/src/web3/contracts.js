import { BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from './constants';

export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask!");
  }
  return new BrowserProvider(window.ethereum);
};

export const connectWallet = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

export const getContracts = async (signer) => {
  const govToken = new Contract(CONTRACT_ADDRESSES.GovToken, CONTRACT_ABIS.GovToken, signer);
  const timeLock = new Contract(CONTRACT_ADDRESSES.TimeLock, CONTRACT_ABIS.TimeLock, signer);
  const cert = new Contract(CONTRACT_ADDRESSES.Cert, CONTRACT_ABIS.Cert, signer);
  const governor = new Contract(CONTRACT_ADDRESSES.MyGovernor, CONTRACT_ABIS.MyGovernor, signer);

  return {
    govToken,
    timeLock,
    cert,
    governor
  };
};
