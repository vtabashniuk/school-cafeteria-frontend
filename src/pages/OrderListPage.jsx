import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuForToday } from "../redux/menuSlice";
import { createOrder } from "../redux/orderSlice";
import { useUser } from "../context/UserContext";
import {
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  TextField,
} from "@mui/material";

const OrderListPage = () => {
  const dispatch = useDispatch();
  const { todayMenu } = useSelector((state) => state.menu);
  const { loading, error } = useSelector((state) => state.order);
  const { currentUser } = useUser();

  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    dispatch(fetchMenuForToday());
  }, [dispatch]);

  useEffect(() => {
    let totalPrice = 0;
    orderItems.forEach((item) => {
      const dish = todayMenu.find((dish) => dish._id === item.dishId);
      if (dish) {
        totalPrice += dish.price * item.quantity;
      }
    });
    setTotal(totalPrice);
  }, [orderItems, todayMenu]);

  // Визначення потенційного балансу
  const potentialBalance = currentUser?.balance - total;

  const handleQuantityChange = (dishId, quantity) => {
    setOrderItems((prevItems) => {
      const updatedItems = [...prevItems];
      const itemIndex = updatedItems.findIndex(
        (item) => item.dishId === dishId
      );
      if (itemIndex >= 0) {
        updatedItems[itemIndex].quantity = quantity;
      } else {
        updatedItems.push({ dishId, quantity });
      }
      return updatedItems;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert("Будь ласка, додайте хоча б одну страву в замовлення!");
      return;
    }

    // Перевірка потенційного балансу перед відправкою замовлення
    if (potentialBalance < -200) {
      alert("Недостатньо коштів на рахунку для виконання замовлення!");
      return;
    }

    const orderData = {
      studentId: currentUser._id,
      items: orderItems.map((item) => {
        const dish = todayMenu.find((dish) => dish._id === item.dishId);
        return {
          dishId: item.dishId,
          dishName: dish?.name,
          price: dish?.price,
          quantity: item.quantity,
        };
      }),
      total,
    };

    dispatch(createOrder(orderData));
  };

  return (
    <>
      <Typography variant="h4">Створити замовлення</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Typography>Доступні страви</Typography>
        <Typography variant="h6">Баланс:</Typography>
        {potentialBalance > 99 ? (
          <Alert icon={false} severity="success">
            {potentialBalance} грн.
          </Alert>
        ) : potentialBalance > 0 ? (
          <Alert icon={false} severity="warning">
            {potentialBalance} грн.
          </Alert>
        ) : (
          <Alert icon={false} severity="error">
            {potentialBalance} грн.
          </Alert>
        )}

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
            {todayMenu && todayMenu.length > 0 ? (
              todayMenu.map(({ _id, dishName, price }) => {
                const item = orderItems.find((item) => item.dishId === _id);
                const quantity = item ? item.quantity : 0;
                const sum = price * quantity;
                return (
                  <TableRow key={_id}>
                    <TableCell>{dishName}</TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={quantity}
                        min="0"
                        onChange={(e) =>
                          handleQuantityChange(
                            _id,
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{sum}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  Немає доступних страв на сьогодні.
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="h6">Загальна сума: {total}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || potentialBalance < -200}
        >
          Відправити замовлення
        </Button>
      </form>
      {loading && <Typography>Завантаження...</Typography>}
    </>
  );
};

export default OrderListPage;
