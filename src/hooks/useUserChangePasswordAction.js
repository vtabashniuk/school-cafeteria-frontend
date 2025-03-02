import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../redux/userSlice";

const useUserChangePasswordAction = () => {
  const dispatch = useDispatch();
  const [openChangePasswordForm, setOpenChangePasswordForm] = useState(false);

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
    } catch (error) {
      return error || "Помилка зміни пароля";
    }
  };

  return {
    handleChangePassword,
    openChangePasswordForm,
    setOpenChangePasswordForm,
  };
};

export default useUserChangePasswordAction;
