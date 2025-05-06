import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTodayOrdersByGroup } from "../redux/reportSlice";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from "@mui/material";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Додаємо шрифт Helvetica до pdfMake
pdfMake.addVirtualFileSystem(pdfFonts);
pdfMake.fonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

const CuratorTodayReportByGroupPage = () => {
  const [group, setGroup] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Стан для діалогу
  const dispatch = useDispatch();
  const { todayOrdersByGroup, loading, error } = useSelector(
    (state) => state.report
  );

  // Приклад груп
  const groups = ["13", "11", "12", "14"];

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };

  const handleCreateReport = () => {
    if (!group) {
      alert("Будь ласка, виберіть групу");
      return;
    }

    // Викликаємо action для отримання звіту
    dispatch(getTodayOrdersByGroup(group));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDownloadPDF = () => {
    const docDefinition = {
      content: [
        {
          text: `Звіт по групі: ${group}`,
          font: "Roboto",
          fontSize: 18,
          bold: true, // Використовуємо жирний шрифт
          margin: [0, 0, 0, 20],
        },
        {
          style: "tableExample",
          table: {
            widths: [100, "*", "*", "*", 100],
            body: [
              ["Дата", "Прізвище", "Ім'я", "Страви", "Сума"], // Заголовки
              ...todayOrdersByGroup?.map((row) => [
                new Date(row.date).toLocaleDateString(),
                row.lastName,
                row.firstName,
                row.dishes,
                row.total + " грн",
              ]),
              [
                { text: "Всього", colSpan: 4, alignment: "right", bold: true },
                "",
                "",
                "",
                todayOrdersByGroup?.reduce((sum, row) => sum + row.total, 0) +
                  " грн", // Загальна сума
              ],
            ],
          },
          layout: "lightHorizontalLines", // Стиль таблиці
        },
      ],
      defaultStyle: {
        font: "Roboto", // Встановлюємо шрифт за замовчуванням
      },
      styles: {
        boldText: { font: "Roboto", bold: true }, // Шрифт з жирним стилем
        normalText: { font: "Roboto" }, // Нормальний шрифт
      },
    };

    // Генеруємо і завантажуємо PDF
    pdfMake.createPdf(docDefinition).download(`report_group_${group}.pdf`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Звіт по групі на поточну дату
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Оберіть групу</InputLabel>
        <Select
          value={group}
          label="Оберіть групу"
          onChange={handleGroupChange}
        >
          {groups.map((groupName, index) => (
            <MenuItem key={index} value={groupName}>
              {groupName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateReport}
        fullWidth
      >
        Створити
      </Button>

      {/* Показуємо індикатор завантаження */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Помилка запиту */}
      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}

      {/* Кнопка для відкриття діалогу */}
      {todayOrdersByGroup && !loading && (
        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" onClick={handleOpenDialog} fullWidth>
            Переглянути звіт
          </Button>
        </Box>
      )}

      {/* Діалог з таблицею */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Звіт по групі: {group}</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Прізвище</TableCell>
                  <TableCell>Ім'я</TableCell>
                  <TableCell>Страви</TableCell>
                  <TableCell>Загальна сума</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todayOrdersByGroup?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.dishes}</TableCell>
                    <TableCell>{row.total} грн</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="h6" color="secondary">
                      Всього
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "16px" }}>
                    {todayOrdersByGroup?.reduce(
                      (sum, row) => sum + row.total,
                      0
                    )}{" "}
                    грн.
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Закрити
          </Button>
          {/* Кнопка для завантаження PDF */}
          <Button onClick={handleDownloadPDF} color="secondary">
            Завантажити як PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CuratorTodayReportByGroupPage;
