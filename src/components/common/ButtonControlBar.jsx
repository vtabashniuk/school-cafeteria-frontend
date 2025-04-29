import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMe } from "../../redux/userSlice";
import { Box, Button, CircularProgress } from "@mui/material";
import { controlButtonStyles } from "../../styles/button/button";

export const ButtonControlBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.currentUser);
  const userRole = currentUser?.role;
  const loading = useSelector((state) => state.user.loading);

  // Завантажуємо дані користувача тільки якщо вони ще не завантажені
  useEffect(() => {
    if (!currentUser) {
      dispatch(getMe());
    }
  }, [dispatch, currentUser]);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto" }} />;
  }

  return (
    <>
      {userRole === "curator" && (
        <Box sx={{ display: "flex", gap: 2, padding: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate("students-list")}
            sx={controlButtonStyles}
          >
            Учні
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("menu-list")}
            sx={controlButtonStyles}
          >
            Меню
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("reports")}
            sx={controlButtonStyles}
          >
            Звіти
          </Button>
        </Box>
      )}
      {userRole === "student" && (
        <Box sx={{ display: "flex", gap: 2, padding: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate("menu-list")}
            sx={controlButtonStyles}
          >
            Меню
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("order-list")}
            sx={controlButtonStyles}
          >
            Замовлення
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("reports")}
            sx={controlButtonStyles}
          >
            Звіти
          </Button>
        </Box>
      )}
    </>
  );
};
