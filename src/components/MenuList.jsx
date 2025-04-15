import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import MenuItem from "./MenuItem";
import {
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Box,
} from "@mui/material";

const MenuList = ({ dishes, onDishUpdate }) => {
  const { currentUser } = useUser();
  const student = currentUser?.role === "student";

  // Стани для вкладок
  const [tabIndex, setTabIndex] = useState(0);

  // Фільтрація страв за isFreeSale
  const regularDishes = dishes.filter((dish) => !dish.isFreeSale);
  const freeSaleDishes = dishes.filter((dish) => dish.isFreeSale);

  // Обробка зміни вкладки
  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Box>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Меню вкладки"
      >
        <Tab label="Страви з меню" />
        <Tab label="Страви з вільного продажу" />
      </Tabs>

      {/* Вкладка для страв з меню */}
      {tabIndex === 0 && (
        <Table stickyHeader sx={{ tableLayout: "fixed", marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: student ? "none" : "table-cell" }}>
                Дата
              </TableCell>
              <TableCell>Страва</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell sx={{ display: student ? "none" : "table-cell" }}>
                Дії
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {regularDishes.length > 0 ? (
              regularDishes.map((dish) => (
                <MenuItem
                  key={dish._id}
                  dish={dish}
                  onDishUpdate={onDishUpdate}
                  student={student}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Alert severity="info" variant="outlined">
                    Немає доступних страв на цю дату.
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Вкладка для страв з вільного продажу */}
      {tabIndex === 1 && (
        <Table stickyHeader sx={{ tableLayout: "fixed", marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: student ? "none" : "table-cell" }}>
                Дата
              </TableCell>
              <TableCell>Страва</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell sx={{ display: student ? "none" : "table-cell" }}>
                Дії
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {freeSaleDishes.length > 0 ? (
              freeSaleDishes.map((dish) => (
                <MenuItem
                  key={dish._id}
                  dish={dish}
                  onDishUpdate={onDishUpdate}
                  student={student}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Alert severity="info" variant="outlined">
                    Немає доступних страв з вільного продажу.
                  </Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default MenuList;
