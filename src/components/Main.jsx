import { useState, useCallback, useEffect } from "react";
import { useAuthenticatedUserContext } from "../auth/AuthenticatedUserContext";
import "../App.scss";
import {
  Route,
  Switch,
  Redirect,
  useHistory,
  withRouter,
  NavLink,
} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import {
  AppBar,
  ListItem,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Popover from "material-ui-popup-state/HoverPopover";
import {
  usePopupState,
  bindHover,
  bindPopover,
} from "material-ui-popup-state/hooks";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import firebase from "../firebase";
import "firebase/auth";
import EditActivities from "./EditActivities";
import Landing from "./pages/Landing/Landing";
import UserProfile from "./pages/User/UserProfile";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import colors from "../assets/colors";
import NewChallenge from "./pages/NewChallenge/NewChallenge";
import About from "./pages/About/AboutPage";
import ChallengeDetails from "./pages/Challenge/ChallengeDetails";
import { getUser } from "../api/userApi";
import { useUserContext } from "./pages/User/UserContext";
import ScrollToTop from "./ScrollToTop";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import { ExpandMoreOutlined } from "@material-ui/icons";
import FAQ from "./pages/FAQ/FAQ";
import Resources from "./pages/Resources/Resources";
import JoinChallenge from "./pages/JoinChallenge/JoinChallenge";
import ChallengeInvite from "./pages/ChallengeInvite/ChallengeInvite";
import FitnessTips from "./pages/FitnessTips/FitnessTips";
import Inspiration from "./pages/Inspiration/Inspiration";
import ChallengeTips from "./pages/ChallengeTips/ChallengeTips";
const drawerWidth = "100%";

const useStyles = makeStyles((theme) => ({
  logoHeading: {
    position: "absolute",
    padding: "12px",
    margin: "12px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      textDecoration: "none",
    },
  },
  menuButton: {
    position: "absolute",
    margin: "12px",
    zIndex: 2000,
    right: "0px",
  },
  list: {
    marginTop: "20%",
  },
  navLink: {
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
    padding: "10px",
  },
  navLinkButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
    padding: "10px",
  },
  drawerPaper: {
    background: colors.almostBlack,
    width: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  signInButton: {
    padding: "0px",
    "&:hover": {
      backgroundColor: colors.almostBlack,
    },
  },
  signInLink: {
    fontSize: ".8125rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      color: colors.white,
      backgroundColor: colors.almostBlack,
    },
    margin: "0px",
  },
}));

