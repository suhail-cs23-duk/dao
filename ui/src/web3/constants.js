import GovTokenABI from '../../../artifacts/contracts/Token.sol/GovToken.json';
import TimeLockABI from '../../../artifacts/contracts/TimeLock.sol/TimeLock.json';
import CertABI from '../../../artifacts/contracts/Certi.sol/Cert.json';
import GovernorABI from '../../../artifacts/contracts/Governer.sol/MyGovernor.json';

// Import addresses from your deployment file
import deployedAddresses from '../../../deployedAddresses.json';

export const CONTRACT_ADDRESSES = {
  GovToken: deployedAddresses.GovToken,
  TimeLock: deployedAddresses.TimeLock,
  Cert: deployedAddresses.Cert,
  MyGovernor: deployedAddresses.MyGovernor
};

export const CONTRACT_ABIS = {
  GovToken: GovTokenABI.abi,
  TimeLock: TimeLockABI.abi,
  Cert: CertABI.abi,
  MyGovernor: GovernorABI.abi
};
