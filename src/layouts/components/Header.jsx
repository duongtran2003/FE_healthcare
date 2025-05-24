import { useMemo } from "react";
import Dropdown from "../../shared/components/Dropdown";
import { useAuthStore } from "../stores/authStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const optionsList = useMemo(() => {
    const list = [
      {
        text: "text1",
        handler: () => console.log("text1"),
      },
      {
        text: "text2",
        handler: () => console.log("text2"),
      },
      {
        text: "text3",
        handler: () => console.log("text3"),
      },
    ];

    return list;
  }, []);

  return (
    <div className="p-4 shadow-md sticky flex flex-row justify-between top-0 bg-white pr-8">
      <div className="text-red-900 font-bold">Healthcare</div>
      <Dropdown
        text={!user ? "Guest" : `${user.first_name} ${user.last_name}`} options={optionsList}
      ></Dropdown>
    </div>
  );
}
