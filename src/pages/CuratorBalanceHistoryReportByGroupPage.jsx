import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReportData,
  getBalanceHistoryReportByGroup,
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

const CuratorBalanceHistoryReportByGroupPage = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const { balanceHistoryByGroup, loading, error } = useSelector(
    (state) => state.report
  );
  const { groups } = useSelector((state) => state.user.currentUser);
  const theme = useTheme();

  const { reportDateLabel, reportDate } = reportDateFormatting(
    balanceHistoryByGroup
  );

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
      getBalanceHistoryReportByGroup({
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

    const docDefinition = {
      content: [
        {
          text: `Історія зміни балансу учнів групи: ${selectedGroup}\nза період ${reportDate}`,
          alignment: "center",
          bold: true,
          fontSize: 16,
          margin: [0, 0, 0, 20],
        },
        ...Object.keys(balanceHistoryByGroup?.balanceHistoryByDate || {})
          .map((date) => {
            const entries = balanceHistoryByGroup.balanceHistoryByDate[date];
            return [
              {
                style: "tableExample",
                table: {
                  widths: [80, 100, 70, 100, 100],
                  body: [
                    [
                      { text: "Дата", alignment: "center", bold: true },
                      { text: "Учень", alignment: "center", bold: true },
                      { text: "Сума", alignment: "center", bold: true },
                      { text: "Змінив", alignment: "center", bold: true },
                      { text: "Причина", alignment: "center", bold: true },
                    ],
                    ...entries.map((entry) => [
                      { text: entry.date, fontSize: 10, style: "cellPadding" },
                      {
                        text: `${entry.lastName}\n${entry.firstName}`,
                        fontSize: 10,
                      },
                      {
                        text: `${entry.amount > 0 ? "+" : ""}${
                          entry.amount
                        } грн.`,
                        alignment: "right",
                        color:
                          entry.amount < 0
                            ? theme.palette.balanceReport.negative
                            : theme.palette.balanceReport.positive,
                        fontSize: 10,
                        style: "cellPadding",
                      },
                      {
                        text: entry.changedBy,
                        fontSize: 10,
                        style: "cellPadding",
                      },
                      {
                        text: entry.reason,
                        alignment: "left",
                        fontSize: 10,
                        style: "cellPadding",
                      },
                    ]),
                  ],
                },
                layout: "lightHorizontalLines",
              },
            ];
          })
          .flat(),
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
      .download(
        `balance_history_report_group_${selectedGroup}_${reportDateLabel}.pdf`
      );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Звіт по історії зміни балансу за період
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

      {balanceHistoryByGroup && !loading && (
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
        maxWidth="lg"
      >
        <DialogTitle>
          Історія зміни балансу учнів групи: {selectedGroup}
          <br />
          за період {reportDate}
        </DialogTitle>
        <DialogContent>
          {Object.keys(balanceHistoryByGroup?.balanceHistoryByDate || {})
            .length === 0 ? (
            <Alert severity="info">Дані для звіту відсутні</Alert>
          ) : (
            Object.keys(balanceHistoryByGroup?.balanceHistoryByDate || {})
              .sort((a, b) => {
                const [dayA, monthA, yearA] = a.split(".").map(Number);
                const [dayB, monthB, yearB] = b.split(".").map(Number);
                return (
                  new Date(yearA, monthA - 1, dayA) -
                  new Date(yearB, monthB - 1, dayB)
                );
              })
              .map((date) => {
                const entries =
                  balanceHistoryByGroup.balanceHistoryByDate[date];
                return (
                  <Box key={date} sx={{ marginBottom: 4 }}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Дата</TableCell>
                            <TableCell>Прізвище Ім'я</TableCell>
                            <TableCell>Сума</TableCell>
                            <TableCell>Змінив</TableCell>
                            <TableCell>Причина</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {entries.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>{entry.date}</TableCell>
                              <TableCell>
                                {entry.lastName}
                                <br />
                                {entry.firstName}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  color:
                                    entry.amount < 0
                                      ? theme.palette.balanceReport.negative
                                      : theme.palette.balanceReport.positive,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {`${entry.amount > 0 ? "+" : ""}${
                                  entry.amount
                                } грн.`}
                              </TableCell>
                              <TableCell>{entry.changedBy}</TableCell>
                              <TableCell>{entry.reason}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                );
              })
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

export default CuratorBalanceHistoryReportByGroupPage;
