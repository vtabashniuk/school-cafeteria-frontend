import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Box, Button } from "@mui/material";
import { controlButtonStyles } from "../../styles/button/button";

export const ButtonControlBar = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const userRole = currentUser?.role;

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
          <Button variant="contained" sx={controlButtonStyles} disabled>
            Звіти
          </Button>
        </Box>
      )}
      {userRole === "student" && (
        <Box>
          <Button variant="contained" onClick={() => navigate("menu-list")}>
            Меню
          </Button>
          <Button variant="contained" disabled>
            Звіти
          </Button>
        </Box>
      )}
    </>
  );
};
