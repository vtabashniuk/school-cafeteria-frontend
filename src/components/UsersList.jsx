import React from "react";
import UserItem from "./UserItem";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const UsersList = ({ users, onStatusChange, onEdit, onSetPassword }) => {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Прізвище</TableCell>
          <TableCell>Логін</TableCell>
          <TableCell>Роль</TableCell>
          <TableCell>Активний</TableCell>
          <TableCell>Дії</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.length > 0 ? (
          users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onSetPassword={onSetPassword}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center">
              Немає користувачів
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UsersList;
