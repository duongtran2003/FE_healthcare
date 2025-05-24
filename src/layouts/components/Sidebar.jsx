import { NavLink } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function Sidebar() {
  return (
    <div className="bg-gray-800 sticky top-0 flex flex-col max-w-64 w-64 h-[100vh] min-h-[100vh]">
      <div className="p-4 bg-gray-900 text-white">Healthcare</div>
      <div className="mx-2 mt-2 flex flex-col">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            "px-4 py-3 duration-200 rounded flex flex-row items-center gap-1 hover:bg-red-900/30 hover:text-red-500 " +
            (isActive ? "text-red-500 bg-red-900/30" : "text-white")
          }
        >
          <DashboardIcon />
          <i className="fas fa-chart-line"></i>
          <div>Dashboard</div>
        </NavLink>
      </div>
    </div>
  );
}
