import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuForToday } from "../redux/menuSlice";
import {
  fetchTodayOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../redux/orderSlice";
import { CreateEditOrderForm } from "../forms";
import { getMe } from "../redux/userSlice";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const OrderListPage = () => {
  const dispatch = useDispatch();
  const { todayMenu } = useSelector((state) => state.menu);
  const { orders, loading: ordersLoading } = useSelector(
    (state) => state.order
  );
  const { currentUser, loading: userLoading } = useSelector(
    (state) => state.user
  );

  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    dispatch(fetchMenuForToday());
    dispatch(fetchTodayOrders());
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

  const potentialBalance = editingOrder
    ? currentUser?.balance + editingOrder.total - total
    : currentUser?.balance - total;

  const handleQuantityChange = (dishId, quantity) => {
    if (/^\d*$/.test(quantity)) {
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
      setOrderError("");
    } else {
      setOrderError("Введеть ціле значення кількості");
      return;
    }
  };

  const handleCreateClick = () => {
    setEditingOrder(null);
    setOrderItems([]);
    setOrderDialogOpen(true);
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setOrderItems(
      order.items.map((item) => ({
        dishId: item.dishId,
        quantity: item.quantity,
      }))
    );
    setOrderDialogOpen(true);
  };

  const handleSubmit = () => {
    if (orderItems.length === 0) {
      setOrderError("Будь ласка, додайте хоча б одну страву в замовлення!");
      return;
    }
    if (potentialBalance < -200) {
      setOrderError("Недостатньо коштів на рахунку для виконання замовлення!");
      return;
    }

    const orderData = {
      studentId: currentUser._id,
      items: orderItems
        .filter((item) => item.quantity > 0)
        .map((item) => {
          const dish = todayMenu.find((dish) => dish._id === item.dishId);
          return {
            dishId: item.dishId,
            dishName: dish?.dishName,
            price: dish?.price,
            quantity: item.quantity,
            isFreeSale: dish?.isFreeSale,
          };
        }),
      total,
    };

    if (editingOrder) {
      dispatch(updateOrder({ orderId: editingOrder._id, orderData })).then(
        () => {
          dispatch(fetchTodayOrders());
          dispatch(getMe());
          closeDialog();
        }
      );
    } else {
      dispatch(createOrder(orderData)).then(() => {
        dispatch(fetchTodayOrders());
        dispatch(getMe());
        closeDialog();
      });
    }
  };

  const handleDeleteClick = (orderId) => {
    dispatch(deleteOrder(orderId)).then(() => {
      dispatch(fetchTodayOrders());
      dispatch(getMe());
    });
  };

  const closeDialog = () => {
    setOrderDialogOpen(false);
    setOrderItems([]);
    setEditingOrder(null);
    setOrderError("");
  };

  return (
    <>
      {userLoading || ordersLoading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">Мої замовлення</Typography>
            <Button variant="contained" onClick={handleCreateClick}>
              Створити замовлення
            </Button>
          </Box>

          {orders.length === 0 ? (
            <Alert severity="info" variant="outlined">
              Замовлень ще немає.
            </Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Страви</TableCell>
                  <TableCell>Сума</TableCell>
                  <TableCell>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.items.map((item) => (
                        <div key={item.dishId}>
                          {item.dishName} — {item.quantity} шт.
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{order.total} грн</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleEditClick(order)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(order._id)}
                      >
                        Видалити
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <CreateEditOrderForm
            open={orderDialogOpen}
            onClose={closeDialog}
            mode={editingOrder ? "edit" : "create"}
            orderItems={orderItems}
            todayMenu={todayMenu}
            potentialBalance={potentialBalance}
            total={total}
            handleQuantityChange={handleQuantityChange}
            handleSubmit={handleSubmit}
            orderError={orderError}
          />
        </>
      )}
    </>
  );
};

export default OrderListPage;
