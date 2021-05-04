import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import colors from "../../../assets/colors";
import { useTheme, withStyles } from "@material-ui/core/styles";
import { Button, Dialog, IconButton, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.white,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography {...other}>
      <Typography style={{ color: colors.white }} variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: colors.white,
  },
}))(MuiDialogContent);

export default function LeaveChallengeDialog(props) {
  const theme = useTheme();
  const { isOpen, title, handleClose, handleConfirm } = props;
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog
      open={isOpen}
      fullScreen={fullScreen}
      disableBackdropClick={false}
      fullWidth={true}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.stepitup_blue,
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {`Leave ${title}?`}
        </DialogTitle>
      </div>

      <DialogContent className="dialog" style={{ padding: "0px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            background: "#ffffffcc",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography style={{ textAlign: "center", padding: "10px" }}>
            Are you sure you want to leave this challenge? All your data will be
            removed from this challenge.
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              padding: "10px",
            }}
          >
            <Button
              onClick={handleConfirm}
              style={{
                backgroundColor: "red",
                color: colors.white,
              }}
            >
              Leave Challenge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
