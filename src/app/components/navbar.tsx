import { AppBar, Toolbar, Box, useMediaQuery, useTheme } from "@mui/material";
import { Divide as Hamburger } from "hamburger-react";
import Image from "next/image";

interface NavbarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export default function Navbar({ isOpen, setOpen }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // return (
  //   <AppBar
  //     sx={{
  //       // background: "#F5F6FA",
  //       background: "#FFF",
  //       boxShadow: "none",
  //       borderBottom: "1px solid #BDBDBD",
  //     }}
  //   >
  //     <Toolbar
  //       sx={{
  //         minHeight: 60,
  //         display: "flex",
  //       }}
  //     >
  //       {isMobile ? (
  //         <Box sx={{ display: "flex", alignItems: "center" }}>
  //           <Hamburger
  //             toggled={isOpen}
  //             toggle={() => setOpen(!isOpen)}
  //             color="#4B5563"
  //             rounded
  //           />
  //         </Box>
  //       ) : (
  //         <Box
  //           component="a"
  //           href="https://pdt.tools/"
  //           sx={{
  //             pr: 6,
  //             width: 255,
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //           }}
  //         >
  //           <Image src="/logo_gray.svg" alt="logo" width={125} height={50} />
  //         </Box>
  //       )}
  //     </Toolbar>
  //   </AppBar>
  // );

  return (
    <AppBar
      sx={{
        background: "#FFF",
        boxShadow: "none",
        borderBottom: "1px solid rgba(78, 12, 30, 0.2)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 60,
          display: "flex",
        }}
      >
        {isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Hamburger
              toggled={isOpen}
              toggle={() => setOpen(!isOpen)}
              color="#8E2041"
              rounded
            />
          </Box>
        ) : (
          <Box
            component="a"
            href="https://pdt.tools/"
            sx={{
              pr: 6,
              width: 255,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image src="/logo_red.svg" alt="logo" width={125} height={50} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
