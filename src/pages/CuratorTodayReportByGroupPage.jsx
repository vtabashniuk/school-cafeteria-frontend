import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearReportData, getTodayOrdersByGroup } from "../redux/reportSlice";
import { reportDateFormatting } from "../utils/reportDateFormatting";
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
import { useTheme } from "@mui/material/styles";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Додаємо шрифт Roboto до pdfMake
pdfMake.vfs = pdfFonts;
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
  const [selectedGroup, setSelectedGroup] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Стан для діалогу
  const dispatch = useDispatch();
  const { todayOrdersByGroup, loading, error } = useSelector(
    (state) => state.report
  );
  const { groups } = useSelector((state) => state.user.currentUser);
  const theme = useTheme();

  const { reportDateLabel, reportDate } =
    reportDateFormatting(todayOrdersByGroup);

  const handleGroupChange = (event) => {
    dispatch(clearReportData());
    setSelectedGroup(event.target.value);
  };

  const handleCreateReport = () => {
    if (!selectedGroup) {
      alert("Будь ласка, виберіть групу");
      return;
    }

    // Викликаємо action для отримання звіту
    dispatch(getTodayOrdersByGroup(selectedGroup));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDownloadPDF = (theme) => {
    const primaryColor = theme.palette.primary.main;

    const docDefinition = {
      content: [
        {
          text: `Замовлені страви учнів групи: ${selectedGroup} на ${reportDate}`,
          alignment: "center",
          bold: true, // Використовуємо жирний шрифт
          fontSize: 16,
          margin: [0, 0, 0, 20],
        },
        {
          style: "tableExample",
          table: {
            widths: [80, 100, "*", "*", 80],
            body: [
              [
                {
                  text: "Дата",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "Учень",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "Страви",
                  alignment: "center",
                  bold: true,
                  colSpan: 2,
                },
                "",
                { text: "Сума", alignment: "center", bold: true },
              ], // Заголовки
              ...todayOrdersByGroup?.map((row) => [
                { text: row.date, style: "cellPadding" },
                {
                  text: `${row.lastName}\n${row.firstName}`,
                },
                {
                  ...(row.dishes !== ""
                    ? {
                        ul: row.dishes.split(";").map((dish) => ({
                          text: dish.trim(),
                          fontSize: 10,
                          margin: [0, 2, 0, 2],
                        })),
                      }
                    : {
                        text: "Пільгове замовлення",
                        color: "#03a9f4",
                        fontSize: 10,
                        margin: [0, 2, 0, 2],
                      }),
                  colSpan: 2,
                  alignment: "left",
                },
                "",
                {
                  text: `${row.total} грн.`,
                  alignment: "right",
                  style: "cellPadding",
                },
              ]),
              [
                {
                  text: "Разом:",
                  bold: true,
                  color: primaryColor,
                  colSpan: 3,
                  fontSize: 18,
                  style: "cellPadding",
                  marginTop: 10,
                },
                "",
                "",
                {
                  text: `${todayOrdersByGroup?.reduce(
                    (sum, row) => sum + row.total,
                    0
                  )} грн.`, // Загальна сума
                  alignment: "right",
                  bold: true,
                  color: primaryColor,
                  colSpan: 2,
                  fontSize: 18,
                  style: "cellPadding",
                  marginTop: 10,
                },
                "",
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
        cellPadding: {
          margin: [5, 0, 10, 0], // Імітація padding через margin
        },
      },
    };

    // Генеруємо і завантажуємо PDF
    pdfMake
      .createPdf(docDefinition)
      .download(`report_group_${selectedGroup}_${reportDateLabel}.pdf`);
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Звіт по групі на поточну дату
      </Typography>

      {groups.length > 0 && (
        <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
          <InputLabel id="groupSelection">Оберіть групу</InputLabel>
          <Select
            id="groupSelect"
            labelId="groupSelection"
            value={selectedGroup}
            label="Оберіть групу"
            onChange={handleGroupChange}
          >
            {groups.map((groupName) => (
              <MenuItem key={groupName} value={groupName}>
                {groupName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateReport}
        fullWidth
        disabled={groups?.length === 0 || !selectedGroup}
      >
        Створити
      </Button>

      {groups?.length === 0 && (
        <Alert severity="warning" sx={{ marginTop: 2 }}>
          Групи відсутні. Будь ласка, додайте групи до вашого профілю.
        </Alert>
      )}

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
        <DialogTitle>Замовлені страви учнів групи: {selectedGroup}</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Прізвище Ім'я</TableCell>
                  <TableCell>Страви</TableCell>
                  <TableCell>Загальна сума</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todayOrdersByGroup?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      {row.lastName}
                      <br />
                      {row.firstName}
                    </TableCell>
                    <TableCell>
                      {row.dishes !== "" ? row.dishes : "Пільгове замовлення"}
                    </TableCell>
                    <TableCell align="right">{`${row.total} грн.`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6" color="secondary">
                      Всього
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color="secondary">
                      {`${todayOrdersByGroup?.reduce(
                        (sum, row) => sum + row.total,
                        0
                      )} грн.`}
                    </Typography>
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
          <Button onClick={() => handleDownloadPDF(theme)} color="secondary">
            Завантажити як PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CuratorTodayReportByGroupPage;
