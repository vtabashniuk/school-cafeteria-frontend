import { useUser } from "../../context/UserContext";
import { TextField } from "@mui/material";

export const UserFilter = ({ filter, onChange }) => {
  const { currentUser } = useUser();
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
