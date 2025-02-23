import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  addUser,
  updateUser,
  setPassword,
  resetLoading,
  clearError,
} from "../redux/userSlice";
import { Button, CircularProgress } from "@mui/material";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import UsersList from "../components/UsersList";
import SearchField from "../components/SearchField";
import UserForm from "../components/UserForm";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user.list || []);
  const loading = useSelector((state) => state.user.loading || false);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(-1);
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
      setOpen(false);
    } catch (error) {
      return error || "Помилка при збереженні користувача"; // Повертаємо помилку
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
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

  const handleSetPassword = (userId) => {
    const newPassword = prompt("Введіть новий пароль:");
    if (newPassword) {
      dispatch(setPassword({ id: userId, password: newPassword }));
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.lastName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Адмін Панель</h2>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Вийти
      </Button>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        <PersonAddTwoToneIcon />
      </Button>

      <UserForm
        open={open}
        onClose={() => {
          dispatch(clearError());
          dispatch(resetLoading());
          setOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUserFormSubmit}
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
          onStatusChange={handleStatusChange}
          onSetPassword={handleSetPassword}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
