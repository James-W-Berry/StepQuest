import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import {
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TotalMetricCard from "./TotalMetricCard";
import GroupIcon from "@material-ui/icons/Group";
import AverageMemberMetric from "./AverageMemberMetric";
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
    borderRadius: "10px",
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
  },
  title: {
    color: colors.almostBlack,
  },
  scrollbar: {
    [theme.breakpoints.down("sm")]: {
      height: "30vh",
    },
    [theme.breakpoints.up("md")]: {
      height: "70vh",
    },
    width: "100%",
    backgroundColor: colors.stepitup_blueishGray,
    overflow: "scroll",
    borderRadius: "10px",
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

function calculateAvg(total, memberCount) {

  let avg = Math.round(total/memberCount);

  return avg
}

export default function TeamsList() {
  const classes = useStyles();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [totalGroupDuration, setTotalDuration] = useState();
  const [groupInfo, setGroupInfo] = useState();

  useEffect(() => {
    firebase
      .firestore()
      .collection("groups")
      .get()
      .then((groups) => {
        const retrievedGroups = groups.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGroups(retrievedGroups);
      });
  }, []);

  async function handleGroupClicked(group) {
    setSelectedGroup(group);
    const groupInfo = await calculateGroupInfo(group);
    let total = 0;
    let avg = 0;
    Object.entries(groupInfo).forEach((member) => {
      if (member[1].totalDuration) total += member[1].totalDuration;
    });

    avg = calculateAvg(total, Object.entries(groupInfo).length)

    if (group.totalDuration !== total) {
      console.log("updating group total");
      firebase
        .firestore()
        .collection("groups")
        .doc(group.id)
        .set({ totalDuration: total, groupAverage: avg }, { merge: true })
        .catch(function (error) {
          console.log(error);
        });
    }

    setTotalDuration(total);
    setGroupInfo(groupInfo);
  }

  function numberWithCommas(x) {
    if (x !== undefined) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "";
    }
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
          <Typography variant="h5" className={classes.title}>
            Teams
          </Typography>
        </div>

        <Grid
          key="list"
          container
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper className={classes.scrollbar}>
            {groups.map((group) => (
              <div key={group.name}>
                <Button
                  className={classes.button}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
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

            {groupInfo && totalGroupDuration !== 0 && (
              <Grid container spacing={4}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TotalMetricCard
                    style={{ width: "100%" }}
                    title="Total Activity Duration"
                    total={totalGroupDuration}
                    unit="minutes"
                  />
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
                  <AverageMemberMetric
                    style={{ width: "100%" }}
                    groupName={selectedGroup.name}
                    total={totalGroupDuration}
                    numberOfMembers={Object.entries(groupInfo).length}
                  />
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
                  <div>
                    <Paper className={classes.paper} style={{ width: "100%" }}>
                      {groupInfo ? (
                        <div>
                          <Typography
                            variant="h5"
                            className={classes.lightTextTitle}
                          >
                            Members
                          </Typography>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Total Duration (minutes)</TableCell>
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
                                      {numberWithCommas(
                                        member[1].totalDuration
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <Typography
                          variant="h3"
                          className={classes.lightTextTitle}
                        >
                          No Members yet
                        </Typography>
                      )}
                    </Paper>
                  </div>
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
            <Typography variant="h6" className={classes.title}>
              Select a group to see their stats
            </Typography>
          </div>
        )}
      </Grid>
    </Grid>
  );
}
