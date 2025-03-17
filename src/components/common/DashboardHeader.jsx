import { useUser } from "../../context/UserContext";
import { Box, CircularProgress, Typography } from "@mui/material";

export const DashboardHeader = ({ loading }) => {
  const { currentUser } = useUser();

  return (
    <>
      {!loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Панель керування</Typography>
          <Typography variant="h6">
            {currentUser?.lastName} {currentUser?.firstName}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};
