import { useMemo } from "react";
import Dropdown from "../../shared/components/Dropdown";
import { useAuthStore } from "../stores/authStore";
import { useSpinnerStore } from "../../shared/stores/spinnerStore";
import { useNavigate } from "react-router";
import { authApi } from "../../shared/api/api";
import { toast } from "react-toastify";

export default function Header() {
  const user = useAuthStore((state) => state.user);

  const clearUser = useAuthStore((state) => state.clearUser);
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

  const optionsList = useMemo(() => {
    const list = [
      {
        text: user ? "Logout" : "Login",
        handler: () => (user ? handleLogoutClick() : navigate("/login")),
      },
    ];

    if (user) {
      list.unshift({
        text: "Profile",
        handler: () => navigate("/profile"),
      });
    }

    return list;
  }, [user]);

  return (
    <div className="p-4 shadow-md sticky flex flex-row justify-between top-0 bg-white pr-8">
      <div className="text-red-900 font-bold">Healthcare</div>
      <Dropdown
        text={!user ? "Guest" : `${user.first_name} ${user.last_name}`}
        options={optionsList}
      ></Dropdown>
    </div>
  );
}
