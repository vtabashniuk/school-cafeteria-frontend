import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsByGroup } from "../redux/userSlice";
import { fetchBalanceHistory } from "../redux/reportSlice"; // припускаємо, що це існує
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const CuratorReportBalanceHistoryPage = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);

  const dispatch = useDispatch();
  const { list, groups, loading, error } = useSelector((state) => state.users);
  const {
    reportData: fetchedReportData,
    loading: reportLoading,
    error: reportError,
  } = useSelector((state) => state.report);

  // Завантаження студентів при виборі групи
  useEffect(() => {
    if (selectedGroup) {
      dispatch(fetchStudentsByGroup(selectedGroup)); // Отримуємо студентів при виборі групи
    }
  }, [selectedGroup, dispatch]);

  // Завантаження історії балансу при виборі студента і дат
  useEffect(() => {
    if (selectedStudent && fromDate && toDate) {
      dispatch(
        fetchBalanceHistory({ userId: selectedStudent, fromDate, toDate })
      );
    }
  }, [selectedStudent, fromDate, toDate, dispatch]);

  // Відображення звіту
  useEffect(() => {
    if (fetchedReportData.length > 0) {
      setReportData(fetchedReportData);
    }
  }, [fetchedReportData]);

  const handleFetchReport = () => {
    if (selectedStudent && fromDate && toDate) {
      dispatch(
        fetchBalanceHistory({ userId: selectedStudent, fromDate, toDate })
      );
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Звіт по історії балансу
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Група</InputLabel>
        <Select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groups.length > 0 ? (
            groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Немає груп</MenuItem>
          )}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedGroup}>
        <InputLabel>Учень</InputLabel>
        <Select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          {list.length > 0 ? (
            list.map((student) => (
              <MenuItem key={student._id} value={student._id}>
                {student.lastName} {student.firstName}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Немає студентів</MenuItem>
          )}
        </Select>
      </FormControl>

      <TextField
        label="Від"
        type="date"
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />

      <TextField
        label="До"
        type="date"
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mb: 2 }}
        onClick={handleFetchReport}
        disabled={loading || !selectedStudent || !fromDate || !toDate}
      >
        Завантажити звіт
      </Button>

      {reportData.length > 0 && (
        <>
          {reportData.map((user) => (
            <Paper key={user.userId} sx={{ my: 2, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {user.fullName}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Зміна</TableCell>
                    <TableCell>Новий баланс</TableCell>
                    <TableCell>Хто змінив</TableCell>
                    <TableCell>Причина</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.balanceHistory.map((entry, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{entry.amount}</TableCell>
                      <TableCell>{entry.newBalance}</TableCell>
                      <TableCell>{entry.changedBy || "-"}</TableCell>
                      <TableCell>{entry.reason || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ))}
        </>
      )}

      {(loading || reportLoading) && (
        <Typography variant="body2" color="textSecondary">
          Завантаження...
        </Typography>
      )}

      {(error || reportError) && (
        <Typography variant="body2" color="error">
          {error || reportError}
        </Typography>
      )}
    </Paper>
  );
};

export default CuratorReportBalanceHistoryPage;
