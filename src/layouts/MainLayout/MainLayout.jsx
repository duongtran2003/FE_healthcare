import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect } from "react";
import { authApi } from "../../shared/api/api";
import { toast } from "react-toastify";

export default function MainLayout() {
  useEffect(() => {
    authApi
      .getMe()
      .then((res) => {
        console.log(res);
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
        <Outlet />
      </div>
    </div>
  );
}
