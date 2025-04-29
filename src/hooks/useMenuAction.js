import { useDispatch } from "react-redux";
import { deleteDish } from "../redux/menuSlice";

const useMenuAction = () => {
  const dispatch = useDispatch();

  const handleDeleteDish = async (dishId) => {
    await dispatch(deleteDish(dishId)).unwrap();
  };

  return { handleDeleteDish };
};

export default useMenuAction;
