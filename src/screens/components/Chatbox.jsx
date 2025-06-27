import { Box } from "@mui/material";
import React from "react";

const ChatBot = () => {
  return (
    <Box
      sx={{
        width: 680,
        height: 1080,
        bgcolor: "#1976d2", // MUI default blue color
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        src={blueRobotMascotLogoIconDesign675467551Traced}
        alt="Blue robot mascot"
        sx={{
          width: 262,
          height: 262,
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

export default ChatBot;
