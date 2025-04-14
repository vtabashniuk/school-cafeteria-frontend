import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFreeSaleDish } from "../redux/menuSlice";

const useFreSaleDishAction = () => {
  const dispatch = useDispatch();
  const [openFreeSaleDishForm, setOpenFreeSaleDishForm] = useState(false);

  const handleFreeSaleDishSubmit = async (formData) => {
    try {
      await dispatch(addFreeSaleDish(formData)).unwrap();
      setOpenFreeSaleDishForm(false);
    } catch (error) {
      return error || "Помилка при додаванні страви";
    }
  };

  return {
    handleFreeSaleDishSubmit,
    openFreeSaleDishForm,
    setOpenFreeSaleDishForm,
  };
};

export default useFreSaleDishAction;
