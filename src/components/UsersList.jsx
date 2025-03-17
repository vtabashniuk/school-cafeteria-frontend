import React from "react";
import UserItem from "./UserItem";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const UsersList = ({ users, onEdit, onUpdateBalance }) => {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow sx={{ fontSize: "1rem", fontWeight: 500 }}>
          <TableCell>Прізвище Ім'я</TableCell>
          <TableCell>Баланс</TableCell>
          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
            Логін
          </TableCell>
          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
            Роль
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
              onUpdateBalance={onUpdateBalance}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} align="center">
              Немає користувачів
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UsersList;
