import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/userSlice";
import useUserSetPasswordAction from "../hooks/useUserSetPasswordAction";
import useStudentBalanceAction from "../hooks/useStudentBalanceAction";
import useUserFilter from "../hooks/useUserFilter";
import useUserFormAction from "../hooks/useUserFormAction";
import { BalanceForm, SetPasswordForm, UserForm } from "../forms";
import UsersList from "../components/UsersList";
import { UserFilter } from "../components/common";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

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

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUsers());
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter(
    (student) =>
      student.role === "student" &&
      student.lastName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
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
        userRole={"student"}
        initialData={selectedUser}
      />
    </Box>
  );
};

export default StudentsListPage;
