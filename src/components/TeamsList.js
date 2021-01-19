import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import {
  Button,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TotalSteps from "./TotalSteps";
import GroupIcon from "@material-ui/icons/Group";
import AverageMemberSteps from "./AverageMemberSteps";
import colors from "../assets/colors";

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
      borderColor: colors.stepitup_teal,
    },
    "&:after": {
      borderColor: colors.stepitup_teal,
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    "&:hover": {
      color: colors.almostWhite,
    },
    border: 0,
    borderRadius: 3,
    color: colors.almostBlack,
    height: 48,
    padding: "0 30px",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.stepitup_teal,
    fixedHeight: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flexStart",
    overflow: "hidden",
  },
  lightText: {
    color: colors.almostWhite,
  },
  lightTextTitle: {
    color: colors.almostWhite,
    fontSize: "1.25rem",
    fontWeight: "500",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
  },
  title: {
    color: colors.almostBlack,
    fontSize: "1.25rem",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
  },
  scrollbar: {
    [theme.breakpoints.down("sm")]: {
      height: "30vh",
    },
    [theme.breakpoints.up("md")]: {
      height: "80vh",
    },
    width: "100%",
    marginTop: "20px",
    backgroundColor: colors.stepitup_blueishGray,
    overflow: "scroll",
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  focusedGroup: {
    [theme.breakpoints.down("sm")]: {
      borderTop: "1px #19191930 solid",
    },
    [theme.breakpoints.up("md")]: {
      borderLeft: "1px #19191930 solid",
    },
  },
  name: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2rem",
    },
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

export default function TeamsList() {
  const classes = useStyles();

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
        key="teamList"
        xs={12}
        sm={12}
        md={4}
        lg={4}
        xl={4}
        item
        className={classes.userList}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography h1 className={classes.title}>
            Teams
          </Typography>
        </div>

        <Grid
          key="list"
          container
          spacing={4}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper className={classes.scrollbar}>
            {groups.map((group) => (
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
                          color: colors.stepitup_teal,
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
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Grid key="focusedGroup" item xs={12} sm={12} md={8} lg={8} xl={8}>
        {selectedGroup !== "" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flexStart",
              alignItems: "center",
              flex: 2,
            }}
          >
            <div
              style={{
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
                    color: colors.stepitup_teal,
                    height: "120px",
                    width: "120px",
                    margin: "10px",
                  }}
                />
              )}

              <Typography
                variant="h2"
                style={{ color: colors.almostBlack }}
                className={classes.name}
              >
                {selectedGroup.name}
              </Typography>
            </div>

            {groupInfo && totalGroupSteps !== 0 && (
              <Grid container spacing={4}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Paper className={classes.paper} style={{ width: "80%" }}>
                    <TotalSteps
                      title="Total Steps"
                      totalGroupSteps={totalGroupSteps}
                    />
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Paper className={classes.paper} style={{ width: "80%" }}>
                    <AverageMemberSteps
                      groupName={selectedGroup.name}
                      totalGroupSteps={totalGroupSteps}
                      numberOfMembers={Object.entries(groupInfo).length}
                    />
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <React.Fragment>
                    <Paper className={classes.paper} style={{ width: "80%" }}>
                      {groupInfo ? (
                        <div>
                          <Typography h1 className={classes.lightTextTitle}>
                            Members
                          </Typography>
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
                                    <TableCell>
                                      {member[1].displayName}
                                    </TableCell>
                                    <TableCell>
                                      {member[1].totalSteps}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </TableRow>
                        </div>
                      ) : (
                        <Typography h1 className={classes.lightTextTitle}>
                          No Members yet
                        </Typography>
                      )}
                    </Paper>
                  </React.Fragment>
                </Grid>
              </Grid>
            )}
          </div>
        ) : (
          <div
            className={classes.focusedGroup}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography h1 className={classes.title}>
              Select a group to see their stats
            </Typography>
          </div>
        )}
      </Grid>
    </Grid>
  );
}
