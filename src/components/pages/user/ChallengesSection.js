import React, { useState } from "react";
import {
  Grid,
  Typography,
  Chip,
  TextField,
  Snackbar,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import GroupIcon from "@material-ui/icons/Group";
import CloseIcon from "@material-ui/icons/Close";
import { NavLink } from "react-router-dom";
import colors from "../../../assets/colors";
import activeChallengeIcon from "../../../assets/active_challenge.png";
import pastChallengeIcon from "../../../assets/past_challenge.png";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  oddStyle: {
    backgroundColor: colors.almostWhite,
    width: "100%",
    display: "flex",
    borderRadius: "4px",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#F2D6A250",
    },
  },
  evenStyle: {
    backgroundColor: colors.stepQuestLightGray,
    width: "100%",
    display: "flex",
    borderRadius: "4px",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#F2D6A250",
    },
  },
  tooltip: {
    backgroundColor: colors.almostBlack,
    color: colors.almostWhite,
  },
  navLinkButton: {
    fontSize: ".8125rem",
    color: colors.almostBlack,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      borderRadius: "50px",
    },
    margin: "0px",
  },
}));

export default function ChallengesSection(props) {
  const classes = useStyles();
  const { activeChallenges, activeChallengeData, user, userId, id } = props;
  const [activeFilter, setActiveFilter] = useState(true);
  const [completedFilter, setCompletedFilter] = useState(true);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(e);
    setIsToastVisible(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastVisible(false);
  };

  const ListItem = (props) => {
    const { item, id, active } = props;
    return (
      <Grid
        container
        key={item}
        className={id % 2 === 0 ? classes.evenStyle : classes.oddStyle}
      >
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
          <a
            className="section-body"
            href={`/challenge/${item.id}`}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              color: colors.almostBlack,
              padding: "20px 10px",
              height: "100%",
            }}
          >
            <img
              alt={item.title}
              src={active ? activeChallengeIcon : pastChallengeIcon}
              height="60px"
              width="60px"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingLeft: "10px",
              }}
            >
              <Typography className="section-body-regular-weight">
                {item.title}
              </Typography>
              <Typography className="section-body-regular-size">
                {item.description}
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <GroupIcon fontSize="small" style={{ color: "#666" }} />
                <Typography
                  className="section-body-regular-size"
                  style={{ paddingLeft: "5px", color: "#666" }}
                >
                  {`${item.participants.length} ${
                    item.participants.length > 1 ? "members" : "member"
                  }`}
                </Typography>
              </div>
            </div>
          </a>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "10px 10px",
            }}
          >
            <Typography>INVITE LINK</Typography>
            <Tooltip
              classes={{ tooltip: classes.tooltip }}
              title={
                <React.Fragment>
                  <Typography
                    style={{
                      color: "inherit",
                      padding: "10px",
                    }}
                  >
                    Click to copy
                  </Typography>
                </React.Fragment>
              }
              arrow
              placement="top"
            >
              <TextField
                variant="outlined"
                className="text-field-copy"
                InputProps={{
                  readOnly: true,
                }}
                onClick={() =>
                  // copyToClipboard(`http://stepquest.web.app/join/${item.id}`)
                  copyToClipboard(`http://localhost:3000/join/${item.id}`)
                }
                // defaultValue={`http://stepquest.web.app/join/${item.id}`}
                defaultValue={`http://localhost:3000/join/${item.id}`}
              />
            </Tooltip>

            <Typography
              className="section-body-regular-size"
              style={{ color: "#666" }}
            >
              Share this link to invite participants to your challenge
            </Typography>
          </div>
        </Grid>
      </Grid>
    );
  };

  const handleChipClick = (category) => {
    if (category === "active") {
      setActiveFilter(!activeFilter);
    } else {
      setCompletedFilter(!completedFilter);
    }
  };

  return (
    <Grid
      container
      spacing={3}
      style={{
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingTop: "20px",
      }}
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
          className={classes.navLinkButton}
          style={{
            textDecoration: "none",
          }}
          to="/create-challenge"
        >
          <button
            className="header-menu-button"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Add
              width={100}
              height={100}
              style={{ color: colors.stepQuestOrange }}
            />
            <Typography class="section-body" style={{ textDecoration: "none" }}>
              Create New Challenge
            </Typography>
          </button>
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
              {activeChallengeData?.map((challenge, index) => {
                return <ListItem item={challenge} id={index} active />;
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
              user.completedChallenges.map((challenge, index) => {
                return <ListItem item={challenge} id={index} />;
              })
            ) : (
              <Typography className="section-body">
                No completed challenges, yet!
              </Typography>
            )}
          </div>
        </Grid>
      )}

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={isToastVisible}
        autoHideDuration={5000}
        onClose={handleClose}
        message={"Copied invite link!"}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Grid>
  );
}
