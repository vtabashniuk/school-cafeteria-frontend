import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import CuratorDashboard from "./pages/CuratorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import StudentsListPage from "./pages/StudentsListPage";
import MenuListPage from "./pages/MenuListPage";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "/curator",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <CuratorDashboard />,
      },
      {
        path: "students-list",
        element: <StudentsListPage />,
      },
      {
        path: "menu-list",
        element: <MenuListPage />,
      },
    ],
  },
  {
    path: "/student",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <StudentDashboard />,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
