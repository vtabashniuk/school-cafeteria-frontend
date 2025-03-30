import React from "react";
import { useUser } from "../context/UserContext";
import MenuItem from "./MenuItem";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const MenuList = ({ dishes, onDishUpdate }) => {
  const { currentUser } = useUser();
  const student = currentUser?.role === "student";
  return (
    <>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ display: student ? "none" : "table-cell" }}>
              Дата
            </TableCell>
            <TableCell>Страва</TableCell>
            <TableCell>Ціна</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dishes.length > 0 ? (
            dishes.map((dish) => (
              <MenuItem
                key={dish._id}
                dish={dish}
                onDishUpdate={onDishUpdate}
                student={student}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Немає страв
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default MenuList;
