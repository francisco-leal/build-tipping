import { Box, Typography, Button, Link } from "@mui/joy";

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: "100vh",
        alignItems: "center",
        backgroundImage: "url('/main-background.svg')",
        backgroundColor: "#9d7ad3",
      }}
    >
      <Typography
        level="h1"
        textAlign={"center"}
        marginTop={2}
        sx={{ color: "white" }}
      >
        Hello, welcome to $BUILD tipping!
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          href="/tip"
          component={Link}
          sx={{
            borderRadius: "12px",
            border: "2px solid #171A1C",
            background: "#F6D254",
            boxShadow: "2px 2px 0px 0px #000",
            width: "100%",
          }}
        >
          <Typography level="body-md" sx={{ color: "#0B0D0E" }}>
            Tip
          </Typography>
        </Button>
        <Button
          href="/deposit"
          component={Link}
          sx={{
            borderRadius: "12px",
            border: "2px solid var(--neutral-800, #171A1C)",
            background: "#FCFAF4",
            boxShadow: "2px 2px 0px 0px #000",
            width: "100%",
          }}
        >
          <Typography level="body-md" sx={{ color: "#0B0D0E" }}>
            Deposit
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
