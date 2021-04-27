import React from "react";

export default function ChallengeDetails(props) {
  return <div>{props.match.params.id}</div>;
}
