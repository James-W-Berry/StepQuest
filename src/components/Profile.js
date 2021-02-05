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
  Grid,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
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
import colors from "../assets/colors";
import { AnimatePresence, motion } from "framer-motion";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.stepitup_teal,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: colors.stepitup_lightTeal,
    },
    border: 0,
    borderRadius: 3,
    color: colors.almostBlack,
    backgroundColor: colors.stepitup_teal,
    height: 48,
    padding: "0 30px",
  },
  textInput: {
    width: "100%",
    "& label ": {
      color: "#19191980",
    },
    "& label.Mui-focused": {
      color: "#19191980",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.almostBlack,
    },
  },
  input: {
    color: colors.almostBlack,
  },
  dialogInput: {
    color: colors.almostBlack,
  },
  dialogTextInput: {
    width: "100%",
    "& label ": {
      color: colors.almostBlack,
    },
    "& label.Mui-focused": {
      color: colors.almostBlack,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.stepitup_teal,
    },
  },
  fileUpload: {
    "& > *": {
      margin: theme.spacing(1),
    },
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  fileUploadInput: {
    display: "none",
  },
  settingsGrid: {
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderTop: "1px #19191930 solid",
    alignItems: "center",
  },
}));

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
    backgroundColor: colors.stepitup_blueishGray,
    color: colors.almostBlack,
  },
}))(MuiDialogContent);

const Profile = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const userId = props.userId;
  const user = useUser(userId);
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const currentProfilePicUrl = useDownloadProfilePic();
  const [profilePic, setProfilePic] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [newGroupName, setNewGroupName] = useState();
  const [groups, setGroups] = useState([]);

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
                <GroupIcon style={{ color: colors.stepitup_teal }} />
              </ListItemIcon>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                group.id === user?.groupId ? (
                  <Tooltip title="Leave group" placement="bottom-start">
                    <Typography
                      variant="h6"
                      style={{
                        color: colors.stepitup_teal,
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

  function getGroups() {
    firebase
      .firestore()
      .collection("groups")
      .get()
      .then((retrievedDocs) => {
        const retrievedGroups = retrievedDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGroups(retrievedGroups);
      });
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        key="success"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 1.0] }}
        exit={{ opacity: 0 }}
      >
        <Grid
          container
          spacing={4}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Grid
            key="summary"
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            item
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
                <label htmlFor="contained-button-file">
                  <IconButton>
                    <Avatar
                      src={currentProfilePicUrl}
                      style={{
                        height: "175px",
                        width: "175px",
                      }}
                    />
                  </IconButton>
                </label>
              </div>
            </Grid>

            <Grid key="name" item>
              <Typography variant="h5" style={{ color: colors.almostBlack }}>
                {user?.displayName}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            key="settings"
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className={classes.settingsGrid}
          >
            <Grid key="settings_name" item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
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
                  style={{
                    marginLeft: "10px",
                    color: colors.almostWhite,
                  }}
                >
                  Update
                </Button>
              </div>
            </Grid>

            <Grid
              key="settings_image"
              item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
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
                  <SyncLoader color={colors.stepitup_lightTeal} />
                </div>
              ) : (
                <div className={classes.fileUpload}>
                  <Typography>Change Avatar</Typography>
                  <input
                    accept="image/*"
                    className={classes.fileUploadInput}
                    id="contained-button-file"
                    multiple={false}
                    type="file"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                  />
                  <label htmlFor="contained-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera
                        style={{
                          fontSize: 20,
                          color: colors.stepitup_teal,
                        }}
                      />
                    </IconButton>
                  </label>
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
            </Grid>

            <Grid
              key="settings_group"
              item
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div className={classes.fileUpload}>
                {user?.groupName ? (
                  <Typography>{user?.groupName}</Typography>
                ) : (
                  <Typography>Join a team</Typography>
                )}
                <IconButton
                  color="inherit"
                  aria-label="manage group"
                  edge="start"
                  onClick={() => {
                    setGroups(getGroups);
                    setOpen(true);
                  }}
                >
                  <SettingsIcon
                    style={{
                      fontSize: 20,
                      color: colors.stepitup_teal,
                    }}
                  />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </Grid>

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
              backgroundColor: colors.almostBlack,
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
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
                gutterBottom
              >
                {user?.groupName ? (
                  `Currently a member of ${user?.groupName}`
                ) : (
                  <Emoji text="Currently you're ridin' solo :(" />
                )}
              </Typography>
              <Typography gutterBottom>Pick a group to join</Typography>
            </div>
            <div style={{ backgroundColor: colors.stepitup_blueishGray }}>
              <Scrollbar style={{ height: "50vh", width: "100%" }}>
                <List style={{ borderRadius: "10px" }}>
                  {groups?.map((group) => createGroupItem(group))}
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
              <Typography>Or create a new group</Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  className={classes.dialogTextInput}
                  label="New group name"
                  InputProps={{
                    className: classes.dialogInput,
                  }}
                  onChange={(event) => {
                    setNewGroupName(event.target.value);
                  }}
                />

                <Button
                  style={{
                    marginLeft: "10px",
                    backgroundColor: colors.stepitup_teal,
                    color: colors.almostWhite,
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
      </motion.div>
    </AnimatePresence>
  );
};

export default Profile;
