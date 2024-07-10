import type { NextRequest } from "next/server";
import { erc20Abi } from "viem";
import Moralis from "moralis";
import { http, createWalletClient, getContract, parseEther } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { supabase } from "@/db";

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

  if (!authHeader) {
    return Response.json({ message: "This code has expired" }, { status: 401 });
  }

  const { nominator, ens } = (await request.json()) as CreateNominateData;

  const { data, error } = await supabase
    .from("one_time_codes")
    .update({ used: true })
    .eq("code", authHeader)
    .eq("owner", nominator.toLowerCase())
    .eq("used", false)
    .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
    .select("*")
    .single();

  if (error || data.code !== authHeader) {
    return Response.json({ message: "This code has expired" }, { status: 401 });
  }

  const response = await Moralis.EvmApi.resolve.resolveENSDomain({
    domain: ens,
  });
  let recipient;

  if (ens.length === 42 && ens[0] === "0" && ens[1] === "x") {
    recipient = ens;
  } else {
    const { address } = response?.toJSON() || { address: null };
    recipient = address;
  }

  if (!recipient) {
    return Response.json(
      { message: "We couldn't find this ENS" },
      { status: 404 }
    );
  }

  const { data: nominations, error: nominationsError } = await supabase
    .from("nominations")
    .select("*")
    .eq("origin_wallet", nominator.toLowerCase())
    .eq("destination_wallet", recipient.toLowerCase())
    .throwOnError();

  if (nominationsError || (nominations && nominations.length > 0)) {
    return Response.json(
      { message: "You already claimed from this user" },
      { status: 400 }
    );
  }

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

  if (balance < parseEther(AMOUNT_TO_TRANSFER)) {
    return Response.json({ message: "Insufficient balance" }, { status: 400 });
  }

  const result = await contract.write.transfer([
    recipient as `0x${string}`,
    parseEther(AMOUNT_TO_TRANSFER),
  ]);

  await supabase
    .from("nominations")
    .insert({
      origin_wallet: nominator.toLowerCase(),
      destination_wallet: recipient.toLowerCase(),
      tx_hash: result,
    })
    .throwOnError();

  return Response.json({ hash: result }, { status: 200 });
}
