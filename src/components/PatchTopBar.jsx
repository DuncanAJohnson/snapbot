import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import * as PyatchProvider from './provider/PyatchProvider.jsx';
import pyatchContext from './provider/PyatchContext.js';

import { PatchHorizontalButtons, PatchTextButton } from './PatchTemplates.jsx';

export default function PatchTopBar(){
    return(
        <Grid container item direction="row" sx={{
          width: "100vw",
          padding: "8px",
          maxHeight: "56px",
          backgroundColor: 'primary.dark',
        }}>
          <Grid container item direction = "row" xs = {8} spacing={2} className="patchTopBar">
            <Grid item>
              <PatchFileButton/>
            </Grid>
            <Grid item xs={6}>
              <PatchFileName/>
            </Grid>
          </Grid>
          <Grid container item xs={4} justifyContent="flex-end">
            <Grid item>
              <PatchHorizontalButtons>
                <PatchProjectButton/>
                <PatchSignOutButton/>
              </PatchHorizontalButtons>
            </Grid>
          </Grid>
        </Grid>
    );
}

export function PatchSignOutButton() {
    const handleClick = (event) => {
      console.log(event.currentTarget.id);
    };
  
    return (
        <PatchTextButton sx={{borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light"}} text="Sign Out" id="signOut" variant="contained" onClick={handleClick} />
    );
}

export function PatchProjectButton() {
    const handleClick = (event) => {
        console.log(event.currentTarget.id);
    };
    
    return (
        <PatchTextButton sx={{borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light"}} id = "project" variant="contained" onClick={handleClick} text="Projects" />
    );
}

export function PatchFileName() {

    const handleTextChange = event =>{
        console.log(event.target.value);
    };

    return (
        <>
        <TextField
            hiddenLabel
            onChange = {handleTextChange}
            id="fileName"
            defaultValue="Untitled"
            variant="outlined"  
            size="small"
            fullWidth
            sx={{marginLeft: "-16px"}}
            //sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}
        />
        </>
    );
}

export function PatchFileButton() {
  const { saveToLocalStorage, loadFromLocalStorage, downloadProject, loadSerializedProject, changesSinceLastSave } = useContext(pyatchContext);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    console.log(event.currentTarget.id);
  };

  const handleSaveNow = async (event) => {
    // idk if awaiting this is bad but it is unnecessary.
    saveToLocalStorage();
  };

  const handleLoadFromLocalStorage = (event) => {
    loadFromLocalStorage();
  }
  const handleNew = (event) => {
    /* For now, this will just clear the project from localStorage and reload. */
    localStorage.removeItem("proj");
    location.reload();
  }
  const handleDownload = async (event) => {
    await downloadProject();
  };

  const handleUpload = (event) => {
    //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
    var input = document.createElement('input');
    input.type = 'file';
    
    input.onchange = e => { 
      
      // getting a hold of the file reference
      var file = e.target.files[0]; 
      
      // setting up the reader
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      
      // here we tell the reader what to do when it's done reading...
      reader.onloadend = readerEvent => {
        var content = readerEvent.target.result; // this is the content!
        
        loadSerializedProject(content);
      }
    }
    
    input.click();
  }

  return (
    <PatchHorizontalButtons>
      <PatchTextButton
        id="file"
        variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        text="File"
        sx={{borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light"}}
      />
      <PatchTextButton sx={{borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light"}} id="saveNow" variant={changesSinceLastSave ? "contained" : "disabled"} onClick={handleSaveNow} text={changesSinceLastSave ? "Save" : "Saved"} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem id="new" onClick={handleNew}>New</MenuItem>
        <MenuItem id="saveNow" onClick={handleSaveNow}>Save Now</MenuItem>
        <MenuItem id="saveCopy" onClick={handleClose}>Save As A Copy</MenuItem>
        <MenuItem id="load" onClick={handleUpload}>Load From Your Computer</MenuItem>
        <MenuItem id="localSave" onClick={handleDownload}>Save To Your Computer</MenuItem>
      </Menu>
    </PatchHorizontalButtons>
  );
  }