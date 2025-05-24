import { NavLink, useNavigate } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { authApi } from "../../shared/api/api";
import { useAuthStore } from "../stores/authStore";
import { toast } from "react-toastify";
import { useSpinnerStore } from "../../shared/stores/spinnerStore";
import AirlineSeatIndividualSuiteIcon from "@mui/icons-material/AirlineSeatIndividualSuite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HailIcon from "@mui/icons-material/Hail";

export default function Sidebar() {
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.user);
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      toast.success("Logout successfully");
      clearUser();
    } catch (err) {
      toast.error("Something has gone wrong");
    } finally {
      clearUser();
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-800 sticky text-gray-300 top-0 flex flex-col max-w-64 w-64 h-[100vh] min-h-[100vh]">
      <div className="p-4 bg-gray-900 text-white/90">
        {!user ? (
          <div className="flex flex-row gap-1 items-center">
            <HailIcon />
            <div>Guest portal</div>
          </div>
        ) : user.is_patient ? (
          <div className="flex flex-row gap-1 items-center">
            <AirlineSeatIndividualSuiteIcon />
            <div>Patient portal</div>
          </div>
        ) : (
          <div className="flex flex-row gap-1 items-center">
            <MedicalServicesIcon />
            <div>Doctor portal</div>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            "px-4 py-3 duration-200 flex flex-row items-center gap-1 hover:bg-red-900/20 hover:text-red-500 " +
            (isActive ? "text-red-500 bg-red-900/20" : "text-white")
          }
        >
          <DashboardIcon />
          <div>Dashboard</div>
        </NavLink>
      </div>
      <div
        onClick={handleLogoutClick}
        className="px-4 py-3 duration-200 rounded flex flex-row items-center gap-1 hover:bg-red-900/20 hover:text-red-500 cursor-pointer"
      >
        <LogoutIcon />
        <div>Logout</div>
      </div>
    </div>
  );
}
