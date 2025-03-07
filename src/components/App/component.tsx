import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SpritePane from "../SpritePane";
import { Button, Grid, Tooltip } from "@mui/material";
import "./style.css";
import { TopBar } from "../TopBar";
import { EditorPane, EditorTabButton } from "../EditorPane";
import { VerticalButtons } from "../PatchButton";
import { ThemeProvider } from "@emotion/react";

import darkTheme from "../../themes/dark";
import lightTheme from "../../themes/light";
import { GamePane } from "../GamePane";
import { EditorTab } from "../../store/patchEditorStore";

import DataObjectIcon from "@mui/icons-material/DataObject";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PublicIcon from "@mui/icons-material/Public";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import SplashScreen from "../SplashScreen/component";
import usePatchStore from "../../store";
import { appendFunction } from "../../hooks/useAppendFunction";
import { Thread } from "../EditorPane/types";

import useThreadAutoSave from "./useThreadAutoSave";
import useMonitorProjectChange from "./useMonitorProjectChange";
import useInitializedVm from "./useInitializedVm";
import { ModalSelector } from "../ModalSelector";

import { useProjectActions } from "../../hooks/useProjectActions";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LegalDialogueButton } from "./LegalDialogueButton";
import PatchFunctionJson from "../../assets/patch-api.json";

import Popover from "@mui/material/Popover";
import HomePage from "../HomePage";
import { SnapBotMode } from "../SnapBotMode";

interface Parameter {
  [key: string]: string;
}

interface PatchFunction {
  name: string;
  parameters: Parameter;
  description: string;
  exampleUsage: string;
  returnType: string;
}

const PatchApp = () => {
  const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
  const targetIds = usePatchStore((state) => state.targetIds);
  const patchVM = usePatchStore((state) => state.patchVM);
  const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);
  const editorTab = usePatchStore((state) => state.editorTab);

  // Popover state
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const apiData = PatchFunctionJson["patch-functions"];

  const currentThreadId = useGetCodeThreadId();

  const appendFunc = (func: string) => {
    appendFunction(currentThreadId, func);
  };

  const [mode, setMode] = React.useState(
    localStorage.getItem("theme") || "dark"
  );
  const [appMode, setAppMode] = useState(
    localStorage.getItem("appMode") || "patch"
  );

  // Save appMode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("appMode", appMode);
  }, [appMode]);

  const [projectId] = useLocalStorage("patchProjectId", "new");
  const { loadProject } = useProjectActions(projectId);
  const onVmInit = () => {
    loadProject();
  };
  useInitializedVm(onVmInit);

  useThreadAutoSave(patchVM, saveTargetThreads, editorTab);
  useMonitorProjectChange(setProjectChanged, [targetIds]);

  const variant = "outlined";

  // Popover functions
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <SplashScreen renderCondition={usePatchStore((state) => state.patchReady)}>
        <ToastContainer
          theme="dark"
          position="top-center"
        />
        <Grid container item direction="row" width={'100%'} sx={{
          position: "absolute",
          width: "100%",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 0,
          margin: 0,
          paddingBottom: "0px",
          zIndex: -1,
          overflowY: "auto",
          backgroundColor: 'background.default',
          color: "text.primary",
        }}>
          <ModalSelector />
          <TopBar mode={mode} setMode={setMode} appMode={appMode} setAppMode={setAppMode} />
          
          {appMode === "patch" ? (
            // Full Patch Mode UI
            <>
              <Grid item container direction="row" className="leftContainer">
                <Grid item className="assetHolder" sx={{
                  padding: "8px",
                  borderRightWidth: "1px",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                >
                  <VerticalButtons>
                    <EditorTabButton
                      tab={EditorTab.CODE}
                      icon={<DataObjectIcon />}
                    />
                    <EditorTabButton
                      tab={EditorTab.COSTUMES}
                      icon={<TheaterComedyIcon />}
                    />
                    <EditorTabButton
                      tab={EditorTab.SOUNDS}
                      icon={<MusicNoteIcon />}
                    />
                    <EditorTabButton
                      tab={EditorTab.VARIABLES}
                      icon={<PublicIcon />}
                    />
                    <Button
                      aria-describedby={id}
                      variant={variant}
                      onClick={handleClick}
                    >
                      <ArticleOutlinedIcon />
                    </Button>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      {apiData.map((value) => {
                        const parameterNames = Object.keys(value.parameters).join(
                          ", "
                        );
                        const functionNameWithParams = `${value.name}(${parameterNames})`;
                        return (
                          <>
                            <Typography key={value.name} sx={{ px: 4, py: 2 }}>
                              <Typography variant="h6" sx={{ color: "white" }}>
                                {functionNameWithParams}
                              </Typography>
                              {Object.entries(value.parameters).map(
                                ([paramName, paramType]) => (
                                  <div
                                    key={paramName}
                                    style={{ color: "lightgrey" }}
                                  >{`${paramName}: ${paramType}`}</div>
                                )
                              )}
                              <small>
                                <code style={{ color: "lightgreen" }}>
                                  {value.exampleUsage}
                                </code>
                              </small>
                              <br />
                              <small>{value.description}</small>
                              <br></br>
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "lightblue",
                                  color: "#636363",
                                  mt: 1,
                                  fontWeight: "bold",
                                }}
                                onClick={() => {
                                  console.log("Need to implement");
                                  handleClose();
                                  appendFunc(`${value.exampleUsage}`);
                                }}
                              >
                                Add to Editor <ArrowForwardIcon />
                              </Button>
                            </Typography>
                            <hr></hr>
                          </>
                        );
                      })}
                    </Popover>
                  </VerticalButtons>
                  <LegalDialogueButton />
                </Grid>
                <Grid item xs>
                  <EditorPane />
                </Grid>
              </Grid>
              <Grid item className="rightContainer">
                <GamePane />
                <SpritePane />
              </Grid>
            </>
          ) : (
            // SnapBot Mode - Now using the dedicated component
            <SnapBotMode />
          )}
        </Grid>
      </SplashScreen>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<PatchApp />} />
        <Route path="/app/*" element={<PatchApp />} />
        {/* Redirect old paths to the new /app path */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </Router>
  );
};

const useGetCodeThreadId = () =>
  usePatchStore((state) => state.getCodeThreadId());

export default App;
