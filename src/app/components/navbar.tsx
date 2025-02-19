import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Divide as Hamburger } from "hamburger-react";
import Image from "next/image";

interface NavbarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isOpen, setOpen }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      sx={{
        background: "#F5F6FA",
        minHeight: 60,
        height: 60,
        boxShadow: "none",
        borderBottom: "1px solid #BDBDBD",
      }}
    >
      <Toolbar sx={{ padding: 0 }}>
        {" "}
        {isMobile ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              paddingLeft: 2,
              paddingRight: 2,
            }}
          >
            <Hamburger
              toggled={isOpen}
              toggle={() => setOpen(!isOpen)}
              color="#0B0E14"
            />
          </Box>
        ) : (
          <Box
            component="a"
            href="https://pdt.tools/"
            width={250}
            justifyContent={"center"}
          >
            <Image src="/logo_gray.svg" alt="logo" width={125} height={50} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
