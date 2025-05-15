import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReportData,
  getTodayOrdersReportForCafeteriaByGroup,
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

const CuratorTodayReportForCafeteriaPage = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const { todayOrdersReportForCafeteria, loading, error } = useSelector(
    (state) => state.report
  );
  const { groups } = useSelector((state) => state.user.currentUser);
  const theme = useTheme();

  const { reportDateLabel, reportDate } = reportDateFormatting(
    todayOrdersReportForCafeteria
  );

  const handleGroupChange = (event) => {
    dispatch(clearReportData());
    setSelectedGroup(event.target.value);
  };

  const handleCreateReport = () => {
    if (!selectedGroup) {
      alert("Будь ласка, виберіть групу");
      return;
    }

    // Викликаємо action для отримання звіту для однієї групи
    dispatch(getTodayOrdersReportForCafeteriaByGroup(selectedGroup));
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
          text: `Реєстр замовлень для їдальні по групі: ${selectedGroup} на ${reportDate}`,
          alignment: "center",
          bold: true,
          fontSize: 16,
          margin: [0, 0, 0, 20],
        },

        // Пільгове харчування
        {
          style: "tableExample",
          table: {
            widths: [80, "*", 70],
            body: [
              [
                {
                  text: "Дата",
                  alignment: "center",
                  bold: true,
                },
                { text: "Тип", bold: true },
                { text: "Кількість", alignment: "center", bold: true },
              ],
              ...(todayOrdersReportForCafeteria?.beneficiaryOrders > 0
                ? [
                    [
                      { text: reportDate, style: "cellPadding" },
                      "Пільгове харчування",
                      {
                        text: todayOrdersReportForCafeteria?.beneficiaryOrders,
                        alignment: "right",
                        style: "cellPadding",
                      },
                    ],
                  ]
                : []),
              [
                {
                  text: "Разом (пільгове меню):",
                  alignment: "right",
                  color: primaryColor,
                  colSpan: 2,
                },
                "",
                {
                  text: todayOrdersReportForCafeteria?.beneficiaryOrders
                    ? `${todayOrdersReportForCafeteria?.beneficiaryOrders} шт.`
                    : "-",
                  alignment: "right",
                  color: primaryColor,
                  style: "cellPadding",
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },

        // Порожній рядок
        { text: "", margin: [0, 20] },

        // Страви звичайного меню
        {
          style: "tableExample",
          table: {
            widths: [80, "*", 60, 70, 70],
            body: [
              [
                {
                  text: "Дата",
                  alignment: "center",
                  bold: true,
                },
                { text: "Страва", bold: true },
                {
                  text: "Ціна",
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "Кількість",
                  alignment: "center",
                  bold: true,
                },
                { text: "Сума", alignment: "center", bold: true },
              ],
              ...(todayOrdersReportForCafeteria?.paidDishes?.map((row) => [
                { text: reportDate, style: "cellPadding" },
                row.dishName || "-",
                {
                  text: `${row.price ? `${row.price} грн.` : "-"}`,

                  alignment: "right",
                  style: "cellPadding",
                },
                { text: row.quantity || "-", alignment: "center" },
                {
                  text: `${row.totalPrice ? `${row.totalPrice} грн.` : "-"}`,

                  alignment: "right",
                  style: "cellPadding",
                },
              ]) || []),
              [
                "",
                {
                  text: "Разом (звичайне меню):",
                  alignment: "right",
                  color: primaryColor,
                  colSpan: 3,
                },
                "",
                "",
                {
                  text: `${
                    todayOrdersReportForCafeteria?.paidDishes?.reduce(
                      (total, row) => total + (row.totalPrice || 0),
                      0
                    ) || 0
                  } грн.`,
                  alignment: "right",
                  color: primaryColor,
                  style: "cellPadding",
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },

        // Порожній рядок
        { text: "", margin: [0, 20] },

        // Страви вільного продажу
        {
          style: "tableExample",
          table: {
            widths: [80, "*", 55, 70, 70],
            body: [
              [
                {
                  text: "Дата",
                  alignment: "center",
                  bold: true,
                },
                { text: "Страва", bold: true },
                { text: "Ціна", alignment: "center", bold: true },
                {
                  text: "Кількість",
                  alignment: "center",
                  bold: true,
                },
                { text: "Сума", alignment: "center", bold: true },
              ],
              ...(todayOrdersReportForCafeteria?.freeSaleDishes?.map((row) => [
                { text: reportDate, style: "cellPadding" },
                row.dishName || "-",
                {
                  text: `${row.price ? `${row.price} грн.` : "-"}`,
                  alignment: "right",
                  style: "cellPadding",
                },
                { text: row.quantity || "-", alignment: "center" },
                {
                  text: `${row.totalPrice ? `${row.totalPrice} грн.` : "-"}`,
                  alignment: "right",
                  style: "cellPadding",
                },
              ]) || []),
              [
                "",
                {
                  text: "Разом (вільний продаж):",
                  alignment: "right",
                  color: primaryColor,
                  colSpan: 3,
                },
                "",
                "",
                {
                  text: `${
                    todayOrdersReportForCafeteria?.freeSaleDishes?.reduce(
                      (total, row) => total + (row.totalPrice || 0),
                      0
                    ) || 0
                  } грн.`,
                  alignment: "right",
                  color: primaryColor,
                  style: "cellPadding",
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },

        // Порожній рядок
        { text: "", margin: [0, 20] },

        // Загальний підсумок
        {
          style: "tableExample",
          table: {
            widths: [300, "*", "*", 100],
            body: [
              [
                {
                  text: "Загальна сума до оплати:",
                  bold: true,
                  color: primaryColor,
                  colSpan: 2,
                  fontSize: 18,
                  style: "cellPadding",
                },
                "",
                "",
                {
                  text: `${todayOrdersReportForCafeteria?.total || 0} грн.`,
                  alignment: "right",
                  bold: true,
                  color: primaryColor,
                  fontSize: 18,
                  style: "cellPadding",
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },
      ],
      defaultStyle: {
        font: "Roboto",
      },
      styles: {
        cellPadding: {
          margin: [5, 0, 10, 0], // Імітація padding через margin
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        `cafeteria_report_group_${selectedGroup}_${reportDateLabel}.pdf`
      );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Реєстр замовлень для їдальні по групі на поточну дату
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

      {todayOrdersReportForCafeteria && !loading && (
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
          Реєстр замовлень для їдальні по групі: {selectedGroup}
        </DialogTitle>
        <DialogContent>
          {todayOrdersReportForCafeteria &&
          !todayOrdersReportForCafeteria.beneficiaryOrders &&
          !todayOrdersReportForCafeteria.paidDishes?.length &&
          !todayOrdersReportForCafeteria.freeSaleDishes?.length ? (
            <Alert severity="info">Дані для звіту відсутні</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="h5" color="primary">
                        Пільгове харчування
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Кількість</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayOrdersReportForCafeteria?.beneficiaryOrders > 0 && (
                    <TableRow>
                      <TableCell>{reportDate}</TableCell>
                      <TableCell>Пільгове харчування</TableCell>
                      <TableCell align="right">
                        {todayOrdersReportForCafeteria?.beneficiaryOrders}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <Typography>Всього (пільгове меню)</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>
                        {todayOrdersReportForCafeteria?.beneficiaryOrders || 0}{" "}
                        шт.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="h5" color="primary">
                        Страви звичайного меню
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Страва</TableCell>
                    <TableCell>Ціна</TableCell>
                    <TableCell>Кількість</TableCell>
                    <TableCell>Сума</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(todayOrdersReportForCafeteria?.paidDishes || []).map(
                    (row, index) => (
                      <TableRow key={index}>
                        <TableCell>{reportDate}</TableCell>
                        <TableCell>{row.dishName || "-"}</TableCell>
                        <TableCell align="right">{`${
                          row.price ? `${row.price} грн.` : "-"
                        }`}</TableCell>
                        <TableCell align="center">
                          {row.quantity || "-"}
                        </TableCell>
                        <TableCell align="right">
                          {`${row.totalPrice ? `${row.totalPrice} грн.` : "-"}`}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography>Всього (звичайне меню)</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>
                        {(
                          todayOrdersReportForCafeteria?.paidDishes || []
                        ).reduce(
                          (totalSum, item) => totalSum + (item.totalPrice || 0),
                          0
                        )}{" "}
                        грн.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="h5" color="primary">
                        Страви меню вільного продажу
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Страва</TableCell>
                    <TableCell>Ціна</TableCell>
                    <TableCell>Кількість</TableCell>
                    <TableCell>Сума</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(todayOrdersReportForCafeteria?.freeSaleDishes || []).map(
                    (row, index) => (
                      <TableRow key={index}>
                        <TableCell>{reportDate}</TableCell>
                        <TableCell>{row.dishName || "-"}</TableCell>
                        <TableCell align="right">{`${
                          row.price ? `${row.price} грн.` : "-"
                        }`}</TableCell>
                        <TableCell align="center">
                          {row.quantity || "-"}
                        </TableCell>
                        <TableCell align="right">
                          {`${row.totalPrice ? `${row.totalPrice} грн.` : "-"}`}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography>Всього (меню вільного продажу)</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>
                        {(
                          todayOrdersReportForCafeteria?.freeSaleDishes || []
                        ).reduce(
                          (totalSum, item) => totalSum + (item.totalPrice || 0),
                          0
                        )}{" "}
                        грн.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <Typography variant="h6" color="secondary">
                        Разом до оплати:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="secondary">
                        {todayOrdersReportForCafeteria?.total || 0} грн.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
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

export default CuratorTodayReportForCafeteriaPage;
