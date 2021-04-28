import React, { useState, useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import colors from "../../../assets/colors";
import { getChallenge } from "../../../api/challengeApi";

export default function ChallengeDetails(props) {
  const id = props.match.params.id;
  const [challengeDetails, setChallengeDetails] = useState({
    isLoading: true,
    success: null,
    data: null,
  });

  useEffect(() => {
    getChallenge(id).then((response) => {
      console.log(response);
      setChallengeDetails(response);
    });
  }, [id]);

  if (challengeDetails.isLoading) {
    return (
      <div
        style={{
          backgroundColor: colors.almostWhite,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <SyncLoader color={colors.stepitup_blue} />
      </div>
    );
  }

  if (!challengeDetails.success) {
    return (
      <div
        style={{
          backgroundColor: colors.almostWhite,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div>User not found :(</div>
      </div>
    );
  }

  return (
    <div>
      <div>{challengeDetails.data.title}</div>
      <div>{challengeDetails.data.description}</div>
      <div>{challengeDetails.data.id}</div>
      <div>{challengeDetails.data.activity}</div>
      <div>{challengeDetails.data.startDate.seconds}</div>
      <div>{challengeDetails.data.endDate.seconds}</div>
      <div>
        <a href={`/users/${challengeDetails.data.admin}`}>
          {challengeDetails.data.admin}
        </a>
      </div>
    </div>
  );
}
