import React, { useState, useEffect } from "react";
import firebase from "../../../firebase";
import {
  Typography,
  Avatar,
  IconButton,
  Grid,
  Divider,
  ButtonBase,
} from "@material-ui/core";
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
import { makeStyles } from "@material-ui/core/styles";
import AvatarWidget from "./AvatarWidget";

const useStyles = makeStyles((theme) => ({
  image: {
    position: "relative",
    height: 200,
    borderRadius: "20px",
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
}));

function registerProfilePictureUrl(url) {
  const userId = firebase.auth().currentUser.uid;

  const docRef = firebase.firestore().collection("users").doc(userId);

  return docRef
    .set(
      {
        profilePictureUrl: url,
      },
      { merge: true }
    )
    .then(function () {
      console.log("successfully updated profile picture");
    })
    .catch(function (error) {
      console.log(error);
    });
}

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
  const classes = useStyles();
  const {
    authenticatedUser: { userId },
  } = useAuthenticatedUserContext();
  const {
    user: { displayName, activeChallenges, badges, profilePictureUrl },
  } = useUserContext();
  const [currentProfilePicUrl, setCurrentProfilePicUrl] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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
        },
      });
    }
  }, [activeChallenges, badges, displayName, id, profilePictureUrl, userId]);

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

  function uploadProfilePic(picture) {
    setIsUploading(true);
    const userId = firebase.auth().currentUser.uid;

    var storageRef = firebase.storage().ref();
    var profilePicRef = storageRef.child(`profilePics/${userId}`);
    let uploadProfilePicTask = profilePicRef.put(picture);

    uploadProfilePicTask.on(
      "state_changed",
      function (snapshot) {
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      function (error) {
        console.log(error);
        setIsUploading(false);
      },
      function () {
        uploadProfilePicTask.snapshot.ref
          .getDownloadURL()
          .then(function (downloadURL) {
            console.log("File available at", downloadURL);
            registerProfilePictureUrl(downloadURL);
            setIsUploading(false);
          });
      }
    );
  }

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
            <AvatarWidget />
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
