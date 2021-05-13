import { Grid, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React from "react";
import { NavLink } from "react-router-dom";
import colors from "../../../assets/colors";

export default function ChallengesWidget(props) {
  const { activeChallenges, activeChallengeData, user, userId, id } = props;

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{
          textAlign: "center",
        }}
      >
        <Typography variant="h5">Challenges</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        {activeChallenges ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              border: "1px solid #0099ff90",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <Typography variant="h5">Active challenges</Typography>
            {activeChallengeData.map((challenge) => {
              return (
                <div key={challenge}>
                  <a href={`/challenge/${challenge.id}`}>{challenge.title}</a>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              border: "1px solid #0099ff90",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <Typography variant="h4" style={{ color: colors.almostBlack }}>
              You have no active challenges.
            </Typography>
          </div>
        )}
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            border: "1px solid #0099ff90",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
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
            <div>No completed challenges yet. Keep going!</div>
          )}
        </div>
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            borderRadius: "8px",
            backgroundColor: colors.stepitup_blue,
            padding: "20px",
          }}
        >
          {userId === id && (
            <NavLink
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "none",
              }}
              to="/create-challenge"
            >
              <Add style={{ color: colors.white }} width={100} height={100} />
              <Typography variant="h5" style={{ color: colors.white }}>
                Create New Challenge
              </Typography>
            </NavLink>
          )}
        </div>
      </Grid>
    </Grid>
  );
}
