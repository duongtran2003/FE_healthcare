import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect } from "react";
import { authApi } from "../../shared/api/api";
import { toast } from "react-toastify";
import { useAuthStore } from "../stores/authStore";

export default function MainLayout() {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    authApi
      .getMe()
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        toast.error("Something has gone wrong");
      });
  }, []);

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full">
        <Header />
        <div className="px-8 pt-8 pb-48">
        <Outlet />
        </div>
      </div>
    </div>
  );
}
