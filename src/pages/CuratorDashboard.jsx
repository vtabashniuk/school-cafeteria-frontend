import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
  fetchUsers,
  updateUser,
  setPassword,
  addUser,
} from "../redux/userSlice";
import { Button, CircularProgress, Alert } from "@mui/material";
import UsersList from "../components/UsersList";
import SearchField from "../components/SearchField";
import UserForm from "../components/UserForm";
import MenuList from "../components/MenuList";

const CuratorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user.list || []);
  const loading = useSelector((state) => state.user.loading || false);
  const error = useSelector((state) => state.user.error || null);

  const [view, setView] = useState(""); // students, menu
  const [filter, setFilter] = useState("");
  const [openUserForm, setOpenUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(-1);
  };

  const handleUserFormSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await dispatch(
          updateUser({ id: selectedUser.id, updatedData: formData })
        ).unwrap();
      } else {
        await dispatch(addUser(formData)).unwrap();
      }
      await dispatch(fetchUsers());
      setOpenUserForm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenUserForm(true);
  };

  const handleStatusChange = (userId, currentStatus) => {
    dispatch(
      updateUser({ id: userId, updatedData: { isActive: !currentStatus } })
    );
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
      <h2>Куратор Панель</h2>
      <p>Поточна дата: {new Date().toLocaleDateString()}</p>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Вийти
      </Button>
      <Button variant="contained" onClick={() => navigate("studentslist")}>
        Учні
      </Button>
      <Button variant="contained" onClick={() => navigate("menulist")}>
        Меню
      </Button>
      <Button variant="contained" disabled>
        Звіти
      </Button>

      <Outlet />

      {/* {view === "students" && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenUserForm(true)}
          >
            Додати учня
          </Button>
          <UserForm
            open={openUserForm}
            onClose={() => {
              setOpenUserForm(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUserFormSubmit}
            initialData={selectedUser}
          />
          <SearchField
            value={filter}
            onChange={handleFilterChange}
            label="Пошук учня"
          />
          <h3>Список учнів</h3>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <UsersList
              users={filteredUsers}
              onEdit={handleEdit}
              onStatusChange={handleStatusChange}
              onSetPassword={handleSetPassword}
            />
          )}
        </>
      )}

      {view === "menu" && <MenuList />} */}
    </div>
  );
};

export default CuratorDashboard;
