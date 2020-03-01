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
  ListItemText
} from "@material-ui/core";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EditIcon from "@material-ui/icons/Edit";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import UserList from "./components/UserList";
import firebase from "./firebase";
import "firebase/auth";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const useStyles = makeStyles({
  drawer: {
    flexShrink: 0
  },
  drawerPaper: {
    backgroundColor: "#1999"
  }
});

const DashboardPage = () => <Dashboard />;
const SteppersPage = () => (
  <div
    style={{
      display: "flex",
      flex: 1,

      backgroundColor: "#191919",
      color: "#efefef"
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
      backgroundColor: "#191919",
      color: "#efefef"
    }}
  >
    Edit Page
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
  const [error, setError] = useState("");

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
      <div style={{ backgroundColor: "#191919" }}>
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>
      </div>
    );
  }

  return (
    <UserProvider value={user}>
      <div style={{ backgroundColor: "#191919" }}>
        <BrowserRouter>
          <CssBaseline />
          <Drawer
            variant="permanent"
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <Divider />
            <List component="nav">
              <NavLink
                style={{ textDecoration: "none", color: "#EFEFEF" }}
                to="/dashboard"
              >
                <ListItem button>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </NavLink>
              <NavLink
                style={{ textDecoration: "none", color: "#EFEFEF" }}
                to="/steppers"
              >
                <ListItem button>
                  <ListItemIcon>
                    <DirectionsWalkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Steppers" />
                </ListItem>
              </NavLink>
            </List>
            <Divider />
            <List component="nav">
              <NavLink
                style={{ textDecoration: "none", color: "#EFEFEF" }}
                to="/edit"
              >
                <ListItem button>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary="Edit" />
                </ListItem>
              </NavLink>
              <ListItem button onClick={requestLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Drawer>
          <div
            style={{
              height: "100vh",
              display: "flex",
              marginLeft: 175,
              flex: 1,
              backgroundColor: "#191919"
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
