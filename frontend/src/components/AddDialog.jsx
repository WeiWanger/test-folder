import React, { useEffect, useState } from "react";
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
  Paper,
  Typography,
} from "@mui/material";
import styles from "./AddDialog.module.css";

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
  };

  const reset = () => {
    setText("");
    setTextIsTouched(false);
  };

  let formIsValid;
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
      <DialogContent className={styles.content}>
        <div className={styles.name_input}>
          <TextField
            label="Name"
            onChange={handleChangeText}
            onBlur={textBlurHandle}
            value={text}
          />
        </div>
        {textHasError && (
          <Typography sx={{ marginLeft: "8px" }}>
            Please enter an folder name!
          </Typography>
        )}
        <div>
          <FormControl className={styles.select}>
            <InputLabel>Parent</InputLabel>
            <Select label="Parent" onChange={handleChangeParent} value={parent}>
              <MenuItem value={"0"}>(root)</MenuItem>
              {props.tree
                .filter((node) => identifyFolderIdStartWith(node.id) === true)
                .map((node) => (
                  <MenuItem key={String(node.id)} value={String(node.id)}>
                    {node.text}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
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
