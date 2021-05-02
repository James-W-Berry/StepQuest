import React, { useState, useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import colors from "../../../assets/colors";
import { deleteChallenge, getChallenge } from "../../../api/challengeApi";
import {
  Button,
  Divider,
  IconButton,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { getUser } from "../../../api/userApi";
import { NavLink } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { useAuthenticatedUserContext } from "../../../auth/AuthenticatedUserContext";
import DeleteChallengeDialog from "./DeleteChallengeDialog";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import Participants from "./Participants";

function convertSecondsToDate(seconds) {
  const date = new Date(seconds * 1000);
  return date.toDateString();
}

export default function ChallengeDetails(props) {
  const id = props.match.params.id;
  const history = useHistory();
  const [displayConfirmDelete, setDisplayConfirmDelete] = useState(false);
  const [displayToast, setDisplayToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [challengeDetails, setChallengeDetails] = useState({
    isLoading: true,
    success: null,
    data: null,
  });
  const {
    authenticatedUser: { userId },
  } = useAuthenticatedUserContext();
  const [creator, setCreator] = useState();

  useEffect(() => {
    getChallenge(id).then((response) => {
      console.log(response);
      setChallengeDetails(response);
    });
  }, [id]);

  useEffect(() => {
    if (challengeDetails.data) {
      getUser(challengeDetails.data.creator).then((response) => {
        if (response.success) {
          setCreator(response.data.displayName);
        }
      });
    }
  }, [challengeDetails]);

  const handleConfirmationDialogClose = () => {
    setDisplayConfirmDelete(false);
  };

  const handleConfirmationDialogConfirm = () => {
    deleteChallenge(id).then((response) => {
      console.log(response);
      if (response.success) {
        setDisplayConfirmDelete(false);
        setToastMessage(`Successfully deleted ${challengeDetails.data.title}`);
        setDisplayToast(true);
        setTimeout(() => {
          history.push(`/user/${userId}`);
        }, 3000);
      } else {
        setToastMessage(
          `Could not delete ${challengeDetails.data.title}. Please try again later.`
        );
        setDisplayToast(true);
      }
    });
  };

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
        <div>Challenge not found :(</div>
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

      {creator && (
        <div style={{ margin: "20px" }}>
          <Typography>
            Created by{" "}
            <a href={`/users/${challengeDetails.data.creator}`}>{creator}</a>
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
        <Participants users={challengeDetails.data.participants} />
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

      {challengeDetails.data.creator === userId && (
        <div style={{ margin: "20px" }}>
          <Button
            style={{
              backgroundColor: "red",
              color: colors.white,
            }}
            onClick={() => setDisplayConfirmDelete(true)}
          >
            Delete Challenge
          </Button>
        </div>
      )}

      <DeleteChallengeDialog
        isOpen={displayConfirmDelete}
        title={challengeDetails.data.title}
        handleClose={handleConfirmationDialogClose}
        handleConfirm={handleConfirmationDialogConfirm}
      />

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={displayToast}
        autoHideDuration={5000}
        onClose={() => setDisplayToast(false)}
        message={toastMessage}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setDisplayToast(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
