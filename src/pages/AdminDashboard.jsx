import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, resetLoading, clearError } from "../redux/userSlice";
import useStudentBalanceAction from "../hooks/useStudentBalanceAction";
import useUserFormAction from "../hooks/useUserFormAction";
import { logout } from "../utils";
import BalanceForm from "../components/BalanceForm";
import SearchField from "../components/SearchField";
import UserForm from "../components/UserForm";
import UsersList from "../components/UsersList";
import { Button, CircularProgress } from "@mui/material";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.lastName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Адмін Панель</h2>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => logout(navigate)}
      >
        Вийти
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenUserForm(true)}
      >
        <PersonAddTwoToneIcon />
      </Button>

      <BalanceForm
        open={openBalanceDialog}
        onClose={() => {
          setOpenBalanceDialog(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onUpdateBalance={handleUpdateBalance}
      />

      <UserForm
        open={openUserForm}
        onClose={() => {
          dispatch(clearError());
          dispatch(resetLoading());
          setOpenUserForm(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUserFormSubmit}
        userRole={"curator"}
        initialData={selectedUser}
      />

      <SearchField
        value={filter}
        onChange={handleFilterChange}
        label="Пошук користувача"
      />

      <h3>Список користувачів</h3>
      {loading ? (
        <CircularProgress />
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

export default AdminDashboard;
