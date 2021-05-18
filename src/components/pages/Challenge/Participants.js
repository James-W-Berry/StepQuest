import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";

const calculateStandings = (logs) => {
  const ranking = logs.map((user) => {
    const totalSum = user.activities.reduce(
      (acc, curr) => parseInt(acc) + parseInt(curr.duration),
      0
    );
    return { participant: user.participant, sum: totalSum };
  });
  return ranking;
};

export default function Participants(props) {
  const { users, logs } = props;
  const [participantRanking, setParticipantRanking] = useState(users);

  useEffect(() => {
    if (logs) {
      const sortedRanking = calculateStandings(logs).sort((a, b) =>
        a.sum > b.sum ? -1 : 1
      );
      setParticipantRanking(sortedRanking);
    }
  }, [logs]);

  return (
    <div style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
      {participantRanking.map((user) => {
        return (
          <Typography key={user.participant}>
            <a href={`/user/${user.participant}`}>
              {user.participant} - {user.sum}
            </a>
          </Typography>
        );
      })}
    </div>
  );
}
