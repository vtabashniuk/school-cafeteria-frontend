import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMenu, updateDish } from "../redux/menuSlice";

const useDishUpdateAction = () => {
  const dispatch = useDispatch();
  const [openDishDialog, setOpenDishDialog] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const handleOpenDishDialog = (dish) => {
    setSelectedDish(dish);
    setOpenDishDialog(true);
  };

  const handleUpdateDish = async (id, updatedData) => {
    try {
      await dispatch(updateDish({ id, updatedData })).unwrap();
      await dispatch(fetchMenu());
      setSelectedDish(null);
      setOpenDishDialog(false);
    } catch (error) {
      return error || "Помилка оновлення страви";
    }
  };

  return {
    handleOpenDishDialog,
    handleUpdateDish,
    openDishDialog,
    setOpenDishDialog,
    selectedDish,
    setSelectedDish,
  };
};

export default useDishUpdateAction;
