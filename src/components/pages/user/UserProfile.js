import React, { useState, useEffect } from "react";
import firebase from "../../../firebase";
import { Typography, Grid, Divider } from "@material-ui/core";
import SyncLoader from "react-spinners/SyncLoader";
import colors from "../../../assets/colors";
import EditableTextField from "../../fields/EditableTextField";
import { useAuthenticatedUserContext } from "../../../auth/AuthenticatedUserContext";
import {
  getChallenges,
  getUser,
  removeEndedChallenges,
} from "../../../api/userApi";
import Badge from "./Badge";
import { useUserContext } from "./UserContext";
import ChallengesWidget from "./ChallengesWidget";
import AvatarWidget from "./AvatarWidget";

function onEditDisplayName(displayName) {
  if (displayName !== "") {
    const userId = firebase.auth().currentUser.uid;

    const docRef = firebase.firestore().collection("users").doc(userId);

    return docRef
      .set(
        {
          displayName: displayName,
        },
        { merge: true }
      )
      .then(function () {
        console.log("successfully updated display name");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

const Profile = (props) => {
  const {
    authenticatedUser: { userId },
  } = useAuthenticatedUserContext();
  const {
    user: { displayName, activeChallenges, badges, profilePictureUrl, avatar },
  } = useUserContext();
  const [activeChallengeData, setActiveChallengeData] = useState([]);
  const id = props.match.params.id;
  const [profileDetails, setProfileDetails] = useState({
    isLoading: true,
    success: null,
    data: {},
  });

  useEffect(() => {
    if (id !== userId) {
      getUser(id).then((response) => {
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

  const updateLocalAvatar = (newAvatar) => {
    setProfileDetails({
      isLoading: false,
      success: true,
      data: {
        displayName,
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
        <SyncLoader color={colors.stepitup_blue} />
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

      <ChallengesWidget
        userId={userId}
        user={profileDetails.data}
        id={id}
        activeChallenges={profileDetails.data.activeChallenges}
        activeChallengeData={activeChallengeData}
      />
    </div>
  );
};

export default Profile;
