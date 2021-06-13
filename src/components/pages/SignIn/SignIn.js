import { Grid, Typography } from "@material-ui/core";

export default function SignIn() {
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
          <Typography variant="h4">sign in form here</Typography>
          <Typography variant="h4">Create New Account</Typography>
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
          <Typography variant="h4">sign in image here</Typography>
        </div>
      </Grid>
    </Grid>
  );
}
