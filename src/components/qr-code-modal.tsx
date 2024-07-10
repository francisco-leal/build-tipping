"use client";
import {
  Button,
  Modal,
  ModalClose,
  Typography,
  ModalDialog,
  Box,
} from "@mui/joy";
import QRCode from "react-qr-code";

type Props = {
  open: boolean;
  close: () => void;
  displayName: string;
};

export function QRCodeModal({ open, close, displayName }: Props) {
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
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={window.location.href}
          viewBox={`0 0 256 256`}
        />
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
          >
            <Typography level="body-sm" sx={{ color: "#0B0D0E" }}>
              Close
            </Typography>
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
