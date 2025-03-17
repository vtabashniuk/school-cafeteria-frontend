import { Typography, Box } from "@mui/material";

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
      <Typography
        variant="h6"
        sx={{
          display: "block", // Задаємо блочний елемент для переносу тексту
        }}
      >
        Сьогодні:
      </Typography>
      <Typography
        variant="h6"
        sx={{
          display: "block", // Задаємо блочний елемент для переносу тексту
        }}
      >
        {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  );
};