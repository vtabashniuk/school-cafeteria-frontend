import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/userSlice";
import useUserSetPasswordAction from "../hooks/useUserSetPasswordAction";
import useStudentBalanceAction from "../hooks/useStudentBalanceAction";
import useUserFilter from "../hooks/useUserFilter";
import useUserFormAction from "../hooks/useUserFormAction";
import { BalanceForm, SetPasswordForm, UserForm } from "../forms";
import UsersList from "../components/UsersList";
import { UserFilter } from "../components/common";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const StudentsListPage = () => {
  const dispatch = useDispatch();
  const {
    handleOpenSetPasswordForm,
    handleSetPassword,
    openSetPasswordForm,
    setOpenSetPasswordForm,
    selectedStudentForSetPassword,
    setSelectedStudentForSetPassword,
  } = useUserSetPasswordAction();
  const {
    handleOpenBalanceDialog,
    handleUpdateBalance,
    openBalanceDialog,
    setOpenBalanceDialog,
    selectedStudent,
    setSelectedStudent,
  } = useStudentBalanceAction();
  const {
    handleEdit,
    handleUserFormSubmit,
    openUserForm,
    setOpenUserForm,
    selectedUser,
    setSelectedUser,
  } = useUserFormAction();
  const { filter, handleFilterChange } = useUserFilter();

  const users = useSelector((state) => state.user.list || []);
  const loading = useSelector((state) => state.user.loading || false);
  const { groups } = useSelector((state) => state.user.currentUser);
  // Стан для обраної групи
  const [selectedGroup, setSelectedGroup] = useState(
    groups?.length === 1 ? groups[0] : "all"
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUsers());
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Оновлення обраної групи при зміні groups
  useEffect(() => {
    if (groups?.length === 1) {
      setSelectedGroup(groups[0]);
    } else if (!groups?.includes(selectedGroup) && selectedGroup !== "all") {
      setSelectedGroup("all"); // Скидаємо, якщо обрана група більше не в списку
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  // Обробка зміни обраної групи
  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  // Фільтрація учнів
  const filteredUsers = users.filter(
    (student) =>
      student.role === "student" &&
      student.lastName?.toLowerCase().includes(filter.toLowerCase()) &&
      (selectedGroup === "all"
        ? groups.includes(student.group)
        : student.group === selectedGroup) // Фільтр за групою
  );

  return (
    <Box sx={{ padding: 2 }}>
      {groups?.length > 1 && (
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel id="groupSelection">Група</InputLabel>
          <Select
            id="groupSelect"
            labelId="groupSelection"
            value={selectedGroup}
            onChange={handleGroupChange}
            renderValue={(value) => (value === "all" ? "Усі групи" : value)}
            label="Група"
          >
            <MenuItem value="all">
              <em>Усі групи</em>
            </MenuItem>
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <UserFilter filter={filter} onChange={handleFilterChange} />
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: "1.5rem",
          }}
        >
          Список учнів
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenUserForm(true)}
        >
          Додати учня
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <UsersList
          users={filteredUsers}
          onEdit={handleEdit}
          onSetPassword={handleOpenSetPasswordForm}
          onUpdateBalance={handleOpenBalanceDialog}
        />
      )}
      <BalanceForm
        open={openBalanceDialog}
        onClose={() => {
          setOpenBalanceDialog(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onUpdateBalance={handleUpdateBalance}
      />
      <SetPasswordForm
        open={openSetPasswordForm}
        onClose={() => {
          setOpenSetPasswordForm(false);
          setSelectedStudentForSetPassword(null);
        }}
        user={selectedStudentForSetPassword}
        onSetPassword={handleSetPassword}
      />
      <UserForm
        open={openUserForm}
        onClose={() => {
          setOpenUserForm(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUserFormSubmit}
        initialData={selectedUser}
      />
    </Box>
  );
};

export default StudentsListPage;
