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
import colors from "../assets/colors";

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

export default function TopTeams(props) {
  const classes = useStyles();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    setTeams(props.teams.slice(0, 5));
  }, [props.teams]);

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
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.name}</TableCell>
              <TableCell>{numberWithCommas(team.totalDuration)}</TableCell>
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
