import { Typography } from "@material-ui/core";

export default function ChallengeTile(props) {
  const { challenge } = props;

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
        src={challenge.picture}
        alt={challenge.title}
      />
      <Typography className="section-body">{challenge.title}</Typography>
      <Typography className="section-body">
        {challenge.startDate} - {challenge.endDate}
      </Typography>
      <Typography className="section-body">{challenge.description}</Typography>
    </div>
  );
}
