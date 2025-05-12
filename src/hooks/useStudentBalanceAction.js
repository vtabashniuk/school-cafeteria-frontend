import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUsers, updateBalance } from "../redux/userSlice";

const useStudentBalanceAction = () => {
  const dispatch = useDispatch();
  const [openBalanceDialog, setOpenBalanceDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleOpenBalanceDialog = (user) => {
    setOpenBalanceDialog(true);
    setSelectedStudent(user);
  };
  const handleUpdateBalance = async (id, newBalance, reason) => {
    try {
      const response = await dispatch(
        updateBalance({ id, newBalance, reason })
      ).unwrap();
      await dispatch(fetchUsers()).unwrap();
      setSelectedStudent(null);
      setOpenBalanceDialog(false);
      return response;
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
