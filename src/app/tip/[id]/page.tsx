"use client";
import { useEffect, useState } from "react";
import { Box, Button, Typography, Avatar } from "@mui/joy";
import { ClaimModal } from "@/components/claim-modal";
import { QRCodeModal } from "@/components/qr-code-modal";
import { useAccount } from "wagmi";

type Passport = {
  passport_profile: {
    display_name: string;
    image_url: string;
    name: string;
  };
  score: number;
};

export default function TipPage({ params }: { params: { id: string } }) {
  const [passport, setPassport] = useState<Passport | null>();
  const [fetchingUser, setFetchingUser] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [timer, setTimer] = useState(60);
  const { address } = useAccount();

  useEffect(() => {
    if (params.id) {
      try {
        fetch(`https://api.talentprotocol.com/api/v2/passports/${params.id}`, {
          headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_PASSPORT_API_TOKEN || "",
          },
        })
          .then((r) => r.json())
          .then(({ passport }) => {
            setPassport(passport);
            setFetchingUser(false);
          });
      } catch {
        setFetchingUser(false);
      }
    }
  }, [params]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const ownerUser = address?.toLowerCase() === params.id.toLowerCase();

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
          {fetchingUser && <Button loading variant="plain" size="lg"></Button>}
          {!fetchingUser && !!passport && (
            <>
              <Box sx={{ position: "relative", marginBottom: "42px" }}>
                <Avatar
                  src={passport.passport_profile.image_url}
                  sx={{
                    borderRadius: "225px",
                    border: "2px solid var(--neutral-800, #171A1C)",
                    boxShadow: "2px 2px 0px 0px #000",
                    width: "200px",
                    height: "200px",
                  }}
                ></Avatar>
                <Button
                  sx={{
                    borderRadius: "12px",
                    border: "2px solid var(--neutral-800, #171A1C)",
                    background: "#FCFAF4",
                    boxShadow: "2px 2px 0px 0px #000",
                    width: "100%",
                    color: "black",
                    position: "absolute",
                    top: "170px",
                    right: "20px",
                    fontSize: "14px",
                    ":hover": {
                      background: "#FCFAF4",
                      textDecoration: "none",
                    },
                  }}
                >
                  {passport.passport_profile.display_name}
                </Button>
                <Button
                  sx={{
                    borderRadius: "12px",
                    border: "2px solid var(--neutral-800, #171A1C)",
                    background: "#FCFAF4",
                    boxShadow: "2px 2px 0px 0px #000",
                    width: "100%",
                    color: "black",
                    position: "absolute",
                    top: "200px",
                    right: "-40px",
                    fontSize: "14px",
                    ":hover": {
                      background: "#FCFAF4",
                      textDecoration: "none",
                    },
                  }}
                >
                  Builder Score {passport.score}
                </Button>
              </Box>
              {!ownerUser && (
                <>
                  <Button
                    onClick={() => setShowModal(true)}
                    sx={{
                      borderRadius: "12px",
                      border: "2px solid #171A1C",
                      background: "#F6D254",
                      boxShadow: "2px 2px 0px 0px #000",
                      width: "100%",
                      ":hover": {
                        background: "#FBE555",
                        textDecoration: "none",
                      },
                    }}
                    disabled={timer <= 0}
                  >
                    <Typography level="body-md" sx={{ color: "#0B0D0E" }}>
                      Claim $BUILD
                    </Typography>
                  </Button>
                  <Typography level="body-md" sx={{ color: "white" }}>
                    {timer > 0
                      ? `${passport.passport_profile.display_name} wants to reward you! You have ${timer} seconds to claim $BUILD.`
                      : `The code has expired.`}
                  </Typography>
                </>
              )}
              {ownerUser && (
                <Button
                  onClick={() => setShowQRCode(true)}
                  sx={{
                    borderRadius: "12px",
                    border: "2px solid var(--neutral-800, #171A1C)",
                    background: "#FCFAF4",
                    boxShadow: "2px 2px 0px 0px #000",
                    width: "100%",
                    ":hover": {
                      background: "#F6D254",
                      textDecoration: "none",
                    },
                  }}
                >
                  <Typography level="body-md" sx={{ color: "#0B0D0E" }}>
                    Share QRCode
                  </Typography>
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
      <ClaimModal
        open={showModal}
        close={() => setShowModal(false)}
        identifier={params.id}
        tipperUsername={passport?.passport_profile.name || params.id}
      />
      {!!ownerUser && (
        <QRCodeModal
          open={showQRCode}
          close={() => setShowQRCode(false)}
          address={address}
          displayName={passport?.passport_profile.display_name || params.id}
        />
      )}
    </Box>
  );
}
