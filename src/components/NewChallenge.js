import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
  Button,
  PopOver,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import colors from "../assets/colors";
import activityList from "../assets/activityList.json";
import { validate } from "./validation/validate";
import CloseIcon from "@material-ui/icons/Close";

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
  const [activity, setActivity] = useState();
  const [description, setDescription] = useState();
  const [isFormValid, setIsFormValid] = useState();
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastVisible(false);
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <TextField
          className={classes.field}
          label={"Challenge title"}
          placeholder={
            "Jones Family Bike Challenge, Software Team Activity Challenge, Roommates Lift Competition, ..."
          }
          onChange={(input) => setTitle(input)}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextareaAutosize
          onChange={(input) => setDescription(input)}
          label="Challenge description"
          placeholder="Provide any additional information to the challenge participants"
          rowsMin={3}
        >
          {description}
        </TextareaAutosize>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-activity" className={classes.field}>
          Challenge activity
        </InputLabel>
        <Select
          label="Challenge activity"
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
        <Typography>Set challenge start and end date</Typography>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Typography>Invite participants (via link or email)</Typography>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Typography>Invite People</Typography>
      </FormControl>
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
