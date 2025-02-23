import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CuratorDashboard from "./pages/CuratorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentsListPage from "./pages/StudentsListPage";
import MenuListPage from "./pages/MenuListPage";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/admin", element: <AdminDashboard /> },
  {
    path: "/curator",
    element: <CuratorDashboard />,
    children: [
      {
        path: "studentslist",
        element: <StudentsListPage />,
      },
      { path: "menulist", element: <MenuListPage /> },
    ],
  },
  { path: "/student", element: <StudentDashboard /> },
]);

export default router;
