import React, { useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import colors from "../../../assets/colors";
import { SyncLoader } from "react-spinners";
import { signInUser } from "../../../api/authApi";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.white,
  },
});

const useStyles = makeStyles((theme) => ({
  button: {
    "&:hover": {
      backgroundColor: colors.almostWhite,
    },
    border: 0,
    borderRadius: 3,
    backgroundColor: colors.white,
    color: colors.stepitup_blue,
    height: "48px",
    padding: "0 30px",
    margin: "5px",
  },
  textInput: {
    "& label ": {
      color: colors.stepitup_fadedBlue,
    },
    "& label.Mui-focused": {
      color: colors.stepitup_fadedBlue,
    },
    "& .MuiInput-underline:after": {
      color: colors.stepitup_blue,
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    [theme.breakpoints.up("md")]: {
      width: "80%",
    },
  },
  input: {
    color: colors.almostBlack,
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

export default function SignInDialog(props) {
  const { isOpen, setDialogVisible, setForgottenPasswordVisible } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignInSuccessful, setIsSignInSuccessful] = useState();
  const [message, setMessage] = useState();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const onSignIn = () => {
    setIsLoading(true);
    signInUser(email, password).then((response) => {
      console.log(response);
      setIsSignInSuccessful(response.success);
      setMessage(response.message);
      setIsLoading(false);
    });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      onClose={() => {
        setMessage();
        setDialogVisible(false);
      }}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.stepitup_blue,
        }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => {
            setMessage();
            setDialogVisible(false);
          }}
        >
          Welcome Back!
        </DialogTitle>
      </div>

      <DialogContent style={{ padding: "0px" }}>
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
          {isSignInSuccessful ? (
            <Typography style={{ textAlign: "center", padding: "10px" }}>
              {message}
            </Typography>
          ) : (
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
              <Typography
                style={{ textAlign: "center", padding: "10px", color: "red" }}
              >
                {message}
              </Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  width: "80%",
                }}
              >
                <TextField
                  className={classes.textInput}
                  id="standard-email-input"
                  label="Email"
                  type="email"
                  InputProps={{
                    className: classes.input,
                  }}
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                <TextField
                  className={classes.textInput}
                  id="standard-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  InputProps={{
                    className: classes.input,
                  }}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />

                {isLoading ? (
                  <SyncLoader color={colors.stepitup_blue} />
                ) : (
                  <Button
                    onClick={() => {
                      onSignIn(email, password);
                    }}
                    className={classes.button}
                    style={{
                      backgroundColor: colors.stepitup_blue,
                      color: colors.white,
                      marginTop: "30px",
                    }}
                  >
                    Log In
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setDialogVisible(false);
                    setForgottenPasswordVisible(true);
                  }}
                  className={classes.button}
                  style={{
                    backgroundColor: colors.stepitup_blue,
                    color: colors.white,
                  }}
                >
                  Forgot Password?
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
