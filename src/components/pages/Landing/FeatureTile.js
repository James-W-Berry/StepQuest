import { Typography } from "@material-ui/core";

export default function FeatureTile(props) {
  const { feature } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        width="100%"
        height="100%"
        src={feature.picture}
        alt={feature.title}
      />
      <Typography className="landing-section-body">
        {feature.description}
      </Typography>
    </div>
  );
}
