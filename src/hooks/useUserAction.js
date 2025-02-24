import { useDispatch } from "react-redux";
import { fetchUsers, setPassword, updateUser } from "../redux/userSlice";

const useUserAction = () => {
  const dispatch = useDispatch();

  const handleSetPassword = (userId) => {
    const newPassword = prompt("Введіть новий пароль:");
    if (newPassword) {
      dispatch(setPassword({ id: userId, password: newPassword }));
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      await dispatch(
        updateUser({ id: userId, updatedData: { isActive: !currentStatus } })
      );
      await dispatch(fetchUsers());
    } catch (error) {
      console.log("Помилка оновлення користувача:", error);
    }
  };

  return { handleSetPassword, handleStatusChange };
};

export default useUserAction;
