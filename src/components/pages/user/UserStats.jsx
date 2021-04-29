import { Typography } from "@material-ui/core";
import React from "react";

export default function UserStats(props) {
  const { user } = props;

  return (
    <div>
      <div style={{ margin: "20px" }}>
        <Typography variant="h5">Completed Challenges</Typography>
        {user.completedChallenges ? (
          user.completedChallenges.map((challenge) => {
            return (
              <div key={challenge.id}>
                <a href={`/challenge/${challenge.id}`}>{challenge.title}</a>
              </div>
            );
          })
        ) : (
          <div>No completed challenges</div>
        )}
      </div>

      <div style={{ margin: "20px" }}>
        <Typography variant="h5">Awards</Typography>
        <div>bar chart of gold, silver, and bronze </div>
        <div>Custom awards ("most improved")</div>
      </div>

      <div style={{ margin: "20px" }}>
        <Typography variant="h5">Membership</Typography>
        <div>Member since Month Year</div>
      </div>
    </div>
  );
}
