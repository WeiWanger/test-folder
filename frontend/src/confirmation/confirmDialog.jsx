import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

export const ConfirmDialog = (props) => {
  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>
        <Typography variant="h7" fontWeight="500">
          CONFIRMATION
        </Typography>
      </DialogTitle>
      <DialogContent style={{ fontFamily: "sans-serif" }}>
        <Typography variant="h8" fontWeight="400">
          Attention: This folder may contain subfolders, and their names will be
          automatically changed if conflicts arise. Click "Continue" to proceed
          with deletion.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onDelete}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
};
