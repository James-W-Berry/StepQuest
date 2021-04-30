import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
  Button,
  Grid,
  Snackbar,
  IconButton,
  Input,
  InputAdornment,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import colors from "../../../assets/colors";
import activityList from "../../../assets/activityList.json";
import { validate, validateEmail } from "../../validation/validate";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import add from "date-fns/add";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import AddCircle from "@material-ui/icons/AddCircle";
import { v4 as uuidv4 } from "uuid";
import { createNewChallenge } from "../../../api/challengeApi";
import { useHistory } from "react-router-dom";
import { useUserContext } from "../../../auth/UserContext";
import { addBadge, joinChallenge } from "../../../api/userApi";

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

export default function NewChallenge() {
  const {
    user: { userId },
  } = useUserContext();
  const classes = useStyles();
  const [id, setId] = useState();
  const [title, setTitle] = useState();
  const [activity, setActivity] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(add(new Date(), { months: 1 }));
  const [description, setDescription] = useState();
  const [participantEmail, setParticipantEmail] = useState();
  const [isParticipantEmailValid, setIsParticipantEmailValid] = useState(false);
  const [participantEmails, setParticipantEmails] = useState([]);
  const challengeLink = `https://stepitup.web.app/challenge/${id}`;
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

  useEffect(() => {
    setId(uuidv4());
  }, []);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleParticipantEmailChange = (email) => {
    setParticipantEmail(email);

    if (validateEmail(email)) {
      setIsParticipantEmailValid(true);
    } else {
      setIsParticipantEmailValid(false);
    }
  };

  const handleAddParticipantEmail = (email) => {
    setParticipantEmails((participantEmails) => [...participantEmails, email]);
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
      id,
      title,
      description,
      activity,
      startDate,
      endDate,
    };

    const isValid = validate(form);
    !isValid && setToastMessage("Please fix all invalid fields");
    setIsToastVisible(!isValid);

    isValid &&
      createNewChallenge(form).then((response) => {
        console.log(response);
        setToastMessage(response.message);
        setIsToastVisible(true);
        response.success &&
          joinChallenge(userId, id).then((response) => {
            console.log(response);
            if (response.success) {
              addBadge(userId, {
                type: "createChallenge",
                title: "Challenge Creator",
              }).then((response) => {
                console.log(response);
                setTimeout(() => history.push(`/challenge/${form.id}`), 3000);
              });
            }
          });
      });
  };

  return (
    <Grid container className={classes.root}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">New Challenge</Typography>
        <Divider />
        <Typography variant="h5" style={{ marginTop: "40px" }}>
          Challenge Details
        </Typography>
        <FormControl className={classes.formControl}>
          <TextField
            className={classes.field}
            label={"What do you want to call this challenge?"}
            placeholder={
              "Example: Work Team Activity Challenge, Roommates Lifting Competition"
            }
            onChange={(event) => setTitle(event.target.value)}
          />
        </FormControl>

        <FormControl className={classes.formControl}>
          <TextareaAutosize
            onChange={(event) => setDescription(event.target.value)}
            label="Description (optional)"
            placeholder="Provide any additional information to the challenge participants (goals, prizes, inspiration, etc)"
            rowsMin={3}
          >
            {description}
          </TextareaAutosize>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel id="select-activity" className={classes.field}>
            What kind of activity challenge do you want?
          </InputLabel>
          <Select
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
        </FormControl>

        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
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
              <KeyboardDatePicker
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
          </MuiPickersUtilsProvider>
        </FormControl>

        <Typography variant="h5" style={{ marginTop: "40px" }}>
          Invite participants
        </Typography>

        <FormControl className={classes.formControl}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              flexDirection: "column",
            }}
          >
            <Typography>
              Share a link (anyone with this link will be able to join your
              challenge):
            </Typography>
            <Typography>
              <a href={challengeLink}>{challengeLink}</a>
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "10px",
              flexDirection: "column",
            }}
          >
            <Typography>Or invite via email</Typography>
            <Input
              type={"email"}
              value={participantEmail}
              placeholder="Enter participant emails"
              onChange={(event) =>
                handleParticipantEmailChange(event.target.value)
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disabled={!isParticipantEmailValid}
                    onClick={() => handleAddParticipantEmail(participantEmail)}
                  >
                    <AddCircle />
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>
        </FormControl>

        {participantEmails.map((email) => {
          return <div key={email}>{email}</div>;
        })}

        <Button
          style={{
            backgroundColor: colors.stepitup_blue,
            color: colors.white,
            marginTop: "20px",
          }}
          onClick={onSubmit}
        >
          Create Challenge
        </Button>

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={isToastVisible}
          autoHideDuration={5000}
          onClose={handleClose}
          message={toastMessage}
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
        />
      </Grid>
    </Grid>
  );
}
