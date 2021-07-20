import React, { useEffect, useState } from "react";
import { Grid, Typography, Snackbar, IconButton } from "@material-ui/core";
import { getChallenge } from "../../../api/challengeApi";
import { joinChallengeBatch } from "../../../api/userApi";
import CloseIcon from "@material-ui/icons/Close";
import { useAuthenticatedUserContext } from "../../../auth/AuthenticatedUserContext";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import colors from "../../../assets/colors";

const useStyles = makeStyles((theme) => ({
  signInLink: {
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      color: colors.white,
      backgroundColor: colors.almostBlack,
    },
    margin: "0px",
  },
  navLinkButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
    padding: "10px",
  },
}));

export default function ChallengeInvite(props) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const id = props.match.params.id;
  const [challengeDetails, setChallengeDetails] = useState({});
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [displayToast, setDisplayToast] = useState(false);
  const {
    authenticatedUser: { userId },
  } = useAuthenticatedUserContext();

  useEffect(() => {
    getChallenge(id).then((response) => {
      setChallengeDetails(response.data);
    });
  }, [id]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastVisible(false);
  };

  return (
    <Grid
      container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        paddingBottom: "20%",
      }}
    >
      {challengeDetails.participants?.includes(userId) ? (
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={6}
          xl={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography className="form-title">
            You are already a member of
          </Typography>
          <Typography className="form-title-highlight">
            {challengeDetails.title}
          </Typography>
          <NavLink
            to={`/challenge/${challengeDetails.id}`}
            className={classes.navLinkButton}
          >
            <button className="form-button-submit">
              <p className={classes.signInLink}>GO TO CHALLENGE</p>
            </button>
          </NavLink>
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={6}
          xl={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography className="form-title">
            You have been invited to join
          </Typography>
          <Typography className="form-title-highlight">
            {challengeDetails.title}
          </Typography>
          <button
            className="form-button-submit"
            onClick={() =>
              joinChallengeBatch().then((response) => {
                console.log(response.success);
                if (response.success) {
                  setToastMessage(
                    `Successfully joined ${challengeDetails.title}`
                  );
                  setDisplayToast(true);
                } else {
                  setToastMessage(response.message);
                  setDisplayToast(true);
                }
              })
            }
          >
            {isLoading ? null : <Typography>JOIN CHALLENGE</Typography>}
          </button>
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
