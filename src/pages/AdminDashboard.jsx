import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, resetLoading, clearError } from "../redux/userSlice";
import useStudentBalanceAction from "../hooks/useStudentBalanceAction";
import useUserFormAction from "../hooks/useUserFormAction";
import useUserFilter from "../hooks/useUserFilter";
import { UserFilter } from "../components/common";
import BalanceForm from "../components/BalanceForm";
import UserForm from "../components/UserForm";
import UsersList from "../components/UsersList";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";

const AdminDashboard = () => {
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
  const { filter, handleFilterChange } = useUserFilter();

  const users = useSelector((state) => state.user.list || []);
  const loading = useSelector((state) => state.user.loading || false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUsers());
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter((user) =>
    user.lastName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <UserFilter filter={filter} onChange={handleFilterChange} />
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          paddingBottom: 2,
          paddingTop: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: "1.5rem",
          }}
        >
          Список користувачів
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenUserForm(true)}
        >
          <PersonAddTwoToneIcon />
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <UsersList
          users={filteredUsers}
          onEdit={handleEdit}
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
    </Box>
  );
};

export default AdminDashboard;
