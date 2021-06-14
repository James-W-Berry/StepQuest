import {
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { signUpUser } from "../../api/authApi";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState();
  const [message, setMessage] = useState();
  const theme = useTheme();

  const onSignUp = () => {
    setIsLoading(true);
    signUpUser(username, email, password).then((response) => {
      console.log(response);
      setIsSignUpSuccessful(response.success);
      setMessage(response.message);
      setIsLoading(false);
    });
  };

  return (
    <Grid container style={{ display: "flex", height: "100%" }}>
      <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
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
            {isSignUpSuccessful ? (
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
                    id="standard-username-input"
                    label="Display Name"
                    type="username"
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                  <TextField
                    id="standard-email-input"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                  <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />

                  {isLoading ? (
                    <SyncLoader />
                  ) : (
                    <Button
                      onClick={() => {
                        onSignUp();
                      }}
                    >
                      Sign Up
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <NavLink
            to={`/signin`}
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
              },
              padding: "10px",
            }}
          >
            <Typography>SIGN IN</Typography>
          </NavLink>
          <NavLink
            to={`/signup`}
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
              },
              padding: "10px",
            }}
          >
            <Typography>Already have an account?</Typography>
          </NavLink>
        </div>
      </Grid>
      <Grid spacing={0} item xs={12} sm={12} md={7} lg={7} xl={7}>
        <div className="signup-background" />
      </Grid>
    </Grid>
  );
}
