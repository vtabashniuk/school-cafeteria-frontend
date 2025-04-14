import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // Додатковий плагін для підтримки часових поясів
import utc from "dayjs/plugin/utc"; // Додатковий плагін для підтримки UTC
import useMenuAction from "../hooks/useMenuAction";
import { Box, Button, TableRow, TableCell } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { layoutButtonStyles } from "../styles/button/button";

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
      <TableCell sx={{ textAlign: "right" }}>{dish.price}</TableCell>
      <TableCell sx={{ display: student ? "none" : "table-cell" }}>
        <Box
          display={"flex"}
          gap={1}
          justifyContent={"center"}
          sx={{ flexDirection: { xs: "column", sm: "row" } }}
        >
          <Button
            onClick={() => handleDeleteDish(dish._id)}
            sx={{ ...layoutButtonStyles.gradientSecondary, minWidth: "50px" }}
          >
            <RemoveCircleOutlineOutlinedIcon />
          </Button>
          <Button
            onClick={() => onDishUpdate(dish)}
            sx={{ ...layoutButtonStyles.gradientPrimary, minWidth: "50px" }}
          >
            <EditOutlinedIcon />
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default MenuItem;
