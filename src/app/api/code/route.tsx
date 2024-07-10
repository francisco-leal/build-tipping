import type { NextRequest } from "next/server";
import { supabase } from "@/db";

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("owner") ?? undefined;
  const newSafeCode = crypto.randomUUID();

  if (!wallet) {
    return Response.json({ message: "Invalid wallet" }, { status: 400 });
  }

  const { error } = await supabase
    .from("one_time_codes")
    .insert({
      code: newSafeCode,
      owner: wallet.toLowerCase(),
      used: false,
    })
    .throwOnError();

  if (error) {
    return Response.json({ message: "Unable to create code" }, { status: 500 });
  }

  return Response.json({ code: newSafeCode }, { status: 200 });
}
