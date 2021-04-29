import React, { useState, useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import colors from "../../../assets/colors";
import { getChallenge } from "../../../api/challengeApi";
import { Button, Divider, Typography } from "@material-ui/core";
import { getUser } from "../../../api/userApi";
import { NavLink } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

function convertSecondsToDate(seconds) {
  const date = new Date(seconds * 1000);
  return date.toDateString();
}

export default function ChallengeDetails(props) {
  const id = props.match.params.id;
  const [challengeDetails, setChallengeDetails] = useState({
    isLoading: true,
    success: null,
    data: null,
  });
  const [adminName, setAdminName] = useState(null);

  useEffect(() => {
    getChallenge(id).then((response) => {
      console.log(response);
      setChallengeDetails(response);
    });
  }, [id]);

  useEffect(() => {
    if (challengeDetails.data) {
      getUser(challengeDetails.data.admin).then((response) => {
        if (response.success) {
          setAdminName(response.data.displayName);
        }
      });
    }
  }, [challengeDetails]);

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
      <div style={{ margin: "20px" }}>
        <Typography variant="h4">{challengeDetails.data.title}</Typography>
        <Typography>{challengeDetails.data.description}</Typography>
        <Typography>Activity: {challengeDetails.data.activity}</Typography>
      </div>

      <div style={{ margin: "20px" }}>
        <Typography>
          Start: {convertSecondsToDate(challengeDetails.data.startDate.seconds)}
        </Typography>
        <Typography>
          End: {convertSecondsToDate(challengeDetails.data.endDate.seconds)}
        </Typography>
      </div>

      {adminName && (
        <div style={{ margin: "20px" }}>
          <Typography>
            Created by{" "}
            <a href={`/users/${challengeDetails.data.admin}`}>{adminName}</a>
          </Typography>
        </div>
      )}

      <Divider variant="fullWidth" />
      <div style={{ margin: "20px" }}>
        <Typography variant="h5">Challenge Stats</Typography>
        <Typography>Totals, graphs, visualizations, etc</Typography>
      </div>

      <div style={{ margin: "20px" }}>
        <Typography variant="h5">Standings</Typography>
        <Typography>Challenge participant list here, ranked</Typography>
      </div>

      <div style={{ margin: "20px" }}>
        <Typography variant="h5">Your Challenge Activities</Typography>
        <Typography>Calendar populated with activities</Typography>

        <NavLink
          style={{ textDecoration: "none", color: colors.almostBlack }}
          to="/edit"
        >
          <Button
            style={{
              backgroundColor: colors.stepitup_blue,
              color: colors.white,
            }}
            startIcon={<AddIcon />}
          >
            Add Activity
          </Button>
        </NavLink>
      </div>

      <Divider variant="fullWidth" />

      <div style={{ margin: "20px" }}>
        <Button
          style={{
            backgroundColor: "red",
            color: colors.white,
          }}
        >
          Leave Challenge
        </Button>
      </div>
    </div>
  );
}
