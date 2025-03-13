const commonProperties = {
  backgroundSize: "200% auto",
  borderRadius: "6px",
  minWidth: "160px",
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

export const buttonStyles = {
  gradientLogout: {
    backgroundImage:
      "linear-gradient(to right, #cb2d3e 0%, #ef473a 51%, #cb2d3e 100%)",
    ...commonProperties,
  },
  gradientPrimary: {
    backgroundImage:
      "linear-gradient(to right, #6190E8 0%, #A7BFE8 51%, #6190E8 100%)",
    ...commonProperties,
  },
};
