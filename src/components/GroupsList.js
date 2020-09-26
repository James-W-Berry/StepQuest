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
import moment from "moment";
import AverageSteps from "./AverageSteps";
import Scrollbar from "react-scrollbars-custom";
import GroupIcon from "@material-ui/icons/Group";

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

async function calculateDailyTotals(user) {
  let response = await firebase
    .firestore()
    .collection("users")
    .doc(user.id)
    .collection("steps")
    .orderBy("steps", "desc")
    .get()
    .then(function (docs) {
      const userSteps = docs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return userSteps;
    });
  let top5 = response.slice(0, 5);
  let values = {
    top5: top5,
    allDays: response,
  };
  return values;
}

export default function GroupsList() {
  const classes = useStyles();
  const selectStyle = clsx(classes.root, classes.select);

  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupDailyTotals, setGroupDailyTotals] = useState([]);
  const [top5GroupDailyTotals, setTop5GroupDailyTotals] = useState([]);
  const groups = useGroups(sortBy);

  const handleFilterChange = (event) => {
    setSortBy(event.target.value);
  };

  async function handleGroupClicked(group) {
    setSelectedGroup(group);
    let totals = await calculateDailyTotals(group);
    setGroupDailyTotals(totals.allDays);
    setTop5GroupDailyTotals(totals.top5);
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
        <h1>Group Ranking</h1>
        <FormControl className={classes.formControl}>
          <InputLabel id="sortSelectLabel" style={{ color: "#E7E5DF" }}>
            Sort By
          </InputLabel>
          <Select
            className={selectStyle}
            labelId="sortSelectLabel"
            id="sortSelect"
            value={sortBy}
            onChange={handleFilterChange}
          >
            <MenuItem value={"STEPS_DESC"}>Steps (most first)</MenuItem>
            <MenuItem value={"STEPS_ASC"}>Steps (least first)</MenuItem>
          </Select>
        </FormControl>

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

            <Typography variant="h2">{selectedGroup.displayName}</Typography>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginTop: "20px", marginRight: "10px" }}>
              <Paper className={classes.paper}>
                <TotalSteps
                  title={"Total Steps"}
                  totalGroupSteps={selectedGroup.totalSteps}
                />
              </Paper>
            </div>
            <div style={{ marginTop: "20px", marginLeft: "10px" }}>
              <Paper className={classes.paper}>
                <AverageSteps
                  totalGroupSteps={selectedGroup.totalSteps}
                  numberOfDays={selectedGroup.length}
                />
              </Paper>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginTop: "20px", marginRight: "10px" }}>
              <Paper className={classes.paper}>
                <Title>Tops Days</Title>
                <TableRow size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Total Steps</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {top5GroupDailyTotals &&
                      top5GroupDailyTotals.map((day) => (
                        <TableRow key={day.id}>
                          <TableCell>
                            {moment(day.id).format("MMMM Do, YYYY")}
                          </TableCell>
                          <TableCell>{day.steps}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </TableRow>
              </Paper>
            </div>
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
                    {selectedGroup.members &&
                      selectedGroup.members.map((member) => (
                        <TableRow key={member}>
                          <TableCell>Member name here</TableCell>
                          <TableCell>Member steps here</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </TableRow>
              </Paper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
