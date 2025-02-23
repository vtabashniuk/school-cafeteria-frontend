//SearchField.jsx
import React from "react";
import { TextField } from "@mui/material";

const SearchField = ({ value, onChange, label }) => {
  return (
    <TextField
      label={label}
      fullWidth
      margin="dense"
      value={value}
      onChange={onChange}
      autoComplete="off"
    />
  );
};

export default SearchField;
