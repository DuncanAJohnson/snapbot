import React from "react";
import { Box, Grid } from "@mui/material";
import { HorizontalButtons } from "../PatchButton";
import { StartButton, StopButton } from "./ControlButton";
import Stage from "./Stage";

interface GamePaneProps {
  hideControls?: boolean;
}

export const GamePane: React.FC<GamePaneProps> = ({ hideControls = false }) => {
    return <>
        {!hideControls && (
          <Grid item container className="assetHolder" sx={{
              paddingTop: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingBottom: "2px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
              borderColor: 'divider',
          }}>
              <HorizontalButtons>
                  <StartButton />
                  <StopButton />
              </HorizontalButtons>
          </Grid>
        )}
        <Box className="assetHolder" sx={{
            backgroundColor: 'panel.main',
            padding: "8px",
            borderLeftWidth: "1px",
            borderColor: 'divider',
        }}>
            <Box className="canvasBox" sx={{
                backgroundColor: 'panel.main',
                borderColor: 'divider',
                borderRadius: "8px",
                overflow: "clip",
            }}>
                <Stage />
            </Box>
        </Box>
    </>;
}