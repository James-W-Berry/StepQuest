import { Grid, Typography, Chip } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import colors from "../../../assets/colors";
import challengeIcon from "../../../assets/challenge.png";

export default function ChallengesSection(props) {
  const { activeChallenges, activeChallengeData, user, userId, id } = props;
  const [activeFilter, setActiveFilter] = useState(true);
  const [completedFilter, setCompletedFilter] = useState(true);

  const handleChipClick = (category) => {
    if (category === "active") {
      setActiveFilter(!activeFilter);
    } else {
      setCompletedFilter(!completedFilter);
    }
  };

  console.log();

  return (
    <Grid
      container
      spacing={3}
      style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "20px" }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography className="section-header">MY CHALLENGES</Typography>
          <div style={{ display: "flex" }}>
            <Chip
              key="active"
              style={{
                marginRight: "10px",
                backgroundColor: activeFilter && colors.stepQuestOrange,
                color: activeFilter && colors.almostWhite,
              }}
              label="Active"
              onClick={() => handleChipClick("active")}
              clickable
            />
            <Chip
              key="completed"
              label="Completed"
              onClick={() => handleChipClick("completed")}
              clickable
              style={{
                backgroundColor: completedFilter && colors.stepQuestOrange,
                color: completedFilter && colors.almostWhite,
              }}
            />
          </div>
        </div>

        <NavLink
          style={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          to="/create-challenge"
        >
          <Add
            width={100}
            height={100}
            style={{ color: colors.stepQuestOrange }}
          />
          <Typography
            class="section-body"
            style={{ textDecoration: "none", color: colors.almostBlack }}
          >
            Create New Challenge
          </Typography>
        </NavLink>
      </Grid>

      {activeFilter && (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {activeChallenges ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingTop: "20px",
              }}
            >
              <Typography className="section-subheading">ACTIVE</Typography>
              {activeChallengeData?.map((challenge) => {
                return (
                  <div key={challenge}>
                    <a
                      className="section-body"
                      href={`/challenge/${challenge.id}`}
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.almostBlack,
                        padding: "10px 0px",
                      }}
                    >
                      <img
                        alt={challenge.title}
                        src={challengeIcon}
                        height="60px"
                        width="60px"
                      />
                      {challenge.title}
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                alignItems: "flex-start",
              }}
            >
              <Typography className="section-subheading">
                You have no active challenges. Join or create one now.
              </Typography>
            </div>
          )}
        </Grid>
      )}
      {completedFilter && (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              paddingTop: "20px",
            }}
          >
            <Typography className="section-subheading">COMPLETED</Typography>
            {user.completedChallenges ? (
              user.completedChallenges.map((challenge) => {
                return (
                  <div key={challenge.id}>
                    <a href={`/challenge/${challenge.id}`}>{challenge.title}</a>
                  </div>
                );
              })
            ) : (
              <Typography className="section-body">
                No completed challenges, yet!
              </Typography>
            )}
          </div>
        </Grid>
      )}
    </Grid>
  );
}
