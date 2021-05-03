import { Typography } from "@material-ui/core";
import React from "react";

export default function Participants(props) {
  const { users } = props;

  return (
    <div style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
      {users.map((user) => {
        return (
          <Typography key={user.id}>
            <a href={`/user/${user.id}`}>{user.name}</a>
          </Typography>
        );
      })}
    </div>
  );
}
