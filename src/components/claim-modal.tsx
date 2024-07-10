"use client";
import { useState } from "react";
import {
  Input,
  Button,
  Modal,
  ModalClose,
  Typography,
  ModalDialog,
  Box,
  Avatar,
} from "@mui/joy";

type Props = {
  open: boolean;
  close: () => void;
  identifier: string;
};
export function ClaimModal({ open, close, identifier }: Props) {
  const [ens, setEns] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess] = useState(false);

  const claimBuild = () => {
    setClaiming(true);

    fetch(`/api/nominate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "123", // @TODO: replace with token from cards
      },
      body: JSON.stringify({
        nominator: identifier,
        ens,
      }),
    }).then((r) => {
      if (r.status === 200) {
        setSuccess(true);
        setClaiming(false);
      } else {
        setClaiming(false);
        alert("We couldn't process this nomination");
      }
    });
  };

  const shareOnFarcaster = () => {
    window.open(
      `https://warpcast.com/~/compose?text=I just got nominated IRL!&embeds%5B%5D=https://tip.build.top/`
    );
  };

  return (
    <Modal
      aria-labelledby="claim-build"
      aria-describedby="claim-build"
      open={open}
      onClose={() => close}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      {!success ? (
        <ModalDialog
          variant="outlined"
          layout="fullscreen"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            gap: 2,
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Claim 100k $BUILD
          </Typography>
          <Typography id="modal-desc" textColor="text.tertiary">
            $BUILD is a token of appreciation to reward onchain builders.
          </Typography>
          <Input
            placeholder="Type your ENS or wallet address"
            value={ens}
            onChange={(e) => setEns(e.target.value)}
            sx={{
              "--Input-focusedHighlight": "black",
            }}
          />
          <Box
            sx={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "row",
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
              }}
              disabled={claiming}
            >
              <Typography
                level="body-sm"
                sx={{ color: "#0B0D0E", fontSize: "10px" }}
              >
                Cancel
              </Typography>
            </Button>
            <Button
              onClick={() => claimBuild()}
              sx={{
                borderRadius: "12px",
                border: "2px solid #171A1C",
                background: "#F6D254",
                boxShadow: "2px 2px 0px 0px #000",
                width: "100%",
                ":disabled": {
                  backgroundColor: "#F6D254",
                },
              }}
              loading={claiming}
            >
              <Typography
                level="body-sm"
                sx={{ color: "#0B0D0E", fontSize: "10px" }}
              >
                {claiming ? "" : "Claim 100k $BUILD"}
              </Typography>
            </Button>
          </Box>
        </ModalDialog>
      ) : (
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
          <Avatar
            sx={{ marginTop: "auto", width: "96px", height: "96px" }}
            src="/check.svg"
          ></Avatar>
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Congratulations
          </Typography>
          <Typography
            id="modal-desc"
            textColor="text.tertiary"
            textAlign={"center"}
          >
            You&apos;ve just successfully claimed 100k BUILD and got nominated!
          </Typography>
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
              }}
            >
              <Typography level="body-sm" sx={{ color: "#0B0D0E" }}>
                Close
              </Typography>
            </Button>
            <Button
              onClick={() => shareOnFarcaster()}
              sx={{
                borderRadius: "12px",
                border: "2px solid #171A1C",
                background: "#F6D254",
                boxShadow: "2px 2px 0px 0px #000",
                width: "100%",
                ":disabled": {
                  backgroundColor: "#F6D254",
                },
              }}
            >
              <Typography level="body-sm" sx={{ color: "#0B0D0E" }}>
                Share
              </Typography>
            </Button>
          </Box>
        </ModalDialog>
      )}
    </Modal>
  );
}
