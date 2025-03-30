import { useUser } from "../../context/UserContext";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";

export const DashboardHeader = ({ loading }) => {
  const { currentUser } = useUser();

  return (
    <>
      {!loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: "1",
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography variant="h6">Панель керування</Typography>
            <Typography variant="h6">
              {currentUser?.lastName} {currentUser?.firstName}
            </Typography>
          </Box>
          {currentUser?.role === "student" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-end", sm: "baseline" },
                gap: { sm: 1 },
              }}
            >
              <Typography variant="h6">Баланс:</Typography>
              {currentUser?.balance > 99 ? (
                <Alert icon={false} severity="success">
                  {currentUser?.balance} грн.
                </Alert>
              ) : currentUser?.balance > 0 ? (
                <Alert icon={false} severity="warning">
                  {currentUser?.balance} грн.
                </Alert>
              ) : (
                <Alert icon={false} severity="error">
                  {currentUser?.balance} грн.
                </Alert>
              )}
            </Box>
          )}
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
