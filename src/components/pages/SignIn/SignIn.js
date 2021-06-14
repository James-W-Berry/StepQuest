import { Button, Grid, Typography, useTheme } from "@material-ui/core";
import { NavLink } from "react-router-dom";

export default function SignIn() {
  const theme = useTheme();

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography>sign in form here</Typography>
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
            <Typography>Create New Account</Typography>
          </NavLink>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>sign in image here</Typography>
        </div>
      </Grid>
    </Grid>
  );
}
