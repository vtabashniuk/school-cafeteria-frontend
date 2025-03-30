import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useMenuFormAction from "../hooks/useMenuFormAction";
import { useUser } from "../context/UserContext";
import useDishUpdateAction from "../hooks/useDishUpdateAction";
import "dayjs/locale/uk";
import { Button, CircularProgress, Typography } from "@mui/material";
import MenuForm from "../components/MenuForm";
import MenuList from "../components/MenuList";
import DatePickerUALocalized from "../components/DatePickerUALocalized";
import DishUpdateForm from "../components/DishUpdateForm";
import { fetchMenu } from "../redux/menuSlice";
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
    // Тільки при монтуванні компонента запит на меню
    dispatch(fetchMenu());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Фільтрація страв за вибраною датою (только якщо страви є і вони завантажені)
  const filteredDishes = dishes?.filter(
    (dish) => dayjs(dish.date).isSame(selectedDate, "day") // Перевіряємо, чи дата страви співпадає з вибраною
  );

  return (
    <div style={{ padding: "20px" }}>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      )}
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
          style={{ marginTop: "10px" }}
        >
          Додати меню
        </Button>
      )}
      {error && (
        <Typography
          color="error"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          Помилка при завантаженні страв: {error}
        </Typography>
      )}
      {filteredDishes?.length === 0 && !loading && !error && (
        <Typography style={{ textAlign: "center", marginTop: "20px" }}>
          Немає доступних страв на цю дату.
        </Typography>
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
    </div>
  );
};

export default MenuListPage;
