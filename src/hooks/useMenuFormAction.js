import { useState } from "react";
import { useDispatch } from "react-redux";
import { addDish } from "../redux/menuSlice";

const useMenuFormAction = () => {
  const dispatch = useDispatch();
  const [openMenuForm, setOpenMenuForm] = useState(false);

  const handleMenuFormSubmit = async (formData) => {
    try {
      await dispatch(addDish(formData));
      setOpenMenuForm(false);
    } catch (error) {
      return error || "Помилка при додаванні меню";
    }
  };

  return { openMenuForm, setOpenMenuForm, handleMenuFormSubmit };
};
export default useMenuFormAction;
