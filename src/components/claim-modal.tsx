"use client";
import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Modal,
  ModalClose,
  Typography,
  ModalDialog,
  Box,
  Avatar,
  Link,
} from "@mui/joy";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  close: () => void;
  identifier: string;
  tipperUsername: string;
};
export function ClaimModal({ open, close, identifier, tipperUsername }: Props) {
  const [ens, setEns] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [code, setCode] = useState<string>();
  const [codeType, setCodeType] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const urlCode = new URLSearchParams(window.location.search).get("code");

    if (urlCode) {
      setCode(urlCode || "");
      setCodeType("qrcode");
      router.replace(window.location.pathname, undefined);
    } else {
      const iykCode = new URLSearchParams(window.location.search).get("iykRef");
      setCodeType("iyk");
      setCode(iykCode || "");
    }
  }, []);

  const claimBuild = () => {
    setClaiming(true);

    fetch(`/api/nominate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": code || "",
      },
      body: JSON.stringify({
        nominator: identifier,
        ens,
        codeType,
      }),
    })
      .then((r) => {
        if (r.status === 200) {
          setSuccess(true);
          setClaiming(false);
          return r.json();
        } else {
          setClaiming(false);
          return r.json();
        }
      })
      .then(({ hash, message }) => {
        if (hash) {
          setTxHash(hash);
        } else {
          alert(message);
        }
      });
  };

  const shareOnFarcaster = () => {
    window.open(
      `https://warpcast.com/~/compose?text=I just received an IRL tip of 100K $BUILD from @${tipperUsername} in Brussels!&embeds%5B%5D=https://tip.build.top/`
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
          sx={(theme) => ({
            [theme.breakpoints.only("xs")]: {
              top: "unset",
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: "none",
              maxWidth: "unset",
            },
          })}
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
              marginBottom: 4,
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
                ":hover": {
                  background: "#F6D254",
                  textDecoration: "none",
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
                ":hover": {
                  background: "#FBE555",
                  textDecoration: "none",
                },
              }}
              loading={claiming}
            >
              <Typography
                level="body-sm"
                sx={{ color: "#0B0D0E", fontSize: "10px" }}
              >
                {claiming ? "" : "Claim"}
              </Typography>
            </Button>
          </Box>
        </ModalDialog>
      ) : (
        <ModalDialog
          variant="outlined"
          sx={(theme) => ({
            [theme.breakpoints.only("xs")]: {
              top: "unset",
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: "none",
              maxWidth: "unset",
            },
            display: "flex",
            alignItems: "center",
          })}
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
            Congratulations 🫡
          </Typography>
          <Typography
            id="modal-desc"
            textColor="text.tertiary"
            textAlign={"center"}
          >
            You successfully claimed 100K $BUILD, and received a BUILD
            nomination from {tipperUsername}.
          </Typography>
          {txHash && (
            <Typography
              id="modal-desc"
              textColor="text.tertiary"
              textAlign={"center"}
            >
              View{" "}
              <Link
                target="_blank"
                href={`https://sepolia.basescan.org/tx/${txHash}`}
              >
                transaction
              </Link>
            </Typography>
          )}
          <Box
            sx={{
              marginTop: "42px",
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
                ":hover": {
                  background: "#FBE555",
                  textDecoration: "none",
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
