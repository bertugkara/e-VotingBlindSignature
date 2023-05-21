export const E_VOTING_CONTRACT_ADDRESS = "0x44d901301843ca2320C3D41AeBEDE4c72A676510"; //localhost Ganache Created Contract Address
export const Ganache_Localhost_Network_Params = {
    chainId: `0x539`, //1337
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: ['http://localhost:7545'],
    chainName: 'STORMY-DUCKS (Ganache)',
}
export const ROLE = {
    CONTRACT_OWNER: "CONTRACT_OWNER",
    VOTER: "VOTER",
}