import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  icon: {
    "&:hover": {
      cursor: "pointer",
    },
    marginLeft: "10px",
  },
}));

export default function EditableTextField(props) {
  const { label, updateField } = props;
  const [value, setValue] = useState();
  const [editMode, setEditMode] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setValue(props.current);
  }, [props]);

  return (
    <div>
      {editMode ? (
        <div style={{ display: "flex" }}>
          <TextField
            id={`edit-${label}`}
            label={label}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
          <SaveIcon
            className={classes.icon}
            onClick={() => {
              updateField(value);
              setEditMode(false);
            }}
          />
          <CancelIcon
            className={classes.icon}
            onClick={() => {
              setEditMode(false);
            }}
          />
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <Typography>{value}</Typography>
          <EditIcon
            className={classes.icon}
            onClick={() => {
              setEditMode(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
