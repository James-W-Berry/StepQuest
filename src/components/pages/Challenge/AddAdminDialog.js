import React, { useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import colors from "../../../assets/colors";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";

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

export default function AddAdminDialog(props) {
  const theme = useTheme();
  const classes = useStyles();

  const {
    isOpen,
    title,
    handleClose,
    handleConfirm,
    attemptedSoloAdminDeparture,
    participants,
  } = props;
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [displayAddButton, setDisplayAddButton] = useState(false);
  const [adminList, setAdminList] = useState([]);

  const handleChange = (event) => {
    console.log(event.target.value);
    setAdminList(event.target.value);
    if (event.target.value.length > 0) {
      setDisplayAddButton(true);
    }
  };

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

  return (
    <Dialog
      open={isOpen}
      fullScreen={fullScreen}
      disableBackdropClick={false}
      fullWidth={true}
      onClose={handleClose}
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
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {`Add an Admin to ${title}`}
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
          {attemptedSoloAdminDeparture && (
            <Typography
              variant="h5"
              style={{ textAlign: "center", padding: "10px" }}
            >
              You are currently the only admin for this challenge. Add another
              admin before departing.
            </Typography>
          )}
          <Typography style={{ textAlign: "center", padding: "10px" }}>
            Challenge administrators can:
          </Typography>
          <Typography style={{ textAlign: "center", padding: "10px" }}>
            * Invite new participants
          </Typography>
          <Typography style={{ textAlign: "center", padding: "10px" }}>
            * Remove participants
          </Typography>
          <Typography style={{ textAlign: "center", padding: "10px" }}>
            * Update the challenge title, start and end date, description, and
            activity
          </Typography>
          <Typography style={{ textAlign: "center", padding: "10px" }}>
            * Delete the challenge
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              padding: "10px",
            }}
          >
            <FormControl className={classes.formControl}>
              <InputLabel id="chip-label">Select a participant</InputLabel>
              <Select
                labelId="chip-label"
                id="chips"
                multiple
                value={adminList}
                onChange={handleChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((selected) => (
                      <Chip
                        key={selected}
                        label={selected}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {participants.map((participant) => (
                  <MenuItem key={participant} value={participant}>
                    {participant}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {displayAddButton && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
                padding: "10px",
              }}
            >
              <Button
                onClick={() => handleConfirm(adminList)}
                style={{
                  backgroundColor: "red",
                  color: colors.white,
                }}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
