import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import CuratorDashboard from "./pages/CuratorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import StudentsListPage from "./pages/StudentsListPage";
import MenuListPage from "./pages/MenuListPage";
import OrderListPage from "./pages/OrderListPage";
import CuratorReportLayout from "./layout/CuratorReportLayout";
import CuratorTodayReportByGroupPage from "./pages/CuratorTodayReportByGroupPage";
import StudentReportsPage from "./pages/StudentReportsPage";
import CuratorTodayReportForCafeteriaPage from "./pages/CuratorTodayReportForCafeteriaPage";
import CuratorPeriodReportForCafeteriaPage from "./pages/CuratorPeriodReportForCafeteriaPage";
import CuratorReportBalanceHistoryPage from "./pages/CuratorReportBalanceHistoryPage";

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
        children: [
          {
            path: "students-list",
            element: <StudentsListPage />,
          },
          {
            path: "menu-list",
            element: <MenuListPage />,
          },
          {
            path: "reports",
            element: <CuratorReportLayout />,
            children: [
              {
                path: "cafeteria-today-report",
                element: <CuratorTodayReportForCafeteriaPage />,
              },
              {
                path: "cafeteria-period-report",
                element: <CuratorPeriodReportForCafeteriaPage />,
              },
              {
                path: "todayOrders",
                element: <CuratorTodayReportByGroupPage />,
              },
              {
                path: "balance-report",
                element: <CuratorReportBalanceHistoryPage />,
              },
            ],
          },
        ],
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
        children: [
          {
            path: "menu-list",
            element: <MenuListPage />,
          },
          {
            path: "order-list",
            element: <OrderListPage />,
          },
          {
            path: "reports",
            element: <StudentReportsPage />,
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
