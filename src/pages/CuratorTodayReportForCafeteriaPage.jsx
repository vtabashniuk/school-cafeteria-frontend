import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTodayOrdersReportForCafeteriaByGroup } from "../redux/reportSlice";
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

const CuratorTodayReportForCafeteriaPage = () => {
  const [group, setGroup] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Стан для діалогу
  const dispatch = useDispatch();
  const { todayOrdersReportForCafeteria, loading, error } = useSelector(
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
    dispatch(getTodayOrdersReportForCafeteriaByGroup(group));
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
          text: `Реєстр замовлень для їдальні по групі: ${group}`,
          font: "Roboto",
          fontSize: 18,
          bold: true, // Використовуємо жирний шрифт
          margin: [0, 0, 0, 20],
        },

        // Пільгове харчування
        {
          style: "tableExample",
          table: {
            widths: [100, "*", 100],
            body: [
              ["Дата", "Тип", "Кількість"], // Заголовки для пільгових страв
              ...(todayOrdersReportForCafeteria?.beneficiaryOrders > 0
                ? [
                    [
                      new Date(
                        todayOrdersReportForCafeteria?.date
                      ).toLocaleDateString(),
                      "Пільгове харчування",
                      todayOrdersReportForCafeteria?.beneficiaryOrders,
                    ],
                  ]
                : []),
              [
                {
                  text: "Разом (пільгове меню)",
                  colSpan: 2,
                  alignment: "right",
                },
                "", // Порожня клітинка для об'єднання
                todayOrdersReportForCafeteria?.beneficiaryOrders
                  ? `${todayOrdersReportForCafeteria?.beneficiaryOrders} шт.`
                  : "-",
              ], // Підсумок для пільгових страв
            ],
            margin: [0, 40], // Можна регулювати між таблицями
          },
          layout: "lightHorizontalLines", // Стиль таблиці
        },

        // Порожній рядок між таблицями
        {
          text: "", // Порожній рядок між таблицями
          margin: [0, 20],
        },

        // Страви звичайного меню
        {
          style: "tableExample",
          table: {
            widths: [100, "*", "*", "*", 100],
            body: [
              ["Дата", "Страва", "Ціна", "Кількість", "Сума"], // Заголовки для звичайного меню
              ...todayOrdersReportForCafeteria?.paidDishes?.map((row) => [
                new Date(
                  todayOrdersReportForCafeteria?.date
                ).toLocaleDateString(),
                row.dishName || "-", // Перевірка на undefined
                row.price || "-", // Перевірка на undefined
                row.quantity || "-", // Перевірка на undefined
                row.totalPrice || "-", // Перевірка на undefined
              ]),
              [
                "",
                {
                  text: "Разом (звичайне меню)",
                  colSpan: 3,
                  alignment: "right",
                },
                "",
                "",
                `${
                  todayOrdersReportForCafeteria?.paidDishes?.reduce(
                    (total, row) => total + row.totalPrice,
                    0
                  ) || 0
                } грн`, // Перевірка на undefined
              ], // Підсумок для звичайного меню
            ],
            margin: [0, 40], // Можна регулювати між таблицями
          },
          layout: "lightHorizontalLines", // Стиль таблиці
        },

        // Порожній рядок між таблицями
        {
          text: "", // Порожній рядок між таблицями
          margin: [0, 20],
        },

        // Страви вільного продажу
        {
          style: "tableExample",
          table: {
            widths: [100, "*", "*", "*", 100],
            body: [
              ["Дата", "Страва", "Ціна", "Кількість", "Сума"], // Заголовки для вільного продажу
              ...todayOrdersReportForCafeteria?.freeSaleDishes?.map((row) => [
                new Date(
                  todayOrdersReportForCafeteria?.date
                ).toLocaleDateString(),
                row.dishName || "-", // Перевірка на undefined
                row.price || "-", // Перевірка на undefined
                row.quantity || "-", // Перевірка на undefined
                row.totalPrice || "-", // Перевірка на undefined
              ]),
              [
                "",
                {
                  text: "Разом (вільний продаж)",
                  colSpan: 3,
                  alignment: "right",
                },
                "",
                "",
                `${
                  todayOrdersReportForCafeteria?.freeSaleDishes?.reduce(
                    (total, row) => total + row.totalPrice,
                    0
                  ) || 0
                } грн`, // Перевірка на undefined
              ], // Підсумок для вільного продажу
            ],
            margin: [0, 40],
          },
          layout: "lightHorizontalLines", // Стиль таблиці
        },

        // Порожній рядок між таблицями
        {
          text: "", // Порожній рядок між таблицями
          margin: [0, 20],
        },

        // Загальний підсумок
        {
          style: "tableExample",
          table: {
            widths: [200, "*", "*", 100],
            body: [
              [
                { text: "Загальна сума до оплати:", bold: true },
                "",
                "",
                `${todayOrdersReportForCafeteria?.total || 0} грн`, // Перевірка на undefined
              ],
            ],
          },
          layout: "lightHorizontalLines", // Стиль таблиці
        },
      ],
      defaultStyle: {
        font: "Roboto", // Встановлюємо шрифт за замовчуванням
      },
    };

    // Генеруємо і завантажуємо PDF
    pdfMake.createPdf(docDefinition).download(`report_group_${group}.pdf`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Реєстр замовлень для їдальні по групі на поточну дату
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
      {todayOrdersReportForCafeteria && !loading && (
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
        <DialogTitle>
          Реєстр замовлень для їдальні по групі: {group}
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            {/* Таблиця страв для пільгового меню */}
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
                    <TableCell>
                      {new Date(
                        todayOrdersReportForCafeteria?.date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>Пільгове харчування</TableCell>
                    <TableCell align="center">
                      {todayOrdersReportForCafeteria?.beneficiaryOrders}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    <Typography variant="h6" color="secondary">
                      Разом (пільгове меню)
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color="secondary">
                      {todayOrdersReportForCafeteria?.beneficiaryOrders} шт.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/* Таблиця страв для звичайного меню */}
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
                {todayOrdersReportForCafeteria?.paidDishes.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(
                        todayOrdersReportForCafeteria?.date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{row.dishName}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="center">{row.quantity}</TableCell>
                    <TableCell align="right">{row.totalPrice}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography>Всього звичайне меню</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      {todayOrdersReportForCafeteria?.paidDishes.reduce(
                        (totalSum, item) => totalSum + item.totalPrice,
                        0
                      )}{" "}
                      грн.
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/* Таблиця страв для меню вільного продажу */}
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
                {todayOrdersReportForCafeteria?.freeSaleDishes.map(
                  (row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(
                          todayOrdersReportForCafeteria?.date
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{row.dishName}</TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                      <TableCell align="center">{row.quantity}</TableCell>
                      <TableCell align="right">{row.totalPrice}</TableCell>
                    </TableRow>
                  )
                )}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Typography>Всього меню вільного продажу</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>
                      {todayOrdersReportForCafeteria?.freeSaleDishes.reduce(
                        (totalSum, item) => totalSum + item.totalPrice,
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
                      {todayOrdersReportForCafeteria?.total} грн.
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
          <Button onClick={handleDownloadPDF} color="secondary">
            Завантажити як PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CuratorTodayReportForCafeteriaPage;
