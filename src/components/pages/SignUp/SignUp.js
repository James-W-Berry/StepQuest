import { Grid, Typography, useTheme } from "@material-ui/core";
import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { signUpUser } from "../../../api/authApi";
import { signInUserWithProvider } from "../../../api/authApi";
import firebase from "../../../firebase";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import photo from "../../../assets/fitness_stock.jpeg";

const provider = new firebase.auth.GoogleAuthProvider();

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState();
  const [message, setMessage] = useState();
  const theme = useTheme();
  const history = useHistory();
  const isAboveMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const onSignUp = () => {
    setIsLoading(true);
    signUpUser(email, password).then((response) => {
      setIsSignUpSuccessful(response.success);
      setMessage(response.message);
      setIsLoading(false);
      if (response.success) {
        setTimeout(() => {
          history.push("/profile");
        }, 1000);
      }
    });
  };

  const onGoogleSignIn = () => {
    signInUserWithProvider(provider).then((response) => {
      if (response.success) {
        console.log(response.message);
      } else {
        history.push("/");
        alert(response.message);
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
            <Typography className="form-title">Create an account</Typography>
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
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                {!isSignUpSuccessful && (
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
                  type="password"
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
                    onSignUp();
                  }}
                >
                  {isLoading ? (
                    <BeatLoader color={"#fff"} />
                  ) : (
                    <Typography>GET STARTED</Typography>
                  )}
                </button>
              </div>
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
              <Typography>Already have an account?</Typography>
            </NavLink>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={7} lg={7} xl={7}>
        <img
          alt="sign-up-background"
          src={photo}
          style={{
            width: "100%",
            padding: "0px",
            margin: "0px",
            height: "100%",
            objectFit: "cover",
          }}
        />
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
            <Typography className="form-title">Create an account</Typography>
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
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                {!isSignUpSuccessful && (
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
                  type="password"
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
                    onSignUp();
                  }}
                >
                  {isLoading ? (
                    <BeatLoader color={"#fff"} />
                  ) : (
                    <Typography>GET STARTED</Typography>
                  )}
                </button>
              </div>
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
              <Typography>Already have an account?</Typography>
            </NavLink>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
