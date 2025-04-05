import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Switch,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import { layoutButtonStyles } from "../styles/button/button";

const UserItem = ({ user, onEdit, onSetPassword, onUpdateBalance }) => {

  return (
    <TableRow
      key={user._id}
      sx={{
        backgroundColor: user.balance < 0 ? "#DC00000D" : "transparent", // якщо баланс < 0, застосовуємо background
      }}
    >
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
          display: { xs: "none", md: "table-cell" },
          textAlign: "center",
        }}
      >
        {user.role}
      </TableCell>
      <TableCell
        sx={{
          display: { xs: "none", sm: "table-cell" },
          textAlign: "center",
        }}
      >
        {user.group}
      </TableCell>
      <TableCell
        sx={{
          display: { xs: "none", sm: "table-cell", textAlign: "center" },
        }}
      >
        <Checkbox checked={user.isBeneficiaries} disabled />
      </TableCell>
      <TableCell
        sx={{
          display: { xs: "none", sm: "table-cell" },
          textAlign: "center",
        }}
      >
        <Switch
          checked={user.isActive}
          color="primary"
          disabled
        />
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: "grid",
            gridTemplateAreas: `
              "item1 item2"
              "item3 item3"`,
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            sx={{
              ...layoutButtonStyles.gradientPrimary,
              minWidth: "50px",
              gridArea: "item1",
            }}
            onClick={() => onUpdateBalance(user)}
          >
            <CurrencyExchangeOutlinedIcon />
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              ...layoutButtonStyles.gradientSecondary,
              minWidth: "50px",
              gridArea: "item2",
            }}
            onClick={() => onEdit(user)}
          >
            <EditOutlinedIcon />
          </Button>
          <Button
            variant="contained"
            sx={{
              ...layoutButtonStyles.gradientPrimary,
              minWidth: "50px",
              gridArea: "item3",
            }}
            onClick={() => onSetPassword(user)}
          >
            <LockResetOutlinedIcon />
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default UserItem;
