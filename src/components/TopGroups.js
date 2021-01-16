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

export default function TopGroups() {
  const classes = useStyles();
  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const groups = useGroups(sortBy);

  return (
    <React.Fragment>
      <Typography h1 className={classes.lightTextTitle}>
        Top Groups
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Total Steps</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.totalSteps}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className={classes.seeMore}>
        <NavLink to="/groups">
          <Link color="primary">See more Groups</Link>
        </NavLink>
      </div>
    </React.Fragment>
  );
}
