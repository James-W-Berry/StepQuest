import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../firebase";
import {
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton
} from "@material-ui/core";
import SyncLoader from "react-spinners/SyncLoader";

const useStyles = makeStyles(theme => ({
  root: {
    "&:hover": {
      color: "#E7E5DF80"
    },
    border: 0,
    borderRadius: 3,
    color: "#E7E5DF",
    backgroundColor: "#E7E5DF80",
    height: 48,
    padding: "0 30px"
  },
  textInput: {
    width: "20vw",
    "& label ": {
      color: "#E7E5DF80"
    },
    "& label.Mui-focused": {
      color: "#E7E5DF"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#E7E5DF"
    }
  },
  input: {
    color: "#E7E5DF"
  }
}));

function useDisplayName() {
  const [displayName, setDisplayName] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(doc => {
        const user = doc.data();
        setDisplayName(user.displayName);
      });

    return () => unsubscribe();
  }, []);

  return displayName;
}

function useDownloadProfilePic() {
  const userId = firebase.auth().currentUser.uid;
  const [downloadUrl, setDownloadUrl] = useState("");

  firebase
    .storage()
    .ref()
    .child(`profilePics/${userId}`)
    .getDownloadURL()
    .then(function(url) {
      setDownloadUrl(url);
    })
    .catch(function(error) {
      switch (error.code) {
        case "storage/object-not-found":
          console.log("file does not exist");
          break;
        case "storage/unauthorized":
          console.log("missing permissions");
          break;

        case "storage/canceled":
          console.log("cancelled");
          break;
        case "storage/unknown":
          console.log("unknown server response");
          break;
        default:
          console.log("error retrieving profile picture download url");
          break;
      }
    });

  return downloadUrl;
}

function registerProfilePictureUrl(url) {
  const userId = firebase.auth().currentUser.uid;

  const docRef = firebase
    .firestore()
    .collection("users")
    .doc(userId);

  return docRef
    .set(
      {
        profilePictureUrl: url
      },
      { merge: true }
    )
    .then(function() {
      console.log("successfully updated profile picture");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function onEditDisplayName(displayName) {
  if (displayName !== "") {
    const userId = firebase.auth().currentUser.uid;

    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId);

    return docRef
      .set(
        {
          displayName: displayName
        },
        { merge: true }
      )
      .then(function() {
        console.log("successfully updated display name");
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

const Profile = props => {
  const classes = useStyles();
  const currentDisplayName = useDisplayName();
  const [displayName, setDisplayName] = useState("");
  const currentProfilePicUrl = useDownloadProfilePic();
  const [profilePic, setProfilePic] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function uploadProfilePic(picture) {
    setIsUploading(true);
    const userId = firebase.auth().currentUser.uid;

    var storageRef = firebase.storage().ref();
    var profilePicRef = storageRef.child(`profilePics/${userId}`);
    let uploadProfilePicTask = profilePicRef.put(picture);

    uploadProfilePicTask.on(
      "state_changed",
      function(snapshot) {
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
      function(error) {
        console.log(error);
        setIsUploading(false);
      },
      function() {
        uploadProfilePicTask.snapshot.ref
          .getDownloadURL()
          .then(function(downloadURL) {
            console.log("File available at", downloadURL);
            registerProfilePictureUrl(downloadURL);
            setIsUploading(false);
          });
      }
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px"
          }}
        >
          <label htmlFor="contained-button-file">
            <IconButton>
              <Avatar
                src={currentProfilePicUrl}
                style={{ height: "150px", width: "150px", margin: "10px" }}
              />
            </IconButton>
          </label>

          {isUploading ? (
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
              }}
            >
              <SyncLoader color={"#fdc029"} />
            </div>
          ) : (
            <div>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={e => setProfilePic(e.target.files[0])}
              />
              {profilePic !== "" && (
                <button
                  onClick={() => {
                    uploadProfilePic(profilePic);
                  }}
                >
                  Upload
                </button>
              )}
            </div>
          )}
        </div>

        <Typography variant="h2" style={{ color: "#E7E5DF" }}>
          {currentDisplayName}
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          flex: 3,
          justifyContent: "center",
          marginTop: "80px"
        }}
      >
        <TextField
          className={classes.textInput}
          id="standard-username-input"
          label="update your display name"
          type="username"
          InputProps={{
            className: classes.input
          }}
          onChange={event => {
            setDisplayName(event.target.value);
          }}
        />
        <Button
          className={classes.root}
          onClick={() => {
            onEditDisplayName(displayName);
          }}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default Profile;
