import React, { useEffect, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import colors from "../../../assets/colors";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  Select,
  Typography,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import { Add, Delete } from "@material-ui/icons";
import activityList from "../../../assets/activityList.json";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.white,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    background: colors.stepitup_teal,
    border: 0,
    borderRadius: 3,
    color: colors.almostWhite,
    height: 48,
    padding: "0 30px",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
  },
  calendar: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    marginBottom: "20px",
    "& label.Mui-focused": {
      color: colors.almostBlack,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.stepitup_teal,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "max-content",
    justifyContent: "center",
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography {...other}>
      <Typography style={{ color: colors.white }} variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: colors.white,
  },
}))(MuiDialogContent);

export default function DayActivitiesDialog(props) {
  const theme = useTheme();
  const classes = useStyles();

  const { isOpen, day, activities, setDialogVisible, updateActivities } = props;
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [editedActivities, setEditedActivities] = useState([]);
  const [hasChange, setHasChange] = useState(false);
  const [newActivity, setNewActivity] = useState();
  const [newActivityDuration, setNewActivityDuration] = useState();

  useEffect(() => {
    setEditedActivities(activities);
  }, [activities]);

  const removeActivity = (index) => {
    const updated = [...editedActivities];
    updated.splice(index, 1);
    setEditedActivities(updated);
    setHasChange(true);
  };

  const addActivity = () => {
    const activity = {
      date: day.toString(),
      activity: newActivity,
      duration: newActivityDuration,
    };
    const updated = [...editedActivities];
    updated.push(activity);
    setEditedActivities(updated);
    setNewActivity();
    setNewActivityDuration();
    setHasChange(true);
  };

  const saveActivities = () => {
    updateActivities(day.toString(), editedActivities);
    setDialogVisible(false);
    setHasChange(false);
  };

  function createActivityOption(activityOption) {
    if (activityOption !== undefined) {
      return (
        <option key={activityOption[0]} value={activityOption[0]}>
          {activityOption[0]}
        </option>
      );
    }
  }

  return (
    <Dialog
      open={isOpen}
      fullScreen={fullScreen}
      disableBackdropClick={false}
      fullWidth={true}
      onClose={() => setDialogVisible(false)}
      aria-labelledby="customized-dialog-title"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.stepitup_blue,
        }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => setDialogVisible(false)}
        >
          {`Logged Activities for ${day.toDateString()}`}
        </DialogTitle>
      </div>

      <DialogContent className="dialog" style={{ padding: "0px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            background: "#ffffffcc",
            width: "100%",
            height: "100%",
          }}
        >
          {editedActivities &&
            editedActivities.map((activity, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    {activity.activity} - {activity.duration}min
                  </Typography>
                  <IconButton onClick={() => removeActivity(index)}>
                    <Delete />
                  </IconButton>
                </div>
              );
            })}
          <Divider variant="fullWidth" />
          <Typography variant="h5">Log a new activity</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <FormControl className={classes.formControl}>
              <InputLabel id="select-activity">What activity?</InputLabel>
              <Select
                label="Challenge activity"
                native
                value={newActivity}
                onChange={(event) => {
                  setNewActivity(event.target.value);
                }}
                labelid="select-activity"
                id="activity-select-required"
              >
                <option aria-label="None" value="" />
                {Object.entries(activityList).map((activityOption) =>
                  createActivityOption(activityOption)
                )}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="activity-duration">
                For how many minutes?
              </InputLabel>
              <Input
                type="number"
                onChange={(event) => setNewActivityDuration(event.target.value)}
                labelid="activity-duration"
              />
            </FormControl>
            <Button
              style={{
                backgroundColor: colors.stepitup_blue,
                color: colors.white,
                margin: "20px",
              }}
              onClick={addActivity}
              startIcon={<Add />}
            >
              Add
            </Button>
          </div>
          {hasChange && (
            <Button
              style={{
                backgroundColor: colors.stepitup_blue,
                color: colors.white,
                margin: "20px",
                alignSelf: "flex-end",
              }}
              onClick={saveActivities}
            >
              All done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
