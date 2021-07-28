import { Grid, Typography, useTheme } from "@material-ui/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { sendResetPasswordEmail } from "../../../api/authApi";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import photo from "../../../assets/fitness_stock_2.jpeg";

export default function PasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isResetLinkSent, setIsResetLinkSent] = useState();
  const [message, setMessage] = useState();
  const theme = useTheme();
  const isAboveMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const onResetPassword = (email) => {
    setIsLoading(true);
    sendResetPasswordEmail(email).then((response) => {
      setIsResetLinkSent(response.success);
      setMessage(response.message);
      setIsLoading(false);
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
            <Typography className="form-title">Reset Password</Typography>
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
                <Typography>
                  Enter your email address and we'll email instructions for
                  setting a new password.
                </Typography>
                {!isResetLinkSent && (
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

                <button
                  className="form-button-submit"
                  onClick={() => {
                    onResetPassword(email);
                  }}
                >
                  {isLoading ? (
                    <BeatLoader color={"#fff"} />
                  ) : (
                    <Typography>RESET PASSWORD</Typography>
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
              <Typography> Back to Sign In </Typography>
            </NavLink>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={7} lg={7} xl={7}>
        <img
          alt="password-reset-background"
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
            <Typography className="form-title">Reset Password</Typography>
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
                <Typography>
                  Enter your email address and we'll email instructions for
                  setting a new password.
                </Typography>
                {!isResetLinkSent && (
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

                <button
                  className="form-button-submit"
                  onClick={() => {
                    onResetPassword(email);
                  }}
                >
                  {isLoading ? (
                    <BeatLoader color={"#fff"} />
                  ) : (
                    <Typography>RESET PASSWORD</Typography>
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
              <Typography> Back to Sign In </Typography>
            </NavLink>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
