import useAutologout from "../hooks/useAutoLogout";
import { Outlet } from "react-router-dom";

const StudentDashboard = () => {
  useAutologout();

  return <Outlet />;
};

export default StudentDashboard;
