"use client";
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "@mui/joy";
import { erc20Abi } from "viem";
import { baseSepolia } from "viem/chains";
import { parseEther } from "viem";

const BUILD_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_BUILD_TOKEN_ADDRESS ||
  "0x0") as `0x${string}`;
const TIPPING_WALLET_PUBLIC_KEY = (process.env
  .NEXT_PUBLIC_TIPPING_WALLET_PUBLIC_KEY || "0x0") as `0x${string}`;

export default function DepositPage() {
  const { address } = useAccount();
  const [amount, setAmount] = useState(0);
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const deposit = async () => {
    await writeContract({
      abi: erc20Abi,
      address: BUILD_TOKEN_ADDRESS,
      functionName: "transfer",
      args: [TIPPING_WALLET_PUBLIC_KEY, parseEther("1")],
      chainId: baseSepolia.id,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <div className="flex flex-row items-center justify-content-center">
        <h1 className="text-4xl font-bold">Deposit!</h1>
        <w3m-button />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-lg">Deposit here</p>
        <Button onClick={deposit}>Deposit 1 $BUILD</Button>
      </div>
    </main>
  );
}