function Main() {
  const theme = useTheme();
  const history = useHistory();
  const [email, setEmail] = useState();
  const [displayName, setDisplayName] = useState();
  const shouldCollapseIntoDrawer = useMediaQuery(theme.breakpoints.up("md"));
  const {
    authenticatedUser: { isLoading, loggedIn, userId },
    setAuthenticatedUser,
  } = useAuthenticatedUserContext();
  const { setUser } = useUserContext();
  const [open, setOpen] = useState(false);
  const resourcesPopUpState = usePopupState({
    variant: "popover",
    popupId: "resources",
  });
  const userPopUpState = usePopupState({
    variant: "popover",
    popupId: "resources",
  });

  function onAuthStateChange(callback) {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
        callback({
          loggedIn: true,
          email: user.email,
          isLoading: false,
          userId: user.uid,
        });
      } else {
        callback({ loggedIn: false, isLoading: false });
        history.push("/");
      }
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setAuthenticatedUser);
    return () => {
      unsubscribe();
    };
  }, [setAuthenticatedUser]);

  useEffect(() => {
    if (userId) {
      getUser(userId).then((response) => {
        if (response.success) {
          setUser(response.data);
          response.data.displayName !== "Anonymous" &&
            setDisplayName(response.data.displayName);
        }
      });
    }
  }, [userId, setUser]);

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(!open);
  };

  function logout() {
    firebase.auth().signOut();
  }

  const requestLogout = useCallback(() => {
    logout();
  }, []);

  const classes = useStyles();

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: theme.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      />
    );
  }

  return (
    <div style={{ height: "100%", backgroundColor: theme.background }}>
      <ScrollToTop />
      <AppBar
        position="fixed"
        style={{
          backgroundColor: theme.palette.background.main,
          minHeight: "64px",
        }}
      >
        <Toolbar>
          <NavLink to={`/`} className={classes.navLink}>
            <Typography className="header-title">STEPQUEST</Typography>
          </NavLink>

          {shouldCollapseIntoDrawer ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <div className={classes.navLink}>
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  {...bindHover(resourcesPopUpState)}
                >
                  <Typography className={classes.navLink}>RESOURCES</Typography>
                  <ExpandMoreOutlined style={{ width: "0.8em" }} />
                </div>
                <Popover
                  id="resources"
                  {...bindPopover(resourcesPopUpState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  disableRestoreFocus
                >
                  <Paper className="menu">
                    <NavLink
                      to={`/fitness-tips`}
                      className={classes.navLink}
                      style={{ padding: "0px" }}
                    >
                      <Typography>WORKOUT TIPS</Typography>
                    </NavLink>
                    <NavLink
                      to={`/inspiration`}
                      className={classes.navLink}
                      style={{ padding: "0px" }}
                    >
                      <Typography>INSPIRATION</Typography>
                    </NavLink>
                    <NavLink
                      to={`/challenge-tips`}
                      className={classes.navLink}
                      style={{ padding: "0px" }}
                    >
                      <Typography>CHALLENGE TIPS</Typography>
                    </NavLink>
                  </Paper>
                </Popover>
              </div>
              <NavLink to={`/join-a-challenge`} className={classes.navLink}>
                <Typography className={classes.navLink}>
                  JOIN A CHALLENGE
                </Typography>
              </NavLink>
              <NavLink to={`/about`} className={classes.navLink}>
                <Typography className={classes.navLink}>ABOUT</Typography>
              </NavLink>
              <NavLink to={`/faq`} className={classes.navLink}>
                <Typography className={classes.navLink}>FAQ</Typography>
              </NavLink>
              {loggedIn ? (
                <div className={classes.navLink}>
                  <NavLink
                    to={`/profile`}
                    className={classes.navLink}
                    style={{ padding: "0px" }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      {...bindHover(userPopUpState)}
                    >
                      <Typography className={classes.navLink}>
                        {displayName?.toUpperCase() || email?.toUpperCase()}
                      </Typography>
                      <ExpandMoreOutlined style={{ width: "0.8em" }} />
                    </div>
                  </NavLink>
                  <Popover
                    id="user"
                    {...bindPopover(userPopUpState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    disableRestoreFocus
                  >
                    <Paper className="menu">
                      <NavLink
                        to={`/profile`}
                        className={classes.navLink}
                        style={{ padding: "0px" }}
                      >
                        <Typography>PROFILE</Typography>
                      </NavLink>
                      <NavLink
                        to={`/profile/challenges`}
                        className={classes.navLink}
                        style={{ padding: "0px" }}
                      >
                        <Typography>MY CHALLENGES</Typography>
                      </NavLink>
                      <NavLink
                        to={`/profile/settings`}
                        className={classes.navLink}
                        style={{ padding: "0px" }}
                      >
                        {" "}
                        <Typography>SETTINGS</Typography>
                      </NavLink>
                      <Typography onClick={requestLogout}>LOG OUT</Typography>
                    </Paper>
                  </Popover>
                </div>
              ) : (
                <NavLink to={`/signin`} className={classes.navLinkButton}>
                  <button className="header-menu-button">
                    <p className={classes.signInLink}>SIGN IN</p>
                  </button>
                </NavLink>
              )}
            </div>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
              className={classes.menuButton}
            >
              {open ? (
                <CancelIcon
                  style={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                  }}
                />
              ) : (
                <MenuIcon
                  style={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                  }}
                />
              )}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <div className="content">
        <Switch>
          <Route
            path="/signin"
            render={() => (
              <div key="signin" style={{ height: "100%", width: "100%" }}>
                <SignIn />
              </div>
            )}
          />
          <Route
            path="/signup"
            render={() => (
              <div key="signup" style={{ height: "100%", width: "100%" }}>
                <SignUp />
              </div>
            )}
          />
          <Route
            path="/password-reset"
            render={() => (
              <div
                key="password-reset"
                style={{ height: "100%", width: "100%" }}
              >
                <PasswordReset />
              </div>
            )}
          />
          <Route
            path="/profile"
            render={(props) => (
              <div key="profile" style={{ height: "100%", width: "100%" }}>
                <UserProfile {...props} />
              </div>
            )}
          />
          <Route
            path="/profile/challenges"
            render={(props) => (
              <div key="my-challenge" style={{ height: "100%", width: "100%" }}>
                <UserProfile {...props} />
              </div>
            )}
          />
          <Route
            path="/profile/settings"
            render={(props) => (
              <div key="settings" style={{ height: "100%", width: "100%" }}>
                <UserProfile {...props} />
              </div>
            )}
          />
          <Route
            path="/join-a-challenge"
            render={(props) => (
              <div
                key="join-challenge"
                style={{ height: "100%", width: "100%" }}
              >
                <JoinChallenge {...props} />
              </div>
            )}
          />
          <Route
            path="/join/:id"
            render={(props) => (
              <div
                key="invite-to-join"
                style={{ height: "100%", width: "100%" }}
              >
                <ChallengeInvite {...props} />
              </div>
            )}
          />
          <Route
            path="/challenge/:id"
            render={(props) => (
              <div key="challenge" style={{ height: "100%", width: "100%" }}>
                <ChallengeDetails {...props} />
              </div>
            )}
          />
          <Route
            path="/about"
            render={() => (
              <div key="about" style={{ height: "100%", width: "100%" }}>
                <About />
              </div>
            )}
          />
          <Route
            path="/faq"
            render={() => (
              <div key="faq" style={{ height: "100%", width: "100%" }}>
                <FAQ />
              </div>
            )}
          />
          <Route
            path="/resources"
            render={() => (
              <div key="about" style={{ height: "100%", width: "100%" }}>
                <Resources />
              </div>
            )}
          />
          <Route
            path="/edit"
            render={() => (
              <div key="edit" style={{ height: "100%", width: "100%" }}>
                <EditActivities userId={userId} />
              </div>
            )}
          />
          <Route
            path="/create-challenge"
            render={() => (
              <div key="create" style={{ height: "100%", width: "100%" }}>
                <NewChallenge />
              </div>
            )}
          />
          <Route
            path="/join-a-challenge"
            render={() => (
              <div key="join" style={{ height: "100%", width: "100%" }}>
                <NewChallenge />
              </div>
            )}
          />
          <Route
            path="/fitness-tips"
            render={() => (
              <div key="fitnessTips" style={{ height: "100%", width: "100%" }}>
                <FitnessTips />
              </div>
            )}
          />
          <Route
            path="/inspiration"
            render={() => (
              <div key="inspiration" style={{ height: "100%", width: "100%" }}>
                <Inspiration />
              </div>
            )}
          />
          <Route
            path="/challenge-tips"
            render={() => (
              <div
                key="challengeTips"
                style={{ height: "100%", width: "100%" }}
              >
                <ChallengeTips />
              </div>
            )}
          />
          <Route
            path="/"
            exact
            render={() => (
              <div key="home" style={{ height: "100%", width: "100%" }}>
                <Landing />
              </div>
            )}
          />

          <Redirect to="/" />
        </Switch>
      </div>

      <Drawer
        className={classes.drawer}
        anchor="right"
        classes={{
          paper: theme.palette.background.default,
        }}
        open={open}
        onClose={toggleDrawer()}
      >
        <div
          className={clsx(classes.list)}
          role="presentation"
          onClick={toggleDrawer()}
          onKeyDown={toggleDrawer()}
        >
          <List component="nav">
            <NavLink className={classes.navLink} to={`/user/${userId}`}>
              <ListItem button>
                <Typography style={{ fontSize: "2rem" }}>Profile</Typography>
              </ListItem>
            </NavLink>
            <NavLink className={classes.navLink} to="/create-challenge">
              <ListItem button>
                <Typography style={{ fontSize: "2rem" }}>
                  Create a new challenge
                </Typography>
              </ListItem>
            </NavLink>
            <NavLink className={classes.navLink} to="/about">
              <ListItem button>
                <Typography style={{ fontSize: "2rem" }}>About</Typography>
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
            <Typography
              style={{ marginRight: "10px", color: colors.stepQuestGray }}
            >
              Logout
            </Typography>
            <LogoutIcon style={{ color: colors.stepQuestGray }} />
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default withRouter(Main);
