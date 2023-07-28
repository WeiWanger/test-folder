import React, { useState } from "react";
import {
  Button,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";

function identifyFolderIdStartWith(folderID) {
  if (!folderID) return false;
  if (folderID.match(/[^a-zA-z]/)) {
    return true;
  }
  if (folderID.match(/[^0-9]/)) {
    return false;
  }
}

export const AddDialog = (props) => {
  const [text, setText] = useState("");
  // const [email, setEmail] = useState("");
  const [parent, setParent] = useState(0);
  // const [droppable, setDroppable] = useState(true);

  const [textIsTouched, setTextIsTouched] = useState(false);
  const textIsValid = text.trim() !== "";
  const textHasError = !textIsValid && textIsTouched;

  const handleChangeText = (e) => {
    console.log(e.target.value);
    setText(e.target.value);
  };

  const textBlurHandle = (e) => {
    setTextIsTouched(true);
    setText((prev) => prev.trim());
  };

  const reset = () => {
    setText("");
    setTextIsTouched(false);
  };

  let formIsValid = false;
  if (text.trim() !== "") {
    formIsValid = true;
  }

  // const handleChangeEmail = (e) => {
  //   setEmail(e.target.value);
  // };
  const handleChangeParent = (e) => {
    setParent(e.target.value);
  };

  const createdNewNode = {
    ParentFolderID: parent,
    FolderName: text,
    Type: props.dataType || "",
  };

  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>Add Folder</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: "16px" }}>
        <Box marginTop="20px">
          <TextField
          sx={{marginTop:'5px'}}
            variant="outlined"
            label="Name"
            onChange={handleChangeText}
            onBlur={textBlurHandle}
            value={text}
          />
        </Box>
        {textHasError && (
          <Typography sx={{ marginLeft: "4px", color: "#3399ff" }}>
            Please enter an folder name!
          </Typography>
        )}
        <Box>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel>Parent</InputLabel>
            <Select label="Parent" onChange={handleChangeParent} value={parent}>
              <MenuItem value={"0"}>(root)</MenuItem>
              {props.tree
                .filter((node) => node.droppable === true)
                .map((node) => (
                  <MenuItem key={String(node.id)} value={String(node.id)}>
                    {node.text}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={() => {
            props.onSubmit(createdNewNode);
          }}
          disabled={!formIsValid}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
