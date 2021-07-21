import { Grid, Typography } from "@material-ui/core";
import colors from "../assets/colors";

export default function Footer() {
  return (
    <Grid
      container
      style={{
        minHeight: "100px",
        backgroundColor: colors.stepQuestPaleOrangeFaded,
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          className="section-body-regular-size"
          style={{ color: colors.almostBlack }}
        >
          © 2021 StepQuest All rights reserved
        </Typography>
      </Grid>
    </Grid>
  );
}
