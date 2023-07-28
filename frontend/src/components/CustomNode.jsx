import React, { useState } from "react";
import { IconButton, Typography, Box, TextField, Input } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Delete from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import Update from "@mui/icons-material/Create";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./CustomNode.module.css";
import { ConfirmDialog } from "../confirmation/confirmDialog";
import { useDragOver } from "@minoru/react-dnd-treeview";

/* function identifyFolderIdStartWith(folderID) {
  if (!folderID) {
    // Check if folderID is defined and not an empty string
    return null;
  }

  if (folderID[0].match(/[a-zA-z]/)) {
    return true; // Starts with a letter
  } else if (folderID[0].match(/[0-9]/)) {
    return false; // Starts with a number
  }

  return null; // Starts with neither a letter nor a number
} */

export const CustomNode = (props) => {
  const { id, droppable, text } = props.node;

  const [visibleInput, setVisibleInput] = useState(false);
  const [labelText, setLabelText] = useState(text);
  const indent = props.depth * 24;

  const [confirmShow, setConfirmShow] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleShowInput = () => {
    setVisibleInput(true);
  };

  const handleCancel = () => {
    setLabelText(text);
    setVisibleInput(false);
  };

  const handleChangeText = (e) => {
    setLabelText(e.target.value);
  };

  const handlechangeTextBlur = () => {
    setLabelText((prev) => prev.trim());
  };

  const handleSubmit = () => {
    setVisibleInput(false);
    props.onTextChange(id, labelText);
  };

  const handleDeleteMessage = () => {
    setConfirmShow(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmShow(false);
  };

  const handleSelect = () => props.onSelect(props.node);

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);
  return (
    <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr auto',
      alignItems: 'center',
      height: '40px',
      paddingInlineEnd: '24px',
      ...(props.isSelected && {
        color: '#1967d2',
      }),
    }}
    style={{ paddingInlineStart: indent, width: '20%' }}
    {...dragOverProps}
    onClick={handleSelect}
    >
      <Box
        sx={{
          alignItems: 'center',
          fontSize: 0,
          cursor: 'pointer',
          display: 'flex',
          height: 24,
          justifyContent: 'center',
          width: 30,
          transition: 'transform linear 0.1s',
          transform: props.isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      >
        {props.node.droppable && (
          <Box onClick={handleToggle}>
            <ArrowRightIcon />
          </Box>
        )}
      </Box>
      <Box>{props.node.droppable ? <FolderIcon /> : <DescriptionIcon />}</Box>
      <Box sx={{ paddingInlineStart: '4px' }}>
        {visibleInput ? (
          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-start' }}>
            <Input
              sx={{ width: "200px", padding: "4px 0" }}
              value={labelText}
              onChange={handleChangeText}
              onBlur={handlechangeTextBlur}
            />
            <IconButton
              sx={{ padding: "6px" }}
              onClick={handleSubmit}
              disabled={labelText === ""}
            >
              <CheckIcon sx={{ fontSize: "20px" }} />
            </IconButton>
            <IconButton sx={{ fontSize: "20px" }} onClick={handleCancel}>
              <CloseIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifySelf: "start",
              width: "100%",
            }}
          >
            <Typography variant="body2" sx={{ width: "200px" }}>
              {props.node.text}
            </Typography>
            {props.node.droppable ? (
              <Box sx={{ display: 'flex', padding: '0 4px', position: 'relative' }}>
                <IconButton size="small" onClick={handleShowInput}>
                  <Update fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleDeleteMessage}>
                  <Delete fontSize="small" />
                </IconButton>
                {confirmShow && (
                  <ConfirmDialog
                    onClose={handleCloseConfirmDialog}
                    onDelete={() => {
                      props.onDelete(id);
                      setConfirmShow(false);
                    }}
                  />
                )}
              </Box>
            ) : (
              ""
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
