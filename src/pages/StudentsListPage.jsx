import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUser, setPassword } from "../redux/userSlice";
import { Button, CircularProgress, Alert, TextField } from "@mui/material";
// import StudentsList from "../components/StudentsList";
// import StudentForm from "../components/StudentForm";

const StudentsListPage = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.user.list || []);
  const loading = useSelector((state) => state.user.loading || false);
  const error = useSelector((state) => state.user.error || null);

  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleStatusChange = (studentId, currentStatus) => {
    dispatch(
      updateUser({ id: studentId, updatedData: { isActive: !currentStatus } })
    );
  };

  const handleSetPassword = (studentId) => {
    const newPassword = prompt("Введіть новий пароль:");
    if (newPassword) {
      dispatch(setPassword({ id: studentId, password: newPassword }));
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.role === "student" &&
      student.lastName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Список учнів</h2>
      <TextField
        label="Пошук за прізвищем"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Додати учня
      </Button>

      {/* <StudentForm
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedStudent(null);
        }}
        initialData={selectedStudent}
      />

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <StudentsList
          students={filteredStudents}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onSetPassword={handleSetPassword}
        />
      )} */}
    </div>
  );
};

export default StudentsListPage;
