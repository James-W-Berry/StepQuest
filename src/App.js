import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import {
  makeStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EditIcon from "@material-ui/icons/Edit";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import UserList from "./components/UserList";
import firebase from "./firebase";
import "firebase/auth";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import EditSteps from "./components/EditSteps";

const useStyles = makeStyles({
  drawer: {
    flexShrink: 0
  },
  drawerPaper: {
    backgroundColor: "#393E41",
    color: "#fdc029"
  },
  paperAnchorDockedLeft: {
    borderRight: "1px",
    borderLeft: "0px",
    borderTop: "0px",
    borderBottom: "0px",
    borderRightColor: "#fdc029",
    borderStyle: "solid"
  },
  divider: {
    backgroundColor: "#E7E5DF40",
    width: "90%",
    display: "flex",
    alignSelf: "center"
  }
});

const DashboardPage = () => <Dashboard />;
const SteppersPage = () => (
  <div
    style={{
      display: "flex",
      flex: 1,
      backgroundColor: "#393E41",
      color: "#E7E5DF"
    }}
  >
    <UserList />
  </div>
);
const EditPage = () => (
  <div
    style={{
      display: "flex",
      flex: 1,
      width: "50%",
      height: "50%",
      backgroundColor: "#393E41",
      color: "#E7E5DF"
    }}
  >
    <EditSteps />
  </div>
);

const UserContext = React.createContext({});
const UserProvider = UserContext.Provider;

function onAuthStateChange(callback) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      callback({ loggedIn: true, email: user.email, isLoading: false });
    } else {
      callback({ loggedIn: false, isLoading: false });
    }
  });
}

function logout() {
  firebase.auth().signOut();
}

function App() {
  const [user, setUser] = useState({ loggedIn: false, isLoading: true });

  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  const AuthRoutes = () => (
    <Route
      render={({ location }) => (
        <div key={location.pathname}>
          <Switch location={location}>
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Redirect to="/signin" />
          </Switch>
        </div>
      )}
    />
  );

  const FeatureRoutes = () => (
    <Route
      render={({ location }) => (
        <div key={location.pathname}>
          <Switch location={location}>
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/steppers" component={SteppersPage} />
            <Route path="/edit" component={EditPage} />
            <Redirect to="/dashboard" />
          </Switch>
        </div>
      )}
    />
  );

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  if (user.isLoading) {
    return <div>Loading</div>;
  }

  if (!user.loggedIn) {
    return (
      <div style={{ backgroundColor: "#393E41" }}>
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>
      </div>
    );
  }

  return (
    <UserProvider value={user}>
      <div
        style={{
          backgroundColor: "#393E41",
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100vh"
        }}
      >
        <BrowserRouter>
          <CssBaseline />
          <Drawer
            variant="permanent"
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
              paperAnchorDockedLeft: classes.paperAnchorDockedLeft
            }}
          >
            <Divider />
            <List component="nav">
              <NavLink
                style={{ textDecoration: "none", color: "#E7E5DF" }}
                to="/dashboard"
              >
                <ListItem button>
                  <ListItemIcon>
                    <DashboardIcon style={{ color: "#fdc029" }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </NavLink>
              <NavLink
                style={{ textDecoration: "none", color: "#E7E5DF" }}
                to="/steppers"
              >
                <ListItem button>
                  <ListItemIcon>
                    <DirectionsWalkIcon style={{ color: "#fdc029" }} />
                  </ListItemIcon>
                  <ListItemText primary="Steppers" />
                </ListItem>
              </NavLink>
            </List>
            <Divider
              classes={{
                root: classes.divider
              }}
            />
            <List component="nav">
              <NavLink
                style={{ textDecoration: "none", color: "#E7E5DF" }}
                to="/edit"
              >
                <ListItem button>
                  <ListItemIcon>
                    <EditIcon style={{ color: "#fdc029" }} />
                  </ListItemIcon>
                  <ListItemText primary="Edit your steps" />
                </ListItem>
              </NavLink>
            </List>
            <div
              onClick={requestLogout}
              style={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                bottom: "40px",
                cursor: "pointer",
                width: "100%"
              }}
            >
              <Typography style={{ marginRight: "10px", color: "#E7E5DF" }}>
                Logout{" "}
              </Typography>
              <LogoutIcon />
            </div>
          </Drawer>
          <div
            style={{
              height: "100vh",
              display: "flex",
              marginLeft: 200,
              flex: 1,
              backgroundColor: "#393E41"
            }}
          >
            {FeatureRoutes()}
          </div>
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
