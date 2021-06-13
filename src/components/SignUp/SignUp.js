import { Button, Grid, Typography, useTheme } from "@material-ui/core";
import { NavLink } from "react-router-dom";

export default function SignUp() {
  const theme = useTheme();
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">sign up form here</Typography>
          <NavLink
            to={`/signin`}
            style={{
              fontSize: ".8125rem",
              color: theme.palette.primary.main,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
              },
              padding: "10px",
            }}
          >
            <Button>
              <Typography>SIGN IN</Typography>
            </Button>
          </NavLink>
          <Typography variant="h4">Already have an account?</Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">sign up image here</Typography>
        </div>
      </Grid>
    </Grid>
  );
}
