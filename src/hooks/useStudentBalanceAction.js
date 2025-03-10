import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUsers, updateBalance } from "../redux/userSlice";

const useStudentBalanceAction = () => {
  const dispatch = useDispatch();
  const [openBalanceDialog, setOpenBalanceDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleOpenBalanceDialog = (user) => {
    setSelectedStudent(user);
    setOpenBalanceDialog(true);
  };
  const handleUpdateBalance = async (id, newBalance) => {
    try {
      await dispatch(updateBalance({ id, newBalance })).unwrap();
      await dispatch(fetchUsers());
      setSelectedStudent(null);
      setOpenBalanceDialog(false);
    } catch (error) {
      return error || "Помилка оновлення балансу";
    }
  };

  return {
    handleOpenBalanceDialog,
    handleUpdateBalance,
    openBalanceDialog,
    setOpenBalanceDialog,
    selectedStudent,
    setSelectedStudent,
  };
};

export default useStudentBalanceAction;
