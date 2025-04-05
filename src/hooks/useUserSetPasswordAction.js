import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPassword } from "../redux/userSlice";

const useUserSetPasswordAction = () => {
  const dispatch = useDispatch();
  const [openSetPasswordForm, setOpenSetPasswordForm] = useState(false);
  const [selectedStudentForSetPassword, setSelectedStudentForSetPassword] =
    useState(null);

  const handleOpenSetPasswordForm = (user) => {
    setOpenSetPasswordForm(true);
    setSelectedStudentForSetPassword(user);
  };

  const handleSetPassword = async (userId, newPassword) => {
    try {
      const response = await dispatch(
        setPassword({ id: userId, password: newPassword })
      ).unwrap();
      return response;
    } catch (error) {
      return error || "Помилка всановлення пароля.";
    }
  };

  return {
    handleOpenSetPasswordForm,
    handleSetPassword,
    openSetPasswordForm,
    setOpenSetPasswordForm,
    selectedStudentForSetPassword,
    setSelectedStudentForSetPassword,
  };
};

export default useUserSetPasswordAction;
