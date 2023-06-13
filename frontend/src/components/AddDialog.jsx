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
} from "@mui/material";
import styles from "./AddDialog.module.css";

export const AddDialog = (props) => {

  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [parent, setParent] = useState(0);
  const [droppable, setDroppable] = useState(true);

  const handleChangeText = (e) => {
    console.log(e.target.value);
    setText(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangeParent = (e) => {
    setParent(e.target.value);
    
  };

  const createdNewNode = {
      FolderID: props.tree.id,
      ParentFolderID: parent,
      FolderName: text,
      Email: email,
      droppable: droppable,
      Type: "public",
  }


  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>Add Folder</DialogTitle>
      <DialogContent className={styles.content}>
        <div className={styles.name_input}>
          <TextField label="Name" onChange={handleChangeText} value={text} />
        </div>
        <div className={styles.name_input}>
          <TextField label="Email" onChange={handleChangeEmail} value={email} />
        </div>
        <div>
          <FormControl className={styles.select}>
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
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={() => props.onSubmit(createdNewNode)}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
