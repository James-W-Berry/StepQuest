import useMediaQuery from "@material-ui/core/useMediaQuery";
import colors from "../../../assets/colors";
import { useTheme, withStyles, makeStyles } from "@material-ui/core/styles";
import { Button, Dialog, IconButton, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.almostWhite,
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: colors.white,
  },
}))(MuiDialogContent);

export default function DeleteChallengeDialog(props) {
  const theme = useTheme();
  const classes = useStyles();
  const { isOpen, title, handleClose, handleConfirm } = props;
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography style={{ color: "#f7f7f5" }} variant="h6">
          {children}
        </Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
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
          backgroundColor: colors.stepQuestOrange,
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography className="section-header-big">{`Delete ${title}?`}</Typography>
          </div>
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
            Are you sure you want to delete this challenge? This will end the
            challenge for all participants.
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
              Delete Challenge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
