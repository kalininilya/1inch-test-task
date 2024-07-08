"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { ethers } from "ethers";
import Gradient from "@/components/Gradient";
import {
  MultiCallService,
  GasLimitService,
  ProviderConnector,
} from "@1inch/multicall";
import WalletCard from "@/components/WalletCard";
import TokenTable from "@/components/TokenTable";
import TransactionDialog from "@/components/TransactionDialog";
import SettingsDialog from "@/components/SettingsDialog";
import { EthersProviderConnector } from "@/lib/EthersProviderConnector";

const ABI_FUNCTIONS = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

const ROUTER_CONTRACT_ADDRESS = "0x111111125421ca6dc452d289314280a0f8842a65"; // Ethereum mainnet
const MULTICALL_CONTRACT_ADDRESS = "0x8d035edd8e09c3283463dade67cc0d49d6868063"; // Ethereum mainnet

const TOKEN_LIST = [
  "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Dai Stablecoin
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USD Coin
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Tether
  "0x514910771AF9Ca656af840dff83E8264EcF986CA", // ChainLink Token
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // Uniswap
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", // Aave Token
  "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", // Maker
  "0xc00e94Cb662C3520282E6f5717214004A7f26888", // Compound
  "0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4", // NEAR Protocol
];

interface TokenBalance {
  name: string;
  symbol: string;
  balance: string;
  allowance: string;
}

export default function Home() {
  const [tokens, setTokens] = useState<string[]>(TOKEN_LIST);
  const [address, setAddress] = useState<string>("");
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [multiCallService, setMultiCallService] =
    useState<MultiCallService | null>(null);
  const [gasLimitService, setGasLimitService] =
    useState<GasLimitService | null>(null);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isAddressValid, setIsAddressValid] = useState<boolean>(true);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] =
    useState<boolean>(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const connector = new EthersProviderConnector(provider);
        const multiCallService = new MultiCallService(
          connector as ProviderConnector,
          MULTICALL_CONTRACT_ADDRESS
        );
        const gasLimitService = new GasLimitService(
          connector as ProviderConnector,
          MULTICALL_CONTRACT_ADDRESS
        );
        setMultiCallService(multiCallService);
        setGasLimitService(gasLimitService);
      }
    };
    initProvider();
  }, []);

  useEffect(() => {
    if (
      address &&
      ethers.utils.isAddress(address) &&
      multiCallService &&
      gasLimitService
    ) {
      fetchBalances(address);
    }
  }, [address, multiCallService, gasLimitService, tokens]);

  const cleanString = (str: string): string => {
    return str.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  };

  const fetchBalances = async (userAddress: string) => {
    if (!multiCallService || !gasLimitService) return;

    const requests = tokens.flatMap((token) => [
      {
        to: token,
        data: new ethers.utils.Interface(ABI_FUNCTIONS).encodeFunctionData(
          "balanceOf",
          [userAddress]
        ),
        gas: 30000,
      },
      {
        to: token,
        data: new ethers.utils.Interface(ABI_FUNCTIONS).encodeFunctionData(
          "allowance",
          [userAddress, ROUTER_CONTRACT_ADDRESS]
        ),
        gas: 30000,
      },
      {
        to: token,
        data: new ethers.utils.Interface(ABI_FUNCTIONS).encodeFunctionData(
          "decimals"
        ),
        gas: 30000,
      },
      {
        to: token,
        data: new ethers.utils.Interface(ABI_FUNCTIONS).encodeFunctionData(
          "symbol"
        ),
        gas: 30000,
      },
      {
        to: token,
        data: new ethers.utils.Interface(ABI_FUNCTIONS).encodeFunctionData(
          "name"
        ),
        gas: 30000,
      },
    ]);

    try {
      const gasLimit = await gasLimitService.calculateGasLimit({
        maxGasLimit: 150000000,
        gasBuffer: 3000000,
      });
      const results = await multiCallService.callByGasLimit(requests, gasLimit);

      const newBalances: TokenBalance[] = tokens.map((token, index) => {
        const startIndex = index * 5;
        const balance = ethers.BigNumber.from(results[startIndex]);
        const allowance = ethers.BigNumber.from(results[startIndex + 1]);
        const decimals = parseInt(results[startIndex + 2]);
        const symbol = cleanString(
          ethers.utils.toUtf8String(results[startIndex + 3])
        );
        const name = cleanString(
          ethers.utils.toUtf8String(results[startIndex + 4])
        );

        return {
          name,
          symbol,
          balance: ethers.utils.formatUnits(balance, decimals),
          allowance: `${ethers.utils.formatUnits(
            allowance,
            decimals
          )} (${decimals})`,
        };
      });

      setBalances(newBalances);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsAddressValid(ethers.utils.isAddress(newAddress));
    if (ethers.utils.isAddress(newAddress)) {
      fetchBalances(newAddress);
    }
  };

  const connectWallet = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        setIsWalletConnected(true);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const disconnectWallet = () => {
    setAddress("");
    setBalances([]);
    setIsWalletConnected(false);
  };

  return (
    <div className="relative flex flex-col items-center p-24 min-h-screen">
      <Gradient />
      <WalletCard
        address={address}
        onAddressChange={handleAddressChange}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        isWalletConnected={isWalletConnected}
        onSendClick={() => setIsTransactionDialogOpen(true)}
        onSettingsClick={() => setIsSettingsDialogOpen(true)}
      />
      {(isWalletConnected || ethers.utils.isAddress(address)) && (
        <TokenTable balances={balances} />
      )}
      <TransactionDialog
        isOpen={isTransactionDialogOpen}
        onClose={() => setIsTransactionDialogOpen(false)}
        provider={provider}
        isWalletConnected={isWalletConnected}
      />
      <SettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
        tokens={tokens}
        setTokens={setTokens}
      />
    </div>
  );
}
