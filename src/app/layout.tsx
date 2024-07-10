import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Inter } from "next/font/google";

import { config } from "@/config";
import Web3ModalProvider from "@/context";
import "dotenv/config";

const inter = Inter({ subsets: ["latin"] });

const description = "Tip $BUILD to real builders during IRL events";

export const metadata: Metadata = {
  title: "Tip BUILD IRL",
  description: description,
  icons: ["/favicon.ico"],
  openGraph: {
    title: "BUILD",
    description: description,
    type: "website",
    url: "https://tip.build.top",
    images: [
      "https://build-top-images.s3.eu-west-2.amazonaws.com/build-tipping.png",
    ],
  },
  twitter: {
    title: "BUILD",
    description: description,
    images: [
      "https://build-top-images.s3.eu-west-2.amazonaws.com/build-tipping.png",
    ],
  },
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
