import { useAuthStore } from "../layouts/stores/authStore";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-full">
      <div className="text-red-900 font-bold text-xl">
        Welcome to our AI-powered healthcare system!
      </div>
      <div className="p-4 mt-4 bg-white shadow-md rounded-md">
        <div className="text-red-900 text-lg mb-2 font-bold">
          {!user
            ? "Guest dashboard"
            : user.is_patient
              ? "Patient dashboard"
              : "Doctor dashboard"}
        </div>
        {user ? (
          <>
            <div className="italic">{`Welcome back, ${user.first_name ?? "Guest"} ${user.last_name ?? ""}!`}</div>
            <div className="pt-1">
              <div className="text-red-900 font-bold">Your information:</div>
              <div className="text-red-900">
                <span className="font-bold">Username:</span> {user.username}
              </div>
              <div className="text-red-900">
                <span className="font-bold">Email:</span> {user.email}
              </div>
              <div className="text-red-900">
                <span className="font-bold">Phone:</span> {user.phone_number}
              </div>
            </div>
          </>
        ) : (
          <div className="italic">{`Welcome back, Guest!`}</div>
        )}
      </div>
    </div>
  );
}
