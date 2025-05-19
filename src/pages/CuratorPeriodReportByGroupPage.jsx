import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReportData,
  getPeriodOrdersReportByGroup,
} from "../redux/reportSlice";
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
import DatePickerUALocalized from "../components/DatePickerUALocalized";

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

const CuratorPeriodReportByGroupPage = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const { periodOrdersByGroup, loading, error } = useSelector(
    (state) => state.report
  );
  const { groups } = useSelector((state) => state.user.currentUser);
  const theme = useTheme();

  const { reportDateLabel, reportDate } =
    reportDateFormatting(periodOrdersByGroup);

  const handleGroupChange = (event) => {
    dispatch(clearReportData());
    setSelectedGroup(event.target.value);
  };

  const handleFromDateChange = (newDate) => {
    setFromDate(newDate);
    dispatch(clearReportData());
  };

  const handleToDateChange = (newDate) => {
    setToDate(newDate);
    dispatch(clearReportData());
  };

  const handleCreateReport = () => {
    if (!selectedGroup) {
      alert("Будь ласка, виберіть групу");
      return;
    }
    if (!fromDate || !toDate) {
      alert("Будь ласка, виберіть діапазон дат");
      return;
    }
    if (toDate.isBefore(fromDate)) {
      alert("Кінцева дата не може бути раніше початкової");
      return;
    }
    if (toDate.diff(fromDate, "day") > 30) {
      alert("Період не може перевищувати 30 днів");
      return;
    }

    dispatch(
      getPeriodOrdersReportByGroup({
        group: selectedGroup,
        fromDate: fromDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD"),
      })
    );
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
          text: `Замовлені страви учнів групи: ${selectedGroup}\nза період ${reportDate}`,
          alignment: "center",
          bold: true,
          fontSize: 16,
          margin: [0, 0, 0, 20],
        },
        ...Object.keys(periodOrdersByGroup?.ordersByDate || {})
          .map((date) => {
            const orders = periodOrdersByGroup.ordersByDate[date];
            const dailyTotal = orders.reduce((sum, row) => sum + row.total, 0);
            return [
              {
                style: "tableExample",
                table: {
                  widths: [80, 100, "*", 80],
                  body: [
                    [
                      { text: "Дата", alignment: "center", bold: true },
                      { text: "Учень", alignment: "center", bold: true },
                      { text: "Страви", alignment: "center", bold: true },
                      { text: "Сума", alignment: "center", bold: true },
                    ],
                    ...orders.map((row) => [
                      { text: row.date, style: "cellPadding" },
                      { text: `${row.lastName}\n${row.firstName}` },
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
                        alignment: "left",
                      },
                      {
                        text: `${row.total} грн.`,
                        alignment: "right",
                        style: "cellPadding",
                      },
                    ]),
                    [
                      {
                        text: `Підсумок за ${date}:`,
                        bold: true,
                        color: primaryColor,
                        colSpan: 3,
                        fontSize: 14,
                        style: "cellPadding",
                        marginBottom: 20,
                        marginTop: 5,
                      },
                      "",
                      "",
                      {
                        text: `${dailyTotal} грн.`,
                        alignment: "right",
                        bold: true,
                        color: primaryColor,
                        fontSize: 14,
                        style: "cellPadding",
                        marginBottom: 20,
                        marginTop: 5,
                      },
                    ],
                  ],
                },
                layout: "lightHorizontalLines",
              },
            ];
          })
          .flat(),
        {
          text: `Загальний підсумок: ${Object.values(
            periodOrdersByGroup?.ordersByDate || {}
          )
            .flat()
            .reduce((sum, row) => sum + row.total, 0)} грн.`,
          bold: true,
          fontSize: 18,
          color: primaryColor,
          alignment: "right",
          margin: [0, 20, 0, 0],
        },
      ],
      defaultStyle: {
        font: "Roboto",
      },
      styles: {
        cellPadding: {
          margin: [5, 0, 10, 0],
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`period_report_group_${selectedGroup}_${reportDateLabel}.pdf`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Звіт по групі за період
      </Typography>

      {groups?.length > 0 && (
        <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
          <InputLabel id="groupSelection">Оберіть групу</InputLabel>
          <Select
            id="groupSelect"
            labelId="groupSelection"
            value={selectedGroup}
            onChange={handleGroupChange}
            label="Оберіть групу"
          >
            {groups.map((groupName) => (
              <MenuItem key={groupName} value={groupName}>
                {groupName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <DatePickerUALocalized
          label="Початкова дата"
          selectedDate={fromDate}
          onDateChange={handleFromDateChange}
        />
        <DatePickerUALocalized
          label="Кінцева дата"
          selectedDate={toDate}
          onDateChange={handleToDateChange}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateReport}
        fullWidth
        disabled={
          groups?.length === 0 || !selectedGroup || !fromDate || !toDate
        }
      >
        Створити
      </Button>

      {groups?.length === 0 && (
        <Alert severity="warning" sx={{ marginTop: 2 }}>
          Групи відсутні. Будь ласка, додайте групи до вашого профілю.
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}

      {periodOrdersByGroup && !loading && (
        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" onClick={handleOpenDialog} fullWidth>
            Переглянути звіт
          </Button>
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Замовлені страви учнів групи: {selectedGroup}
          <br />
          за період {reportDate}
        </DialogTitle>
        <DialogContent>
          {Object.keys(periodOrdersByGroup?.ordersByDate || {}).length === 0 ? (
            <Alert severity="info">Дані для звіту відсутні</Alert>
          ) : (
            Object.keys(periodOrdersByGroup?.ordersByDate || {}).map((date) => {
              const orders = periodOrdersByGroup.ordersByDate[date];
              const dailyTotal = orders.reduce(
                (sum, row) => sum + row.total,
                0
              );
              return (
                <Box key={date} sx={{ marginBottom: 4 }}>
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
                        {orders.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>
                              {row.lastName}
                              <br />
                              {row.firstName}
                            </TableCell>
                            <TableCell>
                              {row.dishes !== ""
                                ? row.dishes
                                : "Пільгове замовлення"}
                            </TableCell>
                            <TableCell align="right">{`${row.total} грн.`}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <Typography variant="h6" color="secondary">
                              Підсумок за {date}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            <Typography variant="h6" color="secondary">
                              {`${dailyTotal} грн.`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Box>
              );
            })
          )}
          {Object.keys(periodOrdersByGroup?.ordersByDate || {}).length > 0 && (
            <Typography
              variant="h5"
              align="right"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Загальний підсумок:{" "}
              {Object.values(periodOrdersByGroup?.ordersByDate || {})
                .flat()
                .reduce((sum, row) => sum + row.total, 0)}{" "}
              грн.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Закрити
          </Button>
          <Button onClick={() => handleDownloadPDF(theme)} color="secondary">
            Завантажити як PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CuratorPeriodReportByGroupPage;
