import { Grid, Typography, useTheme } from "@material-ui/core";
import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { signInUser } from "../../../api/authApi";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignInSuccessful, setIsSignInSuccessful] = useState();
  const [message, setMessage] = useState();
  const theme = useTheme();
  const history = useHistory();
  const isAboveMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const onSignIn = () => {
    setIsLoading(true);
    signInUser(email, password).then((response) => {
      setIsSignInSuccessful(response.success);
      setMessage(response.message);
      setIsLoading(false);
      if (response.success) {
        setTimeout(() => {
          history.push("/profile");
        }, 1000);
      }
    });
  };

  return isAboveMediumScreen ? (
    <Grid
      container
      style={{ display: "flex", height: "100%", backgroundColor: "#f5f5f5" }}
    >
      <Grid item xs={12} sm={6} md={5} lg={5} xl={5}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography className="form-title">Log In</Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {!isSignInSuccessful && (
                  <Typography className="error-text">{message}</Typography>
                )}

                <input
                  className="form-text-input"
                  type="text"
                  id="email"
                  placeholder="EMAIL"
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                <input
                  className="form-text-input"
                  type="text"
                  id="password"
                  placeholder="PASSWORD"
                  autoComplete="password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />

                <button
                  className="form-button-submit"
                  onClick={() => {
                    onSignIn();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <BeatLoader color={"#fff"} />
                  ) : (
                    <Typography>Log In</Typography>
                  )}
                </button>

                <NavLink
                  to={`/password-reset`}
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "none",
                    },
                    padding: "10px",
                  }}
                >
                  <Typography>Forgot Password?</Typography>
                </NavLink>
              </div>
            </div>

            <button
              className="form-button"
              onClick={() => {
                history.push("/signup");
              }}
            >
              <Typography>Create New Account</Typography>
            </button>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={7} lg={7} xl={7}>
        <div className="signin-background" />
      </Grid>
    </Grid>
  ) : (
    <Grid
      container
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Grid item xs={12} sm={9} md={12} lg={12} xl={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography className="form-title">Log In</Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {!isSignInSuccessful && (
                  <Typography className="error-text">{message}</Typography>
                )}

                <input
                  className="form-text-input"
                  type="text"
                  id="email"
                  placeholder="EMAIL"
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                <input
                  className="form-text-input"
                  type="text"
                  id="password"
                  placeholder="PASSWORD"
                  autoComplete="password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />

                <button
                  className="form-button-submit"
                  onClick={() => {
                    onSignIn();
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <BeatLoader color={"#fff"} />
                  ) : (
                    <Typography>Log In</Typography>
                  )}
                </button>

                <NavLink
                  to={`/password-reset`}
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "none",
                    },
                    padding: "10px",
                  }}
                >
                  <Typography>Forgot Password?</Typography>
                </NavLink>
              </div>
            </div>

            <button
              className="form-button"
              onClick={() => {
                history.push("/signup");
              }}
            >
              <Typography>Create New Account</Typography>
            </button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
