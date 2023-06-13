import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

export const ConfirmDialog = (props) => {
  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>Confirmation!!</DialogTitle>
      <DialogContent style={{ fontFamily: "sans-serif" }}>
        This Folder may contain subFolder, if you want to continue, please click
        "Continue"
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onDelete}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
};
