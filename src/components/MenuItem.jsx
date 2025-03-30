import React from "react";
import useMenuAction from "../hooks/useMenuAction";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // Додатковий плагін для підтримки часових поясів
import utc from "dayjs/plugin/utc"; // Додатковий плагін для підтримки UTC
import { TableRow, TableCell, Button } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

dayjs.extend(utc);
dayjs.extend(timezone);

const MenuItem = ({ dish, onDishUpdate, student }) => {
  const { handleDeleteDish } = useMenuAction();

  return (
    <TableRow key={dish._id}>
      <TableCell sx={{ display: student ? "none" : "table-cell" }}>
        {dayjs(dish.date).tz("Europe/Kiev").format("DD.MM.YYYY")}
      </TableCell>
      <TableCell>{dish.dishName}</TableCell>
      <TableCell sx={{textAlign: "right"}}>{dish.price}</TableCell>
      <TableCell sx={{ display: student ? "none" : "table-cell" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDeleteDish(dish._id)}
        >
          <RemoveCircleOutlineOutlinedIcon />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onDishUpdate(dish)}
        >
          <EditOutlinedIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default MenuItem;
