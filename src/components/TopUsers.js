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

function useUsers(sortBy = "DURATION_DESC") {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .limit(5)
      .get()
      .then((users) => {
        const newUsers = users.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(newUsers);
      });
  }, [sortBy]);

  return users;
}

function numberWithCommas(x) {
  if (x !== undefined) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
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

export default function TopUsers() {
  const classes = useStyles();
  const sortBy = "DURATION_DESC";
  const users = useUsers(sortBy);

  return (
    <React.Fragment>
      <Typography h1 className={classes.lightTextTitle}>
        Top Users
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Total Duration (minutes)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.displayName}</TableCell>
              <TableCell>{numberWithCommas(user.totalDuration)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className={classes.seeMore}>
        <NavLink to="/members">
          <Link color="primary">See more users</Link>
        </NavLink>
      </div>
    </React.Fragment>
  );
}
