import React, { useState } from "react";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import colors from "../assets/colors";
import activityList from "../assets/activityList.json";
import { validate, validateEmail } from "./validation/validate";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import add from "date-fns/add";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import AddCircle from "@material-ui/icons/AddCircle";

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
    width: "50%",
    minWidth: 120,
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
  const classes = useStyles();
  const [form, setForm] = useState({});
  const [title, setTitle] = useState();
  const [activity, setActivity] = useState(0); // All Activities (General)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(add(new Date(), { months: 1 }));
  const [description, setDescription] = useState();
  const [participantEmail, setParticipantEmail] = useState();
  const [isParticipantEmailValid, setIsParticipantEmailValid] = useState(false);
  const [participantEmails, setParticipantEmails] = useState([]);
  const challengeLink = "https://google.com";
  const [isFormValid, setIsFormValid] = useState();
  const [isToastVisible, setIsToastVisible] = useState(false);

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

  return (
    <div className={classes.root}>
      <Typography variant="h4">New Challenge</Typography>
      <Typography variant="h5">Challenge Details</Typography>
      <FormControl className={classes.formControl}>
        <TextField
          className={classes.field}
          label={"What do you want to call this challenge?"}
          placeholder={
            "Example: Work Team Activity Challenge, Roommates Lifting Competition"
          }
          onChange={(input) => setTitle(input)}
        />
      </FormControl>

      <FormControl className={classes.formControl}>
        <TextareaAutosize
          onChange={(input) => setDescription(input)}
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

      <Typography variant="h5">
        Invite participants (via link or email)
      </Typography>

      <FormControl className={classes.formControl}>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Typography>
            Anyone with this link will be able to join your challenge:
          </Typography>
          <Typography>
            <a href={challengeLink}>{challengeLink}</a>
          </Typography>
        </div>

        <Typography>Enter participant emails</Typography>
        <Input
          type={"email"}
          value={participantEmail}
          onChange={(event) => handleParticipantEmailChange(event.target.value)}
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
      </FormControl>

      {participantEmails.map((email) => {
        return <div key={email}>{email}</div>;
      })}

      <Button
        style={{
          backgroundColor: colors.stepitup_blue,
          color: colors.white,
        }}
        onClick={() => {
          setForm({
            title: title,
            description: description,
            activity: activity,
          });
          const isValid = validate(form);
          setIsToastVisible(!isValid);
          setIsFormValid(isValid);
        }}
      >
        Create
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={isToastVisible}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Please resolve invalid form fields"
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
    </div>
  );
}
