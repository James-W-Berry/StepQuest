import React, { useState, useEffect } from "react";
import { Typography, Grid, Snackbar, IconButton } from "@material-ui/core";
import colors from "../../../assets/colors";
import EditableTextField from "../../fields/EditableTextField";
import { useAuthenticatedUserContext } from "../../../auth/AuthenticatedUserContext";
import {
  getChallenges,
  getUser,
  removeEndedChallenges,
  updateUsernameBatch,
} from "../../../api/userApi";
import { NavLink } from "react-router-dom";
import Badge from "./Badge";
import { useUserContext } from "./UserContext";
import ChallengesSection from "./ChallengesSection";
import AvatarWidget from "./AvatarWidget";
import { Close } from "@material-ui/icons";
import MissingUser from "./MissingUser";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const Profile = (props) => {
  const theme = useTheme();
  const isAboveMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const {
    authenticatedUser: { userId },
  } = useAuthenticatedUserContext();
  const {
    user: {
      id,
      displayName,
      activeChallenges,
      badges,
      profilePictureUrl,
      avatar,
    },
  } = useUserContext();
  const [focusedSection, setFocusedSection] = useState(
    props.location.pathname.split("/").pop()
  );
  const [activeChallengeData, setActiveChallengeData] = useState([]);
  const [profileDetails, setProfileDetails] = useState({
    isLoading: true,
    success: null,
    data: {},
  });
  const [displayToast, setDisplayToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [newDisplayName, setNewDisplayName] = useState();

  useEffect(() => {
    if (userId) {
      getUser(userId).then((response) => {
        setProfileDetails(response);
      });
    } else {
      setProfileDetails({
        isLoading: false,
        success: true,
        data: {
          displayName,
          activeChallenges,
          badges,
          profilePictureUrl,
          avatar,
        },
      });
    }
  }, [
    activeChallenges,
    badges,
    displayName,
    id,
    profilePictureUrl,
    userId,
    avatar,
  ]);

  const onEditDisplayName = (newName) => {
    if (newName !== "" && newName !== displayName) {
      updateUsernameBatch(userId, newName).then((response) => {
        console.log(response);
        if (response.success) {
          setNewDisplayName(newName);
          setProfileDetails({
            isLoading: false,
            success: true,
            data: {
              displayName: newName,
              activeChallenges,
              badges,
              profilePictureUrl,
              avatar,
            },
          });
          setToastMessage("Successfully updated your display name!");
          setDisplayToast(true);
        } else {
          setToastMessage(
            "Could not update your display name! Please try again later."
          );
          setDisplayToast(true);
        }
      });
    }
  };

  const updateLocalAvatar = (newAvatar) => {
    setProfileDetails({
      isLoading: false,
      success: true,
      data: {
        displayName: newDisplayName ? newDisplayName : displayName,
        activeChallenges,
        badges,
        profilePictureUrl,
        avatar: newAvatar,
      },
    });
  };

  useEffect(() => {
    if (profileDetails.data && profileDetails.data.activeChallenges)
      getChallenges(profileDetails.data.activeChallenges).then((response) => {
        setActiveChallengeData(response);
        if (response.length !== profileDetails.data.activeChallenges.length) {
          removeEndedChallenges(
            userId,
            profileDetails.data.activeChallenges,
            response
          ).then((response) => {
            console.log(response);
          });
        }
      });
  }, [profileDetails]);

  useEffect(() => {
    setFocusedSection(props.location.pathname.split("/").pop());
  }, [props.location.pathname]);

  if (profileDetails.isLoading) {
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

  if (!profileDetails.success) {
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
        <MissingUser />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: colors.stepQuestLightGray,
        height: "100%",
      }}
    >
      <Grid
        container
        style={{
          display: "flex",
          height: "100%",
          flexWrap: isAboveMediumScreen ? "nowrap" : "wrap",
        }}
      >
        <Grid
          key="summary"
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.stepQuestPaleOrangeFaded,
            height: isAboveMediumScreen ? "100%" : "50%",
          }}
        >
          <div
            key="picture"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <AvatarWidget
              userId={userId}
              currentAvatar={profileDetails.data.avatar}
              updateLocalAvatar={updateLocalAvatar}
            />
          </div>

          <EditableTextField
            key="name"
            label="Display Name"
            current={profileDetails.data.displayName}
            updateField={(name) => onEditDisplayName(name)}
          />

          {isAboveMediumScreen && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <NavLink
                to={`/profile`}
                className={
                  focusedSection === "profile" ? "bold-nav-text" : "nav-text"
                }
              >
                <Typography>Overview</Typography>
              </NavLink>
              <NavLink
                to={`/profile/awards`}
                className={
                  focusedSection === "awards" ? "bold-nav-text" : "nav-text"
                }
              >
                <Typography>Awards</Typography>
              </NavLink>
              <NavLink
                to={`/profile/challenges`}
                className={
                  focusedSection === "challenges" ? "bold-nav-text" : "nav-text"
                }
              >
                <Typography>Challenges</Typography>
              </NavLink>
            </div>
          )}
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={9}
          lg={9}
          xl={9}
          style={{
            display: "flex",
            justifyContent: "center",
            overflowY: "scroll",
          }}
        >
          {focusedSection === "profile" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "20px",
              }}
            >
              <Typography variant="h5">Awards</Typography>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profileDetails.data.badges.map((badge, index) => {
                  return <Badge data={badge} key={index} />;
                })}
              </div>
              <ChallengesSection
                userId={userId}
                user={profileDetails.data}
                id={id}
                activeChallenges={profileDetails.data.activeChallenges}
                activeChallengeData={activeChallengeData}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  minHeight: "50px",
                }}
              />
            </div>
          )}
          {focusedSection === "awards" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px",
              }}
            >
              <Typography variant="h5">Awards</Typography>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profileDetails.data.badges.map((badge, index) => {
                  return <Badge data={badge} key={index} />;
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  minHeight: "50px",
                }}
              />
            </div>
          )}
          {focusedSection === "challenges" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px",
              }}
            >
              <ChallengesSection
                userId={userId}
                user={profileDetails.data}
                id={id}
                activeChallenges={profileDetails.data.activeChallenges}
                activeChallengeData={activeChallengeData}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  minHeight: "50px",
                }}
              />
            </div>
          )}
          {focusedSection === "settings" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>Show the settings here</Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  minHeight: "50px",
                }}
              />
            </div>
          )}
        </Grid>
      </Grid>

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
              <Close fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
};

export default Profile;
