import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Divider,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import colors from "../../../assets/colors";
import EditableTextField from "../../fields/EditableTextField";
import { useAuthenticatedUserContext } from "../../../auth/AuthenticatedUserContext";
import {
  getChallenges,
  getUser,
  removeEndedChallenges,
  updateUsernameBatch,
} from "../../../api/userApi";
import Badge from "./Badge";
import { useUserContext } from "./UserContext";
import ChallengesSection from "./ChallengesSection";
import AvatarWidget from "./AvatarWidget";
import { Close } from "@material-ui/icons";
import MissingUser from "./MissingUser";
import Loading from "../../Loading";

const Profile = (props) => {
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
      >
        <Loading />
      </div>
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
    <div>
      {focusedSection === "profile" && (
        <div>
          <Grid
            key="summary"
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid key="picture" item>
              <div
                style={{
                  display: "flex",
                  flex: 1,
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
            </Grid>

            <Grid key="name" item>
              {userId === id ? (
                <EditableTextField
                  label="Display Name"
                  variant="h4"
                  current={profileDetails.data.displayName}
                  updateField={(name) => onEditDisplayName(name)}
                />
              ) : (
                <Typography variant="h4" style={{ color: colors.almostBlack }}>
                  {profileDetails.data.displayName}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider variant="fullWidth" style={{ margin: "20px" }} />

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {profileDetails.data.badges && (
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
              </div>
            )}
          </Grid>

          <ChallengesSection
            userId={userId}
            user={profileDetails.data}
            id={id}
            activeChallenges={profileDetails.data.activeChallenges}
            activeChallengeData={activeChallengeData}
          />
        </div>
      )}
      {focusedSection === "challenges" && (
        <ChallengesSection
          userId={userId}
          user={profileDetails.data}
          id={id}
          activeChallenges={profileDetails.data.activeChallenges}
          activeChallengeData={activeChallengeData}
        />
      )}
      {focusedSection === "settings" && (
        <Typography>Show the settings here</Typography>
      )}

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
