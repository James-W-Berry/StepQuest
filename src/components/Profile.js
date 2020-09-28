import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../firebase";
import {
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
  Tooltip,
  ListItemIcon,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import SyncLoader from "react-spinners/SyncLoader";
import Scrollbar from "react-scrollbars-custom";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import GroupIcon from "@material-ui/icons/Group";
import Emoji from "react-emoji-render";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#fdc029",
  },
});

const SORT_OPTIONS = {
  STEPS_ASC: { column: "totalSteps", direction: "asc" },
  STEPS_DESC: { column: "totalSteps", direction: "desc" },
};

const useStyles = makeStyles((theme) => ({
  root: {
    "&:hover": {
      color: "#E7E5DF80",
    },
    border: 0,
    borderRadius: 3,
    color: "#E7E5DF",
    backgroundColor: "#E7E5DF80",
    height: 48,
    padding: "0 30px",
  },
  textInput: {
    width: "20vw",
    "& label ": {
      color: "#E7E5DF80",
    },
    "& label.Mui-focused": {
      color: "#E7E5DF",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#E7E5DF",
    },
  },
  input: {
    color: "#E7E5DF",
  },
}));

function useDisplayName() {
  const [displayName, setDisplayName] = useState([]);
  const userId = firebase.auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((doc) => {
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
    .then(function (url) {
      setDownloadUrl(url);
    })
    .catch(function (error) {
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

async function updateGroup(group) {
  const userId = firebase.auth().currentUser.uid;
  const docRef = firebase.firestore().collection("users").doc(userId);

  try {
    await docRef.set(
      {
        groupId: group.id,
        groupName: group.name,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

async function joinGroup(group, userId, user) {
  const docRef = firebase
    .firestore()
    .collection("groups")
    .doc(group.id)
    .collection("members")
    .doc(userId);

  try {
    await docRef.set({
      name: user.displayName,
    });
  } catch (error) {
    console.log(error);
  }
}

async function leaveGroup(group, userId) {
  const docRef = firebase
    .firestore()
    .collection("groups")
    .doc(group.id)
    .collection("members")
    .doc(userId);

  try {
    await docRef.delete();
  } catch (error) {
    console.log(error);
  }
}

function addNewGroup(groupName, userId) {
  if (groupName) {
    const docRef = firebase.firestore().collection("groups").doc();

    return docRef
      .set(
        {
          name: groupName,
          members: [userId],
        },
        { merge: true }
      )
      .then(function () {
        console.log("successfully added new group");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function useGroups(sortBy = "STEPS_DESC") {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("groups")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .onSnapshot((snapshot) => {
        const retrievedGroups = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGroups(retrievedGroups);
      });

    return () => unsubscribe();
  }, [sortBy]);
  return groups;
}

function useUser(userId) {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((snapshot) => {
        const doc = {
          ...snapshot.data(),
        };
        setUser(doc);
      });

    return () => unsubscribe();
  }, [userId]);

  return user;
}

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{ color: "#f7f7f5" }} variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: "#252a2e",
    color: "#f7f7f5",
  },
}))(MuiDialogContent);

const Profile = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const currentDisplayName = useDisplayName();
  const [displayName, setDisplayName] = useState("");
  const currentProfilePicUrl = useDownloadProfilePic();
  const [profilePic, setProfilePic] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [newGroupName, setNewGroupName] = useState();
  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const groups = useGroups(sortBy);
  const [userId, setUserId] = useState(props.userId);
  const user = useUser(userId);

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

  function createGroupItem(group) {
    if (group !== undefined) {
      return (
        <div key={group.id}>
          <ListItem
            key={group.id}
            style={{
              backgroundColor: "#252a2e",
              marginBottom: "1px",
            }}
            button={true}
            onClick={() => {
              group.id === user.groupId
                ? leaveGroup(group, userId).then(
                    updateGroup({ id: null, name: null })
                  )
                : user.groupId !== null
                ? leaveGroup({ id: user.groupId, name: user.groupName }, userId)
                    .then(joinGroup(group, userId, user))
                    .then(updateGroup(group))
                : joinGroup(group, userId, user).then(updateGroup(group));
            }}
          >
            <ListItemAvatar>
              <ListItemIcon>
                <GroupIcon style={{ color: "#fdc029" }} />
              </ListItemIcon>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                group.id === user.groupId ? (
                  <Tooltip title="Leave group" placement="bottom-start">
                    <Typography
                      variant="h6"
                      style={{
                        color: "#fdc029",
                      }}
                    >
                      {group.name}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Tooltip title="Join group" placement="bottom-start">
                    <Typography
                      variant="h6"
                      style={{
                        color: "#f7f7f5",
                      }}
                    >
                      {group.name}
                    </Typography>
                  </Tooltip>
                )
              }
            />
          </ListItem>
        </div>
      );
    }
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
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
                flexDirection: "column",
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
                onChange={(e) => setProfilePic(e.target.files[0])}
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
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        <div style={{ marginTop: "60px" }}>
          <TextField
            className={classes.textInput}
            id="standard-username-input"
            label="update your display name"
            type="username"
            InputProps={{
              className: classes.input,
            }}
            onChange={(event) => {
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

        <div
          style={{
            display: "flex",
            marginTop: "30px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            className={classes.root}
            onClick={() => {
              setOpen(true);
            }}
          >
            Manage Group
          </Button>
        </div>
      </div>

      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#393E41",
          }}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Group Settings
          </DialogTitle>
        </div>

        <DialogContent dividers>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              style={{
                color: "#f7f7f5",
                fontSize: "16px",
                marginBottom: "10px",
              }}
              gutterBottom
            >
              {user?.groupName ? (
                `Currently a member of ${user?.groupName}`
              ) : (
                <Emoji text="Currently you're steppin' solo :(" />
              )}
            </Typography>
            <Typography style={{ color: "#f7f7f5" }} gutterBottom>
              Pick a group to join
            </Typography>
          </div>
          <div style={{ backgroundColor: "#f7f7f5" }}>
            <Scrollbar style={{ height: "30vh", width: "100%" }}>
              <List style={{ borderRadius: "10px" }}>
                {groups.map((group) => createGroupItem(group))}
              </List>
            </Scrollbar>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "30px",
            }}
          >
            <Typography
              style={{
                color: "#f7f7f5",
              }}
              gutterBottom
            >
              Or create a new group
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                className={classes.textInput}
                label="New group name"
                InputProps={{
                  className: classes.input,
                }}
                onChange={(event) => {
                  setNewGroupName(event.target.value);
                }}
              />

              <Button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#fdc029",
                  color: "#191919",
                }}
                onClick={() => {
                  addNewGroup(newGroupName, userId);
                }}
                color="primary"
              >
                <Typography>Create</Typography>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
