import { Box, Typography } from "@mui/material";

export const DateComponent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // На малих екранах розташування вертикальне
        alignItems: "flex-start",
        gap: 1,
        fontWeight: "bold",
      }}
    >
      <Typography variant="h6">Сьогодні:</Typography>
      <Typography variant="h6">{new Date().toLocaleDateString()}</Typography>
    </Box>
  );
};
