import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser, fetchUsers, updateUser } from "../redux/userSlice";

const useUserFormAction = () => {
  const dispatch = useDispatch();
  const [openUserForm, setOpenUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenUserForm(true);
  };

  const handleUserFormSubmit = async (formData) => {
    try {
      if (selectedUser && selectedUser._id) {
        await dispatch(
          updateUser({ id: selectedUser._id, updatedData: formData })
        ).unwrap();
      } else {
        await dispatch(addUser(formData)).unwrap();
      }
      await dispatch(fetchUsers());
      setSelectedUser(null);
      setOpenUserForm(false);
    } catch (error) {
      return error || "Помилка при збереженні користувача"; // Повертаємо помилку
    }
  };
  return {
    handleEdit,
    handleUserFormSubmit,
    openUserForm,
    setOpenUserForm,
    selectedUser,
    setSelectedUser,
  };
};

export default useUserFormAction;
