import React, { useEffect, useState } from "react";
import {
  InputLabel,
  Select,
  TextareaAutosize,
  Typography,
  Grid,
  Snackbar,
  IconButton,
  Popover,
  Checkbox,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import colors from "../../../assets/colors";
import activityList from "../../../assets/activityList.json";
import { validate } from "../../validation/validate";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import add from "date-fns/add";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { v4 as uuidv4 } from "uuid";
import { createNewChallengeBatch } from "../../../api/challengeApi";
import { useHistory, Redirect } from "react-router-dom";
import { useAuthenticatedUserContext } from "../../../auth/AuthenticatedUserContext";
import { Help, Lock, VisibilityOff } from "@material-ui/icons";
import { BeatLoader } from "react-spinners";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  field: {
    width: "100%",
    "& label ": {
      color: "#19191980",
    },
    "& label.Mui-focused": {
      color: "#19191980",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.almostBlack,
    },
  },
}));

function createActivityOption(activityOption) {
  if (activityOption !== undefined) {
    return (
      <option key={activityOption[0]} value={activityOption[0]}>
        {activityOption[0]}
      </option>
    );
  }
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function NewChallenge() {
  const {
    authenticatedUser: { userId },
  } = useAuthenticatedUserContext();
  const classes = useStyles();
  const [id, setId] = useState();
  const [title, setTitle] = useState();
  const [activity, setActivity] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(add(new Date(), { months: 1 }));
  const [description, setDescription] = useState("");
  const [privateChallenge, setPrivateChallenge] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = Boolean(anchorEl);
  const helpId = open ? "simple-popover" : undefined;

  useEffect(() => {
    setId(uuidv4());
  }, []);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastVisible(false);
  };

  const onSubmit = () => {
    const form = {
      creator: userId,
      admin: [userId],
      participants: [userId],
      id,
      title,
      description,
      activity,
      startDate,
      endDate,
      privateChallenge,
    };

    setIsLoading(true);
    const validation = validate(form);

    if (!validation.status) {
      setToastType("error");
      setToastMessage(validation.message);
      setIsToastVisible(true);
      setIsLoading(false);
    } else {
      createNewChallengeBatch(form, userId, id).then((response) => {
        if (response.success) {
          setToastType("success");
          setToastMessage(response.message);
          setIsToastVisible(true);
          setTimeout(() => {
            history.push(`/challenge/${id}`);
          }, 3000);
        } else {
          setToastType("error");
          setToastMessage(response.message);
          setIsToastVisible(true);
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <Grid container className={classes.root}>
      <Grid
        item
        xs={11}
        sm={11}
        md={11}
        lg={11}
        xl={11}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography className="form-title">Success!</Typography>
            <Typography className="form-title">
              Heading over to your challenge now...
            </Typography>
          </div>
        )}
        {userId ? (
          <div>
            <Typography className="form-title">Create New Challenge</Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                width: "100%",
              }}
            >
              <input
                disabled={isLoading}
                autoComplete="off"
                className="form-text-input"
                style={{ fontSize: "14px" }}
                type="text"
                id="name"
                placeholder="Challenge name"
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
              <TextareaAutosize
                disabled={isLoading}
                style={{ fontSize: "14px" }}
                className="form-text-area-input"
                onChange={(event) => setDescription(event.target.value)}
                label="Description (optional)"
                placeholder="Provide any additional information to the challenge participants (goals, prizes, inspiration, etc)"
                rowsMin={3}
                value={description}
              />
              <InputLabel id="select-activity" className={classes.field}>
                What kind of activity challenge do you want?
              </InputLabel>
              <Select
                disabled={isLoading}
                label="Challenge activity"
                native
                className={classes.field}
                value={activity}
                onChange={(event) => {
                  setActivity(event.target.value);
                }}
                labelId="select-activity"
                id="activity-select-required"
              >
                <option aria-label="None" value="" />
                {Object.entries(activityList).map((activityOption) =>
                  createActivityOption(activityOption)
                )}
              </Select>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <KeyboardDatePicker
                      disabled={isLoading}
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="start-date-picker"
                      label="Start date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <KeyboardDatePicker
                      disabled={isLoading}
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="end-date-picker"
                      label="End date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography style={{ marginTop: "20px" }}>
                Make challenge private
              </Typography>
              <IconButton
                aria-describedby={helpId}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <Help />
              </IconButton>
              <Checkbox
                disabled={isLoading}
                style={{ padding: "15px", color: colors.stepitup_blue }}
                checked={privateChallenge}
                onChange={() => setPrivateChallenge(!privateChallenge)}
                inputProps={{ "aria-label": "private challenge" }}
              />

              <Popover
                id={helpId}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <Lock />
                  <Typography style={{ paddingLeft: "5px" }}>
                    Private groups can only be joined via direct invite from the
                    challenge creator or admin.
                  </Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <VisibilityOff />
                  <Typography style={{ paddingLeft: "5px" }}>
                    Only people in your challenge can view your challenge
                    information.
                  </Typography>
                </div>
              </Popover>
            </div>

            <button
              style={{ marginTop: "40px" }}
              className="form-button-submit"
              onClick={onSubmit}
            >
              {isLoading ? (
                <BeatLoader color={"#fff"} />
              ) : (
                <Typography>CREATE CHALLENGE</Typography>
              )}
            </button>
          </div>
        ) : (
          <Redirect to="/signin" />
        )}

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={isToastVisible}
          autoHideDuration={5000}
          onClose={handleClose}
          message={toastMessage}
        >
          <Alert
            severity={toastType}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
}
