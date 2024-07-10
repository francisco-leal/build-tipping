import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Inter } from "next/font/google";

import { config } from "@/config";
import Web3ModalProvider from "@/context";
import "dotenv/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tip BUILD IRL",
  description: "Nominate your frens IRL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider initialState={initialState}>
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  );
}
