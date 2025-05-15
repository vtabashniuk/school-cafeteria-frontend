import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Alert,
} from "@mui/material";

export const CreateEditOrderForm = ({
  open,
  onClose,
  mode = "create", // "create" або "edit"
  orderItems,
  todayMenu,
  potentialBalance,
  total,
  handleQuantityChange,
  handleSubmit,
  orderError,
  currentUser,
}) => {
  const renderBalanceAlert = () => {
    if (potentialBalance > 99) {
      return (
        <Alert
          severity="success"
          sx={{ flexGrow: 1, justifyContent: "end" }}
          icon={false}
        >
          {potentialBalance} грн.
        </Alert>
      );
    } else if (potentialBalance > 0) {
      return (
        <Alert
          severity="warning"
          sx={{ flexGrow: 1, justifyContent: "end" }}
          icon={false}
        >
          {potentialBalance} грн.
        </Alert>
      );
    } else {
      return (
        <Alert
          severity="error"
          sx={{ flexGrow: 1, justifyContent: "end" }}
          icon={false}
        >
          {potentialBalance} грн.
        </Alert>
      );
    }
  };

  // Фільтруємо меню: пільговики бачать лише страви з isFreeSale: true
  const filteredMenu = currentUser?.isBeneficiaries
    ? todayMenu.filter((dish) => dish.isFreeSale === true)
    : todayMenu;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? "Редагувати замовлення" : "Створити замовлення"}
      </DialogTitle>
      <DialogContent>
        {orderError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {orderError}
          </Typography>
        )}

        <Box display="flex" sx={{ alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            Прогнозований баланс:
          </Typography>
          {renderBalanceAlert()}
        </Box>

        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Страва</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell>Кількість</TableCell>
              <TableCell>Сума</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMenu.map(({ _id, dishName, price }) => {
              const item = orderItems.find((item) => item.dishId === _id);
              const quantity = item ? item.quantity : "";
              const sum = price * quantity || 0;

              return (
                <TableRow key={_id}>
                  <TableCell>{dishName}</TableCell>
                  <TableCell>{price} грн</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          _id,
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{sum} грн</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="h6">Загальна сума: {total} грн</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={potentialBalance < -200}
        >
          {mode === "edit" ? "Зберегти зміни" : "Відправити замовлення"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
