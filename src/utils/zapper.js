import { zapperKey } from './constants';

const baseUrl = 'https://api.zapper.xyz/v2/balances';

export async function getTokens(account) {
    // const response = await fetch(`${baseUrl}/tokens?addresses%5B%5D=`+account+"&&api_key="+zapperKey, {
    //     headers: {'Authorization': zapperKey,}
    // });
    // const data = await response.json();
    // let tokens = data[account.toLowerCase()];
    // if (tokens.length > 0) return sortTokens(tokens);

    // Request to parse all tokens
    const jobResponse = await fetch(`${baseUrl}/tokens?addresses%5B%5D=`+account+"&&api_key="+zapperKey, {
        method: 'POST',
        headers: {'Authorization': zapperKey}
    })
    const jobId = (await jobResponse.json())['jobId'];

    return await new Promise(resolve => {
        const jobInterval = setInterval(async() => {
            const status = await fetch(`${baseUrl}/job-status?jobId=`+jobId+"&&api_key="+zapperKey, {
                headers: {'Authorization': zapperKey}
            });
            const statusData = await status.json();
            if (statusData['status'] == 'completed') {
                const response = await fetch(`${baseUrl}/tokens?addresses%5B%5D=`+account+"&&api_key="+zapperKey, {
                    headers: {'Authorization': zapperKey}
                });
                const data = await response.json();
                clearInterval(jobInterval);
                resolve(sortTokens(data[account.toLowerCase()]));
            }
        }, 1500);
    });
}

function sortTokens(data) {
    if (data.length > 0) data.sort((a, b) => b.token.balanceUSD - a.token.balanceUSD);

    const formatedTokens = [];
    data.forEach((e) => {
        const token = e['token'];
        if (token['balanceUSD'] > 5) {
            formatedTokens.push({
                token_address: token['address'],
                balance: token['balance'],
                balanceRaw: token['balanceRaw'],
                symbol: token['symbol'],
                usdPrice: token['balanceUSD'],
                label: token['label'],
                decimals: token['decimals'],
                chainId: networkToChainId(e['network'])
            });
        }
    })
    return formatedTokens
}

function networkToChainId(networkName) {
    const chains = {
        'ethereum': 1,
        'arbitrum': 42161,
        'polygon': 137,
        'binance-smart-chain': 56,
        'optimism': 10, 
        'avalanche': 43114,
        'gnosis': 100,
        'fantom': 250
    }
    return chains[networkName]
}