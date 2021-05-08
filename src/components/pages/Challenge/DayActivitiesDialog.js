import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import colors from "../../../assets/colors";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import { Dialog, IconButton, Typography } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "30%",
    minWidth: "300px",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

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

export default function DayActivitiesDialog(props) {
  const theme = useTheme();
  const classes = useStyles();

  const { isOpen, day, activities, handleClose } = props;
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
          {`Edit your activities for ${day}`}
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
          {activities.map((activity, index) => {
            return (
              <div key={index}>
                <Typography>
                  ${activity.activity} - ${activity.duration}
                </Typography>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
