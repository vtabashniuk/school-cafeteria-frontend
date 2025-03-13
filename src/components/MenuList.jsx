import React from "react";
import MenuItem from "./MenuItem";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const MenuList = ({ dishes, onDishUpdate }) => {
  return (
    <>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
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
