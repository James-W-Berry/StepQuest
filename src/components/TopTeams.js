import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import firebase from "../firebase";
import colors from "../assets/colors";

const SORT_OPTIONS = {
  DURATION_ASC: { column: "totalDuration", direction: "asc" },
  DURATION_DESC: { column: "totalDuration", direction: "desc" },
};

function useGroups(sortBy = "DURATION_DESC") {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("groups")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .limit(5)
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

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  lightTextTitle: {
    color: colors.almostWhite,
    fontSize: "1.25rem",
    fontWeight: "500",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
  },
}));

function numberWithCommas(x) {
  if (x !== undefined) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}

export default function TopTeams() {
  const classes = useStyles();
  const sortBy = "DURATION_DESC";
  const groups = useGroups(sortBy);

  return (
    <React.Fragment>
      <Typography h1 className={classes.lightTextTitle}>
        Top Teams
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Total Duration (minutes)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{numberWithCommas(group.totalDuration)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className={classes.seeMore}>
        <NavLink to="/teams">
          <Link color="primary">See more teams</Link>
        </NavLink>
      </div>
    </React.Fragment>
  );
}
