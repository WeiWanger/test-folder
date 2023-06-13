import React, { useState } from "react";
import { IconButton, Typography, TextField } from "@mui/material";
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

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);
  return (
    <div
      className={`tree-node ${styles.root}`}
      style={{ paddingInlineStart: indent, width: "20%" }}
      {...dragOverProps}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ""
        }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRightIcon />
          </div>
        )}
      </div>
      <div>
        {props.node.droppable ? (
          <FolderIcon droppable={droppable.toString()} />
        ) : (
          <DescriptionIcon droppable={droppable.toString()} />
        )}
      </div>
      <div className={styles.labelGridItem}>
        {visibleInput ? (
          <div className={styles.inputWrapper}>
            <input
              className={`${styles.textField} ${styles.nodeInput}`}
              value={labelText}
              onChange={handleChangeText}
            />
            <IconButton
              className={styles.editButton}
              onClick={handleSubmit}
              disabled={labelText === ""}
            >
              <CheckIcon className={styles.editIcon} />
            </IconButton>
            <IconButton className={styles.editButton} onClick={handleCancel}>
              <CloseIcon className={styles.editIcon} />
            </IconButton>
          </div>
        ) : (
          <div className={styles.folderField}>
            <Typography variant="body2" className={styles.folder_title}>
              {props.node.text}
            </Typography>
            {props.node.droppable ? (
              <div className={styles.actionButton}>
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
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
};
