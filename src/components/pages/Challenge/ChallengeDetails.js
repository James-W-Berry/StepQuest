import React, { useState, useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import colors from "../../../assets/colors";
import {
  addAdmins,
  deleteChallenge,
  getChallenge,
} from "../../../api/challengeApi";
import {
  Button,
  Divider,
  IconButton,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { getUser, joinChallenge, leaveChallenge } from "../../../api/userApi";
import {
  addUserToChallenge,
  removeUserFromChallenge,
  removeAdminFromChallenge,
} from "../../../api/challengeApi";
import { NavLink } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { useAuthenticatedUserContext } from "../../../auth/AuthenticatedUserContext";
import DeleteChallengeDialog from "./DeleteChallengeDialog";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import Participants from "./Participants";
import LeaveChallengeDialog from "./LeaveChallengeDialog";
import AddAdminDialog from "./AddAdminDialog";

function convertSecondsToDate(seconds) {
  const date = new Date(seconds * 1000);
  return date.toDateString();
}

export default function ChallengeDetails(props) {
  const id = props.match.params.id;
  const history = useHistory();
  const [displayConfirmDelete, setDisplayConfirmDelete] = useState(false);
  const [displayConfirmLeave, setDisplayConfirmLeave] = useState(false);
  const [displayAddAdmin, setDisplayAddAdmin] = useState(false);
  const [
    attemptedSoloAdminDeparture,
    setAttemptedSoloAdminDeparture,
  ] = useState(false);
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

  const handleDeleteDialogClose = () => {
    setDisplayConfirmDelete(false);
  };

  const handleLeaveDialogClose = () => {
    setAttemptedSoloAdminDeparture(false);
    setDisplayConfirmLeave(false);
  };

  const handleAddAdminClose = () => {
    setDisplayAddAdmin(false);
  };

  const handleDeleteConfirmed = () => {
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

  const handleLeaveConfirmed = () => {
    if (
      challengeDetails.data.admin.includes(userId) &&
      challengeDetails.data.admin.length <= 1
    ) {
      setAttemptedSoloAdminDeparture(true);
      setDisplayAddAdmin(true);
    } else {
      leaveChallenge(userId, id).then((response) => {
        console.log(response);
        if (response.success) {
          removeUserFromChallenge(userId, id).then((response) => {
            if (response.success) {
              removeAdminFromChallenge(userId, id).then((response) => {
                if (response.success) {
                  setDisplayConfirmLeave(false);
                  setToastMessage(
                    `Successfully left ${challengeDetails.data.title}`
                  );
                  setDisplayToast(true);

                  setTimeout(() => {
                    history.push(`/user/${userId}`);
                  }, 3000);
                }
              });
            }
          });
        } else {
          setToastMessage(
            `Could not leave ${challengeDetails.data.title}. Please try again later.`
          );
          setDisplayToast(true);
        }
      });
    }
  };

  const handleAddAdminConfirmed = (admins) => {
    addAdmins(admins, id).then((response) => {
      console.log(response);
      if (response.success) {
        setDisplayAddAdmin(false);
        setToastMessage(response.message);
        setDisplayToast(true);
      } else {
        setToastMessage(`Could not add admin. Please try again later.`);
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

      {challengeDetails.data.participants.includes(userId) ? (
        <div style={{ margin: "20px" }}>
          <Typography variant="h5">Danger Zone</Typography>
          <Button
            style={{
              backgroundColor: "red",
              color: colors.white,
            }}
            onClick={() => setDisplayConfirmLeave(true)}
          >
            Leave Challenge
          </Button>
        </div>
      ) : (
        <div style={{ margin: "20px" }}>
          <Typography variant="h5">Join this Challenge</Typography>
          <Button
            style={{
              backgroundColor: "red",
              color: colors.white,
            }}
            onClick={() =>
              joinChallenge(userId, id).then((response) => {
                console.log(response);
                if (response.success) {
                  addUserToChallenge(userId, id).then((response) => {
                    console.log(response);
                  });
                }
              })
            }
          >
            Join
          </Button>
        </div>
      )}

      {challengeDetails.data.admin.includes(userId) && (
        <div>
          <div style={{ margin: "20px" }}>
            <Button
              style={{
                backgroundColor: "red",
                color: colors.white,
              }}
              onClick={() => setDisplayAddAdmin(true)}
            >
              Add Challenge Admin
            </Button>
          </div>
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
        </div>
      )}

      <DeleteChallengeDialog
        isOpen={displayConfirmDelete}
        title={challengeDetails.data.title}
        handleClose={handleDeleteDialogClose}
        handleConfirm={handleDeleteConfirmed}
      />

      <LeaveChallengeDialog
        isOpen={displayConfirmLeave}
        title={challengeDetails.data.title}
        handleClose={handleLeaveDialogClose}
        handleConfirm={handleLeaveConfirmed}
      />

      <AddAdminDialog
        isOpen={displayAddAdmin}
        title={challengeDetails.data.title}
        handleClose={handleAddAdminClose}
        handleConfirm={handleAddAdminConfirmed}
        attemptedSoloAdminDeparture={attemptedSoloAdminDeparture}
        participants={challengeDetails.data.participants}
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
