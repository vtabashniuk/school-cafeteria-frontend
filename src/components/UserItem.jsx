import React from "react";
import useUserAction from "../hooks/useUserAction";
import {
  Box,
  TableRow,
  TableCell,
  Typography,
  Switch,
  Button,
  Checkbox,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";

const UserItem = ({ user, onEdit, onUpdateBalance }) => {
  const { handleSetPassword, handleStatusChange } = useUserAction();

  return (
    <TableRow key={user._id}>
      <TableCell>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography>{user.lastName}</Typography>
          <Typography>{user.firstName}</Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ textAlign: "right" }}>{user.balance}</TableCell>
      <TableCell
        sx={{
          display: { xs: "none", sm: "table-cell" },
        }}
      >
        {user.login}
      </TableCell>
      <TableCell
        sx={{
          display: { xs: "none", sm: "table-cell" },
        }}
      >
        {user.role}
      </TableCell>
      <TableCell
        sx={{
          display: { xs: "none", sm: "table-cell" },
        }}
      >
        <Checkbox checked={user.isBeneficiaries} disabled />
      </TableCell>
      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
        <Switch
          checked={user.isActive}
          onChange={() => handleStatusChange(user._id, user.isActive)}
          color="primary"
        />
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: { xs: "flex", sm: "block" },
            flexWrap: "wrap",
            gap: "8px",
            padding: 1,
            width: "100%",
          }}
        >
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
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default UserItem;
