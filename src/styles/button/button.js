const commonProperties = {
  backgroundSize: "200% auto",
  borderRadius: "6px",
  color: "white",
  textAlign: "center",
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
  transition: "0.5s",
  "&:hover": {
    backgroundPosition: "right center",
    textDecoration: "none",
  },
  "&:active": {
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
    transform: "scale(0.98)",
  },
};

export const layoutButtonStyles = {
  gradientSecondary: {
    backgroundImage:
      "linear-gradient(to right, #800000 0%, #dc0000 51%, #800000 100%)",
    minWidth: "165px",
    ...commonProperties,
  },
  gradientPrimary: {
    backgroundImage:
      "linear-gradient(to right, #0061F2 0%, #003B5C 51%, #0061F2 100%)",
    minWidth: "165px",
    ...commonProperties,
  },
};

export const controlButtonStyles = {
  backgroundImage:
    "linear-gradient(to right, #0061F2 0%, #003B5C 51%, #0061F2 100%)",
  minWidth: "85px",
  ...commonProperties,
};
