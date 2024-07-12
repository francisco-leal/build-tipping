"use client";
import {
  Button,
  Modal,
  ModalClose,
  Typography,
  ModalDialog,
  Box,
} from "@mui/joy";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useAccount } from "wagmi";

type Props = {
  open: boolean;
  close: () => void;
  displayName: string;
  address: string;
};

export function QRCodeModal({ open, close, displayName, address }: Props) {
  const [code, setCode] = useState<string>();
  const [url, setUrl] = useState<string>("");
  const [loadingCode, setLoadingCode] = useState(false);

  useEffect(() => {
    if (!address) return;
    const existingCode = new URLSearchParams(window.location.search).get(
      "code"
    );
    if (existingCode) {
      setCode(existingCode);
      return;
    }

    try {
      fetch(`/api/code?owner=${address}`)
        .then((r) => r.json())
        .then(({ code }) => setCode(code));
    } catch {
      alert("We couldn't generate a one time code for you to share");
    }
  }, [address]);

  useEffect(() => {
    if (code) {
      setUrl(
        window.location.origin + window.location.pathname + `?code=${code}`
      );
    } else {
      setUrl(window.location.origin + window.location.pathname);
    }
  }, [code]);

  const refreshCode = () => {
    if (loadingCode) return;
    setLoadingCode(true);
    try {
      fetch(`/api/code?owner=${address}`)
        .then((r) => r.json())
        .then(({ code }) => {
          setLoadingCode(false);
          setCode(code);
        });
    } catch {
      setLoadingCode(false);
      alert("We couldn't generate a one time code for you to share");
    }
  };

  return (
    <Modal
      aria-labelledby="claim-build"
      aria-describedby="claim-build"
      open={open}
      onClose={() => close}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <ModalDialog
        variant="outlined"
        layout="fullscreen"
        sx={{
          maxWidth: 500,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          gap: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} onClick={() => close()} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Scan to claim $BUILD
        </Typography>
        <Typography id="modal-desc" textColor="text.tertiary">
          Scan this QR code to claim a $BUILD Tip and a Nomination from
          {displayName}.
        </Typography>
        {url !== "" && (
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={url}
            viewBox={`0 0 256 256`}
          />
        )}
        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "row",
            justifySelf: "end",
            width: "100%",
            gap: 2,
          }}
        >
          <Button
            onClick={() => close()}
            sx={{
              borderRadius: "12px",
              border: "2px solid var(--neutral-800, #171A1C)",
              background: "#FCFAF4",
              boxShadow: "2px 2px 0px 0px #000",
              width: "100%",
              ":disabled": {
                boxShadow: "0px 0px 0px 0px #000",
              },
              ":hover": {
                background: "#F6D254",
                textDecoration: "none",
              },
            }}
          >
            <Typography
              level="body-sm"
              sx={{ color: "#0B0D0E", fontSize: "10px" }}
            >
              Close
            </Typography>
          </Button>
          <Button
            onClick={() => refreshCode()}
            sx={{
              borderRadius: "12px",
              border: "2px solid #171A1C",
              background: "#F6D254",
              boxShadow: "2px 2px 0px 0px #000",
              width: "100%",
              ":disabled": {
                backgroundColor: "#F6D254",
              },
              ":hover": {
                background: "#FBE555",
                textDecoration: "none",
              },
            }}
            loading={loadingCode}
          >
            <Typography
              level="body-sm"
              sx={{ color: "#0B0D0E", fontSize: "10px" }}
            >
              {loadingCode ? "Generating new code.." : "Refresh code"}
            </Typography>
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
