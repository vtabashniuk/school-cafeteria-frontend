import React from "react";
import UserItem from "./UserItem";
import {
  Alert,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const UsersList = ({ users, onEdit, onSetPassword, onUpdateBalance }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Перевіряємо, чи екран менший за "sm"
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const columnsCount = isSmallScreen ? 3 : isMediumScreen ? 7 : 8;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }} stickyHeader>
        <TableHead>
          <TableRow sx={{ fontSize: "1rem", fontWeight: 500 }}>
            <TableCell>Прізвище Ім'я</TableCell>
            <TableCell>Баланс</TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Логін
            </TableCell>
            <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
              Роль
            </TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Група
            </TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Пільговик
            </TableCell>
            <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
              Активний
            </TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                onEdit={onEdit}
                onSetPassword={onSetPassword}
                onUpdateBalance={onUpdateBalance}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsCount} align="center">
                <Alert severity="info" variant="outlined">
                  Немає користувачів
                </Alert>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersList;
