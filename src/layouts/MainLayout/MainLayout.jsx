import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect } from "react";
import { authApi } from "../../shared/api/api";
import { toast } from "react-toastify";
import { useAuthStore } from "../stores/authStore";
import { useSpinnerStore } from "../../shared/stores/spinnerStore";

export default function MainLayout() {
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setLoading(true);
    authApi
      .getMe()
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        toast.error("Something has gone wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Header />
        <div className="px-8 pt-8 pb-48 bg-gray-100 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
