import { useSelector } from "react-redux";
import { TextField } from "@mui/material";

export const UserFilter = ({ filter, onChange }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const userRole = currentUser?.role;

  return (
    <TextField
      label={`Пошук ${userRole === "admin" ? "користувача" : "учня"}`}
      value={filter}
      variant="outlined"
      onChange={onChange}
      fullWidth
    />
  );
};
