import { ethers } from "ethers";

export class EthersProviderConnector {
  constructor(private provider: ethers.providers.Web3Provider) {}

  contractEncodeABI(abi: any, address: string, method: string, params: any[]) {
    const contract = new ethers.Contract(address, abi, this.provider);
    return contract.interface.encodeFunctionData(method, params);
  }

  async ethCall(
    to: string,
    data: string,
    blockNumber: string | number = "latest"
  ) {
    return await this.provider.call({ to, data }, blockNumber);
  }

  decodeABIParameter(type: string, data: string) {
    return ethers.utils.defaultAbiCoder.decode([type], data)[0];
  }

  decodeABIParameterList(types: any[], data: string) {
    return ethers.utils.defaultAbiCoder.decode(types, data);
  }
}

// I was getting: "multicall chunck failed: TypeError: this.connector.contractEncodeABI is not a function error"
// when I tried to use the MultiCallService class with default ethers.js provider
// so i decided to just extend the class and added the missing functions here

// I took this web3 connector as an example: https://github.com/1inch/limit-order-protocol-utils/blob/master/src/connector/web3-provider.connector.ts
