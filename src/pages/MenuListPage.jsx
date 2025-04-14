import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../redux/menuSlice";
import { useUser } from "../context/UserContext";
import useFreSaleDishAction from "../hooks/useFreeSaleDishAction";
import useMenuFormAction from "../hooks/useMenuFormAction";
import useDishUpdateAction from "../hooks/useDishUpdateAction";
import "dayjs/locale/uk";
import { Alert, Box, Button } from "@mui/material";
import { DishUpdateForm, FreeSaleDishForm, MenuForm } from "../forms";
import MenuList from "../components/MenuList";
import DatePickerUALocalized from "../components/DatePickerUALocalized";
import dayjs from "dayjs";

const MenuListPage = () => {
  const { currentUser } = useUser();
  const userRole = currentUser?.role;
  const dispatch = useDispatch();
  const {
    handleFreeSaleDishSubmit,
    openFreeSaleDishForm,
    setOpenFreeSaleDishForm,
  } = useFreSaleDishAction();
  const { handleMenuFormSubmit, openMenuForm, setOpenMenuForm } =
    useMenuFormAction();
  const {
    handleOpenDishDialog,
    handleUpdateDish,
    openDishDialog,
    setOpenDishDialog,
    selectedDish,
    setSelectedDish,
  } = useDishUpdateAction();

  const { list: dishes, error } = useSelector((state) => state.menu);

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
      <Box py={2} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <DatePickerUALocalized
          label={"Виберіть дату"}
          onDateChange={setSelectedDate} // Оновлюємо стан вибраної дати
          selectedDate={selectedDate}
        />
        {userRole === "curator" && (
          <Button
            color="primary"
            onClick={() => setOpenMenuForm(true)}
            sx={{ maxHeight: { sm: "36.5px" } }}
            variant="contained"
          >
            Додати меню
          </Button>
        )}
        <Button
          color="primary"
          onClick={() => setOpenFreeSaleDishForm(true)}
          sx={{ maxHeight: { sm: "36.5px" } }}
          variant="contained"
        >
          Вільний продаж
        </Button>
      </Box>
      {error && (
        <Alert severity="error" variant="outlined">
          Помилка при завантаженні страв: {error}
        </Alert>
      )}
      {/* {filteredDishes?.length === 0 && !loading && !error && (
        <Alert severity="info" variant="outlined">
          Немає доступних страв на цю дату.
        </Alert>
      )} */}
      <MenuList
        dishes={filteredDishes || []}
        onDishUpdate={handleOpenDishDialog}
      />
      <MenuForm
        open={openMenuForm}
        onClose={() => setOpenMenuForm(false)} // Тільки закриваємо без додаткових запитів
        onSubmit={handleMenuFormSubmit} // Оновлений метод для обробки форми
      />
      <FreeSaleDishForm
        open={openFreeSaleDishForm}
        onClose={() => setOpenFreeSaleDishForm(false)}
        onDishSubmit={handleFreeSaleDishSubmit}
        selectedDate={selectedDate}
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
