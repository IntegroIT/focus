import React, { useState, useEffect } from "react";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import { Box, IconButton } from "@mui/material";
import { keyframes, styled } from "@mui/system";

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const Ripple = styled("div")<{ stopAnimation: boolean }>(
  ({ stopAnimation }) => ({
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 255, 0.2)",
    animation: stopAnimation ? "none" : `${ripple} 2s linear infinite`,
    pointerEvents: "none",
  })
);

interface MicButtonProps {
  stopAnimation: boolean;
}

const MicButton: React.FC<MicButtonProps> = ({ stopAnimation }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
  };

  useEffect(() => {
    if (stopAnimation) {
      setIsActive(false);
    }
  }, [stopAnimation]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          position: "relative",
          width: 100,
          height: 100,
          backgroundColor: "white",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <MicRoundedIcon sx={{ fontSize: 50, color: "black" }} />
      </IconButton>
      {isActive && !stopAnimation ? (
        <>
          <Ripple
            stopAnimation={stopAnimation}
            sx={{ width: 200, height: 200, animationDelay: "0s" }}
          />
          <Ripple
            stopAnimation={stopAnimation}
            sx={{ width: 200, height: 200, animationDelay: "0.5s" }}
          />
          <Ripple
            stopAnimation={stopAnimation}
            sx={{ width: 200, height: 200, animationDelay: "1s" }}
          />
        </>
      ) : (
        <Ripple
          stopAnimation={stopAnimation}
          sx={{ width: 200, height: 200 }}
        />
      )}
    </Box>
  );
};

export default MicButton;
