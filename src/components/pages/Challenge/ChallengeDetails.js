import React, { useState, useEffect } from "react";
import colors from "../../../assets/colors";
import {
  addAdmins,
  deleteChallenge,
  getChallenge,
  getChallengeLogs,
} from "../../../api/challengeApi";
import { Grid, IconButton, Snackbar, Typography } from "@material-ui/core";
import { leaveChallengeBatch } from "../../../api/userApi";
import { useAuthenticatedUserContext } from "../../../auth/AuthenticatedUserContext";
import DeleteChallengeDialog from "./DeleteChallengeDialog";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import Participants from "./Participants";
import LeaveChallengeDialog from "./LeaveChallengeDialog";
import AddAdminDialog from "./AddAdminDialog";
import UserActivityCalendar from "./UserActivityCalendar";
import ChallengeTotalChart from "./ChallengeTotalChart";
import { getIdToNameMappings } from "../../../api/mappingApi";
import MissingChallenge from "./MissingChallenge";
import photo_0 from "../../../assets/weightlifting_0.png";
import SettingsAccordion from "./SettingsAccordion";

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
  const [attemptedSoloAdminDeparture, setAttemptedSoloAdminDeparture] =
    useState(false);
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
  const [challengeLogs, setChallengeLogs] = useState();
  const [idToNameMappings, setIdToNameMappings] = useState();

  useEffect(() => {
    getChallenge(id).then((response) => {
      console.log(response);
      setChallengeDetails(response);
    });
  }, [id]);

  useEffect(() => {
    if (challengeDetails.data) {
      getIdToNameMappings().then((response) => {
        if (response.success) {
          setCreator(response.data[challengeDetails.data.creator]);
          setIdToNameMappings(response.data);
        }
      });
    }
  }, [challengeDetails]);

  useEffect(() => {
    getChallengeLogs(id).then((response) => {
      setChallengeLogs(response.data);
    });
  }, [id]);

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
      leaveChallengeBatch(userId, id).then((response) => {
        if (response.success) {
          setDisplayConfirmLeave(false);
          setToastMessage(`Successully left ${challengeDetails.data.title}`);
          setDisplayToast(true);
          setTimeout(() => {
            history.push(`/user/${userId}`);
          }, 3000);
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      />
    );
  }

  if (!challengeDetails.success) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
          width: "100%",
        }}
      >
        <MissingChallenge />
      </div>
    );
  }

  return (
    <Grid container style={{ display: "flex" }}>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
        xl={6}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: colors.stepQuestPaleOrangeFaded,
          padding: "20px 40px",
        }}
      >
        <Typography className="form-title">
          {challengeDetails.data.title}
        </Typography>
        <Typography className="section-body">
          Challenge Activity: {challengeDetails.data.activity}
        </Typography>
        <Typography className="section-body">
          {challengeDetails.data.description}
        </Typography>
        <Typography className="section-body" style={{ marginTop: "20px" }}>
          Start: {convertSecondsToDate(challengeDetails.data.startDate.seconds)}
        </Typography>
        <Typography className="section-body">
          End: {convertSecondsToDate(challengeDetails.data.endDate.seconds)}
        </Typography>
        {creator && (
          <Typography className="section-body" style={{ marginTop: "20px" }}>
            Created by{" "}
            <a href={`/users/${challengeDetails.data.creator}`}>{creator}</a>
          </Typography>
        )}
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
        xl={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.stepQuestPaleOrangeFaded,
        }}
      >
        <img
          alt="challenge-pic"
          src={photo_0}
          style={{ maxWidth: "100%", maxHeight: "80%" }}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <SettingsAccordion
          userId={userId}
          challengeDetails={challengeDetails}
          setDisplayConfirmDelete={setDisplayConfirmDelete}
          setDisplayConfirmLeave={setDisplayConfirmLeave}
          setDisplayAddAdmin={setDisplayAddAdmin}
        />
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{ margin: "20px" }}
      >
        <Typography className="form-section">Challenge Stats</Typography>
        <ChallengeTotalChart
          idToNameMappings={idToNameMappings}
          logs={challengeLogs}
        />
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{ margin: "20px" }}
      >
        <Typography className="form-section">Standings</Typography>
        <Participants
          logs={challengeLogs}
          participantMappings={idToNameMappings}
        />
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{ margin: "20px" }}
      >
        <Typography className="form-section">
          Your Challenge Activities
        </Typography>
        <UserActivityCalendar
          user={userId}
          challenge={id}
          startDate={challengeDetails.data.startDate.seconds}
          endDate={challengeDetails.data.endDate.seconds}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
      </Grid>
    </Grid>
  );
}
