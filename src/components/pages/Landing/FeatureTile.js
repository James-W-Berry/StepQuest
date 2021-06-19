import { Grid, Typography } from "@material-ui/core";

export default function FeatureTile(props) {
  const { feature } = props;

  return (
    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
      <img
        width="100%"
        height="100%"
        src={feature.picture}
        alt={feature.title}
      />
      <Typography>{feature.description}</Typography>
    </Grid>
  );
}
