import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../redux/menuSlice";
import useMenuFormAction from "../hooks/useMenuFormAction";
import { useUser } from "../context/UserContext";
import useDishUpdateAction from "../hooks/useDishUpdateAction";
import "dayjs/locale/uk";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DishUpdateForm, MenuForm } from "../forms";
import MenuList from "../components/MenuList";
import DatePickerUALocalized from "../components/DatePickerUALocalized";
import dayjs from "dayjs";

const MenuListPage = () => {
  const { currentUser } = useUser();
  const userRole = currentUser?.role;
  const dispatch = useDispatch();
  const { openMenuForm, setOpenMenuForm, handleMenuFormSubmit } =
    useMenuFormAction();
  const {
    handleOpenDishDialog,
    handleUpdateDish,
    openDishDialog,
    setOpenDishDialog,
    selectedDish,
    setSelectedDish,
  } = useDishUpdateAction();

  const { list: dishes, loading, error } = useSelector((state) => state.menu);

  const [selectedDate, setSelectedDate] = useState(dayjs()); // За замовчуванням поточна дата

  useEffect(() => {
    dispatch(fetchMenu());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Фільтрація страв за вибраною датою (только якщо страви є і вони завантажені)
  const filteredDishes = dishes?.filter(
    (dish) => dayjs(dish.date).isSame(selectedDate, "day") // Перевіряємо, чи дата страви співпадає з вибраною
  );

  return (
    <Box p={2}>
      {/* {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      )} */}
      <Box py={2} sx={{ display: "flex", gap: 1 }}>
        <DatePickerUALocalized
          label={"Виберіть дату"}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate} // Оновлюємо стан вибраної дати
        />
        {userRole === "curator" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenMenuForm(true)}
          >
            Додати меню
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="error" variant="outlined">
          Помилка при завантаженні страв: {error}
        </Alert>
      )}
      {filteredDishes?.length === 0 && !loading && !error && (
        <Alert severity="info" variant="outlined">
          Немає доступних страв на цю дату.
        </Alert>
      )}
      <MenuList
        dishes={filteredDishes || []}
        onDishUpdate={handleOpenDishDialog}
      />
      <MenuForm
        open={openMenuForm}
        onClose={() => setOpenMenuForm(false)} // Тільки закриваємо без додаткових запитів
        onSubmit={handleMenuFormSubmit} // Оновлений метод для обробки форми
      />
      <DishUpdateForm
        open={openDishDialog}
        dish={selectedDish}
        onClose={() => {
          setOpenDishDialog(false);
          setSelectedDish(null);
        }}
        onDishUpdate={handleUpdateDish}
      />
    </Box>
  );
};

export default MenuListPage;
