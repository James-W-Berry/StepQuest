import React, { useEffect, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import colors from "../../../assets/colors";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
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
import EditableTextField from "../../fields/EditableTextField";
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
  formControl: {
    margin: theme.spacing(1),
    width: "30%",
    minWidth: "300px",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
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

  const { isOpen, day, activities, setDialogVisible, setActivities } = props;
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [editedActivities, setEditedActivities] = useState([]);
  const [hasChange, setHasChange] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState();
  const [newActivityDuration, setNewActivityDuration] = useState();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    setEditedActivities(activities);
  }, [activities]);

  const removeActivity = (index) => {
    setHasChange(true);
    const temp = editedActivities;
    temp.splice(index, 1);
    setEditedActivities(temp);
  };

  const addActivity = () => {
    const activity = {
      date: day.toString(),
      activity: newActivity,
      duration: newActivityDuration,
    };
    setHasChange(true);
    const temp = editedActivities;
    temp.push(activity);
    setEditedActivities(temp);
    setNewActivity();
    setNewActivityDuration();
  };

  const saveActivities = () => {
    setActivities(editedActivities);
    setDialogVisible(false);
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
          {`Edit your activities for ${day.toDateString()}`}
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
          <Typography variant="h5">Logged Activities</Typography>
          {editedActivities.map((activity, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  padding: "10px",
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
          <Typography variant="h5">Log a new activity</Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl className={classes.formControl}>
              <InputLabel id="select-activity" className={classes.field}>
                What activity?
              </InputLabel>
              <Select
                label="Challenge activity"
                native
                className={classes.field}
                value={newActivity}
                onChange={(event) => {
                  setNewActivity(event.target.value);
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
            <FormControl>
              <InputLabel id="activity-duration" className={classes.field}>
                For how long?
              </InputLabel>
              <Input
                type="number"
                onChange={(event) => setNewActivityDuration(event.target.value)}
                labelId="activity-duration"
              />
            </FormControl>
            <Typography> minutes</Typography>

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
              disabled={!hasChange}
              style={{
                backgroundColor: colors.stepitup_blue,
                color: colors.white,
                margin: "20px",
              }}
              onClick={saveActivities}
            >
              Log
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
