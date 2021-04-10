import React, { useState } from "react";
import { Typography, TextField } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

export default function EditableTextField(props) {
  const { field, current } = props;
  const [newValue, setNewValue] = useState(current);
  const [editMode, setEditMode] = useState(false);

  return (
    <div>
      {editMode ? (
        <TextField
          id={`edit-${field}`}
          label={field}
          onChange={(event) => {
            setNewValue(event.target.value);
          }}
        />
      ) : (
        <Typography>{newValue}</Typography>
      )}

      <EditIcon onClick={() => setEditMode(true)} />
    </div>
  );
}
