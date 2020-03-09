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

function onEditDisplayName(displayName) {
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

const Profile = props => {
  const classes = useStyles();
  const currentDisplayName = useDisplayName();
  const [displayName, setDisplayName] = useState();
  const photoUrl = "../assets/walking.jpg";

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
        <IconButton>
          <Avatar
            style={{ height: "100px", width: "100px", margin: "10px" }}
            alt={currentDisplayName}
            src={photoUrl}
          />
        </IconButton>
        <Typography variant="h2" style={{ color: "#E7E5DF" }}>
          {currentDisplayName}
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          flex: 3,
          justifyContent: "center",
          alignItems: "flexStart"
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
