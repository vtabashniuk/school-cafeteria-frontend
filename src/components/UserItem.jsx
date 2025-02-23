import React from "react";
import { TableRow, TableCell, Switch, Button } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

const UserItem = ({ user, onStatusChange, onEdit, onSetPassword }) => {
  return (
    <TableRow key={user._id}>
      <TableCell>{user.lastName}</TableCell>
      <TableCell>{user.login}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <Switch
          checked={user.isActive}
          onChange={() => onStatusChange(user._id, user.isActive)}
          color="primary"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit(user)}
        >
          <EditOutlinedIcon />
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onSetPassword(user._id)}
        >
          <LockResetOutlinedIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UserItem;
