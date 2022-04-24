// helper/utils.ts
import {ethers} from 'ethers'; // npm install ethers
import * as config from '../config/config';
import * as ERC20Json from '../config/contracts/MyERC20MintableByAnyone.json';
import {BigNumber} from 'ethers';

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const hexToInt = (s: string) => {
  const bn = ethers.BigNumber.from(s);
  return parseInt(bn.toString());
};

export const reloadApp = () => {
  window.location.reload();
};

// Get the last block number
export const getLastBlockNumber = async (ethersProvider: any): Promise<any> => {
  return ethersProvider.getBlockNumber();
};

// Get the CRO balance of address
export const getCroBalance = async (
  serverWeb3Provider: ethers.providers.JsonRpcProvider,
  address: string,
): Promise<number> => {
  const balance = await serverWeb3Provider.getBalance(address);
  // Balance is rounded at 2 decimals instead of 18, to simplify the UI
  return ethers.BigNumber.from(balance).div(ethers.BigNumber.from('10000000000000000')).toNumber() / 100;
};

// Get the CTOK token balance of address
// The CTOK is a ERC20 smart contract, its address is retrieved from
// the config/config.ts file
// and the ABI from config/contracts/MyERC20MintableByAnyone.json
// export const getBalance = async (
//   serverWeb3Provider: ethers.providers.JsonRpcProvider,
//   address: string,
// ): Promise<number> => {
//   // Create ethers.Contract object using the smart contract's ABI
//   const contractAbi = ERC20Json.abi;
//   const readContractInstance = new ethers.Contract(config.configVars.erc20.address, contractAbi, serverWeb3Provider);
//   const contractResponse = await readContractInstance['balanceOf'](address);
//   // Balance is rounded at 2 decimals instead of 18, to simplify UI
//   return ethers.BigNumber.from(contractResponse).div(ethers.BigNumber.from('10000000000000000')).toNumber() / 100;
// };

// export const getBalance = async (
//   serverWeb3Provider: ethers.providers.JsonRpcProvider,
//   address: string,
// ): Promise<number> => {
//   const asset = {
//     name: 'USDC',
//     addr: '0xa0C3c184493f2Fae7d2f2Bd83F195a1c300FA353',
//     decimal: 6,
//   };
//   console.log('getAnothersBalance')
//   const accounts = ['0x408a6bd3c4fBC86A11DE0D4a21617eBFcab7d281']
//   const provider = new ethers.providers.JsonRpcProvider(
//     "https://evm.cronos.org"
//   );
//   const contractAbi = ERC20Json.abi;
//   let tokenContract;
//   let value;
//   tokenContract = new ethers.Contract(
//     '0xa0C3c184493f2Fae7d2f2Bd83F195a1c300FA353',
//     contractAbi,
//     provider
//   );
//   value = await tokenContract.balanceOf(accounts[0]);
//   const bigNum = BigNumber.from(value);
//   console.log({name: asset.addr, value: Number(ethers.utils.formatUnits(bigNum, 18))})
//   return Number(ethers.utils.formatUnits(bigNum, 18))
// };

export const getBalance = async (account: string, address: string, decimal: number): Promise<number> => {
  console.log({account, address, decimal});
  const provider = new ethers.providers.JsonRpcProvider('https://evm.cronos.org');
  const contractAbi = ERC20Json.abi;
  let tokenContract;
  let value;
  tokenContract = new ethers.Contract(address, contractAbi, provider);
  value = await tokenContract.balanceOf(account);
  const bigNum = BigNumber.from(value);
  // console.log({name: address, value: Number(ethers.utils.formatUnits(bigNum, decimal))})
  return Number(ethers.utils.formatUnits(bigNum, decimal));
};

// Generate a ethers.Contract instance of the contract object
// together with a signer that will trigger a transaction
// approval in the wallet whenever it is called by the Dapp
export const getWriteContractInstance = async (browserWeb3Provider: any): Promise<ethers.Contract> => {
  const ethersProvider = browserWeb3Provider;
  const contractAbi = ERC20Json.abi;
  // Create ethers.Contract object using the smart contract's ABI
  const readContractInstance = new ethers.Contract(config.configVars.erc20.address, contractAbi, ethersProvider);
  // Add a signer to make the ethers.Contract object able
  // to craft transactions
  const fromSigner = ethersProvider.getSigner();
  return readContractInstance.connect(fromSigner);
};

export const uniq = (array: any) => {
  return array.sort().filter(function (item: any, pos: any, ary: any) {
    return !pos || item !== ary[pos - 1];
  });
};
