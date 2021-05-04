import { Typography } from "@material-ui/core";
import React from "react";

export default function Participants(props) {
  const { users } = props;

  return (
    <div style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
      {users.map((user) => {
        return (
          <Typography key={user}>
            <a href={`/user/${user}`}>{user}</a>
          </Typography>
        );
      })}
    </div>
  );
}
