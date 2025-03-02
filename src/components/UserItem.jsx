import React from "react";
import useUserAction from "../hooks/useUserAction";
import { TableRow, TableCell, Switch, Button } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";

const UserItem = ({ user, onEdit, onUpdateBalance }) => {
  const { handleSetPassword, handleStatusChange } = useUserAction();

  return (
    <TableRow key={user._id}>
      <TableCell>{user.lastName}</TableCell>
      <TableCell>{user.firstName}</TableCell>
      <TableCell>{user.balance}</TableCell>
      <TableCell>{user.login}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <Switch
          checked={user.isActive}
          onChange={() => handleStatusChange(user._id, user.isActive)}
          color="primary"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onUpdateBalance(user)}
        >
          <CurrencyExchangeOutlinedIcon />
        </Button>
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
          onClick={() => handleSetPassword(user._id)}
        >
          <LockResetOutlinedIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UserItem;
