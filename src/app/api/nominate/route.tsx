import type { NextRequest } from "next/server";
import { ethers } from "ethers";
import { erc20Abi } from "viem";
import Moralis from "moralis";
import { http, createWalletClient, getContract, parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

type CreateNominateData = {
  nominator: string;
  ens: string;
};

const privateKey = process.env.TIPPING_WALLET_PRIVATE_KEY;
const baseRPC = process.env.BASE_RPC_URL;
const buildAddress = process.env
  .NEXT_PUBLIC_BUILD_TOKEN_ADDRESS as `0x${string}`;
const AMOUNT_TO_TRANSFER = "100000";
const moralisApiKey = process.env.MORALIS_API_KEY;

Moralis.start({
  apiKey: moralisApiKey,
});

export const maxDuration = 60;
export async function POST(request: NextRequest) {
  if (!privateKey || !baseRPC || !buildAddress) {
    return Response.json({ message: "Unable to tip" }, { status: 500 });
  }

  const authHeader = request.headers.get("x-api-key");
  // @TODO: verify card token
  console.log("Auth header: ", authHeader);

  const { nominator, ens } = (await request.json()) as CreateNominateData;

  const response = await Moralis.EvmApi.resolve.resolveENSDomain({
    domain: ens,
  });
  const { address: recipient } = response?.toJSON() || { address: null };
  console.log("Recipient: ", recipient);

  // @TODO: verify if builder was already nominated

  const account = privateKeyToAccount(`0x${privateKey}`);
  const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(baseRPC),
  });

  const contract = getContract({
    address: buildAddress,
    abi: erc20Abi,
    client,
  });
  const balance = await contract.read.balanceOf([account.address]);

  if (!recipient) {
    return Response.json(
      { message: "We couldn't find this ENS" },
      { status: 404 }
    );
  }

  if (balance < parseEther(AMOUNT_TO_TRANSFER)) {
    return Response.json({ message: "Insufficient balance" }, { status: 400 });
  }

  const result = await contract.write.transfer([
    recipient as `0x${string}`,
    parseEther(AMOUNT_TO_TRANSFER),
  ]);
  console.log("SENT 100k $BUILD VIA: ", result);

  return Response.json({ hash: result }, { status: 200 });
}
