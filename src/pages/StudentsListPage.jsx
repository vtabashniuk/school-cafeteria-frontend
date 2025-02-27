import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/userSlice";
import useStudentBalanceAction from "../hooks/useUserBalanceAction";
import useUserFormAction from "../hooks/useUserFormAction";
import BalanceForm from "../components/BalanceForm";
import UserForm from "../components/UserForm";
import UsersList from "../components/UsersList";
import { Button, CircularProgress, Alert, TextField } from "@mui/material";

const StudentsListPage = () => {
  const dispatch = useDispatch();
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
  const users = useSelector((state) => state.user.list || []);
  const loading = useSelector((state) => state.user.loading || false);
  const error = useSelector((state) => state.user.error || null);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredUsers = users.filter(
    (student) =>
      student.role === "student" &&
      student.lastName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Список учнів</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenUserForm(true)}
      >
        Додати учня
      </Button>
      <TextField
        label="Пошук за прізвищем"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
      />
      <UserForm
        open={openUserForm}
        onClose={() => {
          setOpenUserForm(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUserFormSubmit}
        userRole={"student"}
        initialData={selectedUser}
      />

      <BalanceForm
        open={openBalanceDialog}
        onClose={() => {
          setOpenBalanceDialog(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onUpdateBalance={handleUpdateBalance}
      />

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <UsersList
          users={filteredUsers}
          onEdit={handleEdit}
          onUpdateBalance={handleOpenBalanceDialog}
        />
      )}
    </div>
  );
};

export default StudentsListPage;
