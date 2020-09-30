import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TotalSteps from "./TotalSteps";
import Title from "./Title";
import Scrollbar from "react-scrollbars-custom";
import GroupIcon from "@material-ui/icons/Group";
import AverageMemberSteps from "./AverageMemberSteps";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 240,
  },
  root: {
    color: "#E7E5DF",
  },
  select: {
    "&:before": {
      borderColor: "#fdc029",
    },
    "&:after": {
      borderColor: "#fdc029",
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    "&:hover": {
      color: "#fdc029",
    },
    border: 0,
    borderRadius: 3,
    color: "white",
    height: 48,
    padding: "0 30px",
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#E7E5DF",
    fixedHeight: 240,
    maxWidth: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flexStart",
    overflow: "hidden",
  },
  gridList: {
    width: "30vw",
    height: "70vh",
  },
  gridTile: {
    width: "100%",
    height: "100%",
    borderWidth: "1px",
    "&:hover": {
      color: "#fdc029",
    },
    border: 0,
    borderRadius: 3,
    color: "white",
    padding: "0 30px",
  },
}));

const SORT_OPTIONS = {
  STEPS_ASC: { column: "totalSteps", direction: "asc" },
  STEPS_DESC: { column: "totalSteps", direction: "desc" },
};

function useGroups(sortBy = "STEPS_DESC") {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("groups")
      // .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
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

async function calculateGroupInfo(group) {
  return await firebase
    .firestore()
    .collection("users")
    .where("groupId", "==", group.id)
    .get()
    .then((docs) => {
      let members = {};
      docs.forEach((member) => {
        members[member.id] = member.data();
      });
      return members;
    })
    .catch(function (error) {
      console.log(error);
    });
}

export default function GroupsList() {
  const classes = useStyles();
  const selectStyle = clsx(classes.root, classes.select);

  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const [selectedGroup, setSelectedGroup] = useState("");
  const groups = useGroups(sortBy);
  const [totalGroupSteps, setTotalGroupSteps] = useState();
  const [groupInfo, setGroupInfo] = useState();

  // const handleFilterChange = (event) => {
  //   setSortBy(event.target.value);
  // };

  async function handleGroupClicked(group) {
    setSelectedGroup(group);
    const groupInfo = await calculateGroupInfo(group);
    let total = 0;
    Object.entries(groupInfo).forEach((member) => {
      total += member[1].totalSteps;
    });

    firebase
      .firestore()
      .collection("groups")
      .doc(group.id)
      .set({ totalSteps: total }, { merge: true })
      .catch(function (error) {
        console.log(error);
      });

    setTotalGroupSteps(total);
    setGroupInfo(groupInfo);
  }

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          borderRightWidth: "1px",
          borderRightColor: "#171820",
        }}
      >
        <h1>Group Stats</h1>

        <Scrollbar style={{ height: "70vh", width: "30vw" }}>
          <ol>
            {groups.map((group) => (
              <li key={group.id}>
                <div>
                  <Button
                    className={classes.button}
                    onClick={() => handleGroupClicked(group)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {group.profilePictureUrl ? (
                        <Avatar
                          src={group.profilePictureUrl}
                          style={{
                            height: "30px",
                            width: "30px",
                            margin: "10px",
                          }}
                        />
                      ) : (
                        <GroupIcon
                          style={{
                            color: "#fdc029",
                            height: "30px",
                            width: "30px",
                            margin: "10px",
                          }}
                        />
                      )}
                      {group.name}
                    </div>
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </Scrollbar>
      </div>

      {selectedGroup !== "" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flexStart",
            alignItems: "center",
            flex: 2,
            marginRight: "40px",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flexStart",
              alignItems: "center",
            }}
          >
            {selectedGroup.profilePictureUrl ? (
              <Avatar
                src={selectedGroup.profilePictureUrl}
                style={{
                  height: "120px",
                  width: "120px",
                  margin: "10px",
                }}
              />
            ) : (
              <GroupIcon
                style={{
                  color: "#fdc029",
                  height: "120px",
                  width: "120px",
                  margin: "10px",
                }}
              />
            )}

            <Typography variant="h2">{selectedGroup.name}</Typography>
          </div>

          {groupInfo && totalGroupSteps !== 0 && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ marginTop: "20px", marginRight: "10px" }}>
                <Paper className={classes.paper}>
                  <TotalSteps
                    title="Total Steps"
                    totalGroupSteps={totalGroupSteps}
                  />
                </Paper>
              </div>
              <div style={{ marginTop: "20px", marginLeft: "10px" }}>
                <Paper className={classes.paper}>
                  <AverageMemberSteps
                    groupName={selectedGroup.name}
                    totalGroupSteps={totalGroupSteps}
                    numberOfMembers={Object.entries(groupInfo).length}
                  />
                </Paper>
              </div>
            </div>
          )}

          {groupInfo ? (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ marginTop: "20px", marginRight: "10px" }}>
                <Paper className={classes.paper}>
                  <Title>Members</Title>
                  <TableRow size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Total Steps</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupInfo &&
                        Object.entries(groupInfo).map((member) => (
                          <TableRow key={member[0]}>
                            <TableCell>{member[1].displayName}</TableCell>
                            <TableCell>{member[1].totalSteps}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </TableRow>
                </Paper>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ marginTop: "20px", marginRight: "10px" }}>
                <Paper className={classes.paper}>
                  <Title>No Members yet</Title>
                </Paper>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
