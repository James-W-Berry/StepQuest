import React, { useEffect, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import colors from "../../../assets/colors";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Button,
  Chip,
  Dialog,
  IconButton,
  Input,
  Select,
  Typography,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { Cancel, Close, Save } from "@material-ui/icons";
import { Add, Delete } from "@material-ui/icons";
import activityList from "../../../assets/activityList.json";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.almostWhite,
  },
  saveButton: {
    color: colors.black,
    backgroundColor: colors.stepQuestLightGray,
    margin: "10px",
    border: "1px solid #191919",
    "&:hover": {
      backgroundColor: colors.almostBlack,
      color: colors.almostWhite,
    },
  },
}));

export default function DayActivitiesDialog(props) {
  const theme = useTheme();
  const classes = useStyles();
  const {
    isOpen,
    day,
    activities,
    setDialogVisible,
    updateActivities,
    defaultActivity,
  } = props;
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [editedActivities, setEditedActivities] = useState([]);
  const [hasChange, setHasChange] = useState(false);
  const [newActivity, setNewActivity] = useState(defaultActivity);
  const [newActivityDuration, setNewActivityDuration] = useState(60);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    setEditedActivities(activities);
  }, [activities]);

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography style={{ color: "#f7f7f5" }} variant="h6">
          {children}
        </Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setDialogVisible(false)}
          >
            <Close />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };

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
    setIsLoading(true);
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
          backgroundColor: colors.stepQuestOrange,
        }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => setDialogVisible(false)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography className="section-header-big">Add Activity</Typography>
            <Typography className="section-body">{`${day.toDateString()}`}</Typography>
          </div>
        </DialogTitle>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "20px",
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
                  <Chip
                    key="active"
                    style={{
                      marginRight: "10px",
                      backgroundColor: colors.stepQuestOrange,
                      color: colors.almostWhite,
                    }}
                    label={`${activity.activity} -  ${activity.duration}`}
                    deleteIcon
                    onDelete={() => removeActivity(index)}
                  />
                </div>
              );
            })}
        </div>

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
          <div style={{ display: "flex" }}>
            <Typography
              className="section-body"
              style={{ marginRight: "10px" }}
            >
              Activity
            </Typography>
            <Select
              label="Challenge activity"
              native
              value={newActivity}
              onChange={(event) => {
                setNewActivity(event.target.value);
                setHasChange(true);
              }}
              labelid="select-activity"
              id="activity-select-required"
            >
              <option aria-label="None" value="" />
              {Object.entries(activityList).map((activityOption) =>
                createActivityOption(activityOption)
              )}
            </Select>
          </div>

          <div style={{ display: "flex" }}>
            <Typography
              className="section-body"
              style={{ marginRight: "10px" }}
            >
              Duration (minutes)
            </Typography>
            <Input
              type="number"
              value={newActivityDuration}
              onChange={(event) => {
                setNewActivityDuration(event.target.value);
                setHasChange(true);
              }}
              labelid="activity-duration"
            />
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              margin: "20px",
            }}
          >
            <Button
              disabled={!(newActivityDuration && newActivity)}
              className={classes.saveButton}
              style={{
                margin: "10px",
              }}
              onClick={addActivity}
              startIcon={<Add />}
            >
              Add
            </Button>
            <Button
              disabled={!hasChange}
              className={classes.saveButton}
              onClick={saveActivities}
              startIcon={<Save />}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
