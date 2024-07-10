"use client";
import { useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function TipPage() {
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push(`/tip/${address}`);
    }
  }, [address]);

  return (
    <Box
      component="main"
      sx={{ minHeight: "100vh", backgroundColor: "white", padding: "16px" }}
    >
      <Box
        sx={{
          borderRadius: "40px",
          border: "2px solid #171A1C",
          background: "#A18CDE",
          minWidth: "100%",
          minHeight: "calc(100vh - 32px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "40px",
        }}
      >
        <Typography
          level="body-md"
          sx={{
            color: "#FBE555",
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: "500",
            lineHeight: "135%",
            letterSpacing: "-0.5px",
            marginBottom: "12px",
          }}
        >
          Talent Protocol presents
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
            paddingX: "16px",
          }}
        >
          <Typography
            level="h1"
            sx={{
              color: "#FBFCFE",
              textAlign: "center",
              fontSize: "40px",
              fontWeight: 400,
              lineHeight: "48px",
              letterSpacing: "-2px",
            }}
          >
            $BUILD Tipping
          </Typography>
          <w3m-button />
          <Typography level="body-md" textAlign={"center"} textColor="white">
            Connect your wallet to receive your QRCode and start tipping
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
