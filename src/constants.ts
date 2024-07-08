export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
];

export const TOKENS = [
  {
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    chain: "Ethereum",
  },
  {
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    chain: "Ethereum",
  },
  {
    name: "Tether",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    chain: "Ethereum",
  },
  {
    name: "Wrapped Ether",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    chain: "Ethereum",
  },
  {
    name: "ChainLink Token",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    chain: "Ethereum",
  },
  {
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    chain: "Ethereum",
  },
  {
    name: "Aave Token",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    chain: "Ethereum",
  },
  {
    name: "Maker",
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    chain: "Ethereum",
  },
  {
    name: "Compound",
    address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    chain: "Ethereum",
  },
  {
    name: "Synthetix Network Token",
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    chain: "Ethereum",
  },
];

export const ROUTER_ADDRESS = "0x111111125421ca6dc452d289314280a0f8842a65";
export const MULTICALL_ADDRESS = "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441";
