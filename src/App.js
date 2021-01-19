import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EditIcon from "@material-ui/icons/Edit";
import ProfileIcon from "@material-ui/icons/AccountCircle";
import TeamIcon from "@material-ui/icons/Group";
import MemberIcon from "@material-ui/icons/DirectionsWalk";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import UserList from "./components/UserList";
import firebase from "./firebase";
import "firebase/auth";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import EditActivities from "./components/EditActivities";
import SyncLoader from "react-spinners/SyncLoader";
import ForgottenPassword from "./components/ForgottenPassword";
import Landing from "./components/Landing";
import Profile from "./components/Profile";
import TeamsList from "./components/TeamsList";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Img from "react-image";
import colors from "./assets/colors";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  drawerPaper: {
    background: `#50c9c3`,
    width: drawerWidth,
  },
  paperAnchorDockedLeft: {
    borderRight: "1px",
    borderLeft: "0px",
    borderTop: "0px",
    borderBottom: "0px",
    borderRightColor: "#ffffff",
    borderStyle: "solid",
  },
  divider: {
    backgroundColor: "#ffffff",
    width: "90%",
    display: "flex",
    alignSelf: "center",
  },
  root: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    width: "100%",
    height: "100%",
    padding: theme.spacing(3),
    marginTop: theme.spacing(8),
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const UserContext = React.createContext({});
const UserProvider = UserContext.Provider;

function onAuthStateChange(callback) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      callback({
        loggedIn: true,
        email: user.email,
        isLoading: false,
        userId: user.uid,
      });
    } else {
      callback({ loggedIn: false, isLoading: false });
    }
  });
}

function logout() {
  firebase.auth().signOut();
}

function App() {
  const [user, setUser] = useState({
    loggedIn: false,
    isLoading: true,
    userId: "",
  });
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const classes = useStyles();

  const DashboardPage = () => <Dashboard />;
  const MembersPage = () => (
    <div
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <UserList />
    </div>
  );
  const TeamsPage = () => (
    <div
      style={{
        display: "flex",
        flex: 1,
      }}
    >
      <TeamsList />
    </div>
  );
  const EditPage = () => <EditActivities userId={user.userId} />;
  const ProfilePage = () => <Profile userId={user.userId} />;

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
            <Route path="/home" exact component={Landing} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/forgotpassword" component={ForgottenPassword} />
            <Redirect to="/home" />
          </Switch>
        </div>
      )}
    />
  );

  const FeatureRoutes = () => (
    <Route
      render={({ location }) => (
        <div
          id="content"
          key={location.pathname}
          style={{ height: "100%", width: "100%" }}
        >
          <Switch location={location}>
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/members" component={MembersPage} />
            <Route path="/teams" component={TeamsPage} />
            <Route path="/edit" component={EditPage} />
            <Route path="/profile" component={ProfilePage} />
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
    return (
      <div
        style={{
          backgroundColor: colors.almostBlack,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <SyncLoader color={colors.stepitup_teal} />
      </div>
    );
  }

  if (!user.loggedIn) {
    return (
      <div style={{ backgroundColor: colors.almostWhite }}>
        <BrowserRouter>{AuthRoutes()}</BrowserRouter>
      </div>
    );
  }

  return (
    <UserProvider value={user}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BrowserRouter>
          <CssBaseline />
          <AppBar style={{ backgroundColor: colors.stepitup_teal }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon style={{ fontSize: 40 }} color="#ffffff" />
              </IconButton>
              <Typography variant="h6">Step It Up</Typography>
            </Toolbar>
          </AppBar>

          <Drawer
            className={classes.drawer}
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}
            open={open}
            onClose={toggleDrawer(false)}
          >
            <div
              className={clsx(classes.list)}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List component="nav">
                <NavLink
                  style={{ textDecoration: "none", color: "#ffffff" }}
                  to="/dashboard"
                >
                  <ListItem button>
                    <ListItemIcon>
                      <DashboardIcon style={{ color: "#ffffff" }} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                </NavLink>
                <NavLink
                  style={{ textDecoration: "none", color: "#ffffff" }}
                  to="/members"
                >
                  <ListItem button>
                    <ListItemIcon>
                      <MemberIcon style={{ color: "#ffffff" }} />
                    </ListItemIcon>
                    <ListItemText primary="Members" />
                  </ListItem>
                </NavLink>
                <NavLink
                  style={{ textDecoration: "none", color: "#ffffff" }}
                  to="/teams"
                >
                  <ListItem button>
                    <ListItemIcon>
                      <TeamIcon style={{ color: "#ffffff" }} />
                    </ListItemIcon>
                    <ListItemText primary="Teams" />
                  </ListItem>
                </NavLink>
              </List>
              <Divider
                classes={{
                  root: classes.divider,
                }}
              />
              <List component="nav">
                <NavLink
                  style={{ textDecoration: "none", color: "#ffffff" }}
                  to="/edit"
                >
                  <ListItem button>
                    <ListItemIcon>
                      <EditIcon style={{ color: "#ffffff" }} />
                    </ListItemIcon>
                    <ListItemText primary="Enter Activities" />
                  </ListItem>
                </NavLink>
                <NavLink
                  style={{ textDecoration: "none", color: "#ffffff" }}
                  to="/profile"
                >
                  <ListItem button>
                    <ListItemIcon>
                      <ProfileIcon style={{ color: "#ffffff" }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
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
                  width: "100%",
                }}
              >
                <Typography style={{ marginRight: "10px", color: "#ffffff" }}>
                  Logout
                </Typography>
                <LogoutIcon style={{ color: "#ffffff" }} />
              </div>
            </div>
          </Drawer>
          <div className={classes.content}>{FeatureRoutes()}</div>
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
