import { useEffect } from "react";
import { useSpinnerStore } from "../shared/stores/spinnerStore";
import { authApi } from "../shared/api/api";
import { useAuthStore } from "../layouts/stores/authStore";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Profile() {
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone_number,
    },
  });

  const onSubmit = async (value) => {
    try {
      setLoading(true);
      const res = await authApi.updateProfile(value);
      const { id, ...updatedUser } = res;
      setUser(updatedUser);
      reset({
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone_number,
      });
      toast.success("Update profile successfully");
    } catch (err) {
      toast.error("Something has gone wrong");
    } finally {
      setLoading(false);
    }

    console.log(value);
  };

  const handleFormReset = (e) => {
    e.preventDefault();
    reset();
  };

  useEffect(() => {
    setLoading(true);
    authApi
      .getMe()
      .then((res) => setUser(res))
      .catch((err) => {
        toast.error("Something has gone wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-fit mx-auto px-8 pt-2 pb-8 shadow-md rounded-md bg-white">
      <div className="font-bold text-red-900 mb-2">User profile</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-72 max-w-[700px] mx-auto space-y-2"
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-sm">First Name</div>
            <div
              className={
                "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                (errors.firstName ? " !bg-red-500/10" : "")
              }
            >
              <BadgeIcon className="text-gray-400" />
              <input
                placeholder="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="outline-none text-sm bg-transparent w-full"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs pl-4 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <div className="text-sm">Last Name</div>
            <div
              className={
                "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                (errors.lastName ? " !bg-red-500/10" : "")
              }
            >
              <BadgeIcon className="text-gray-400" />
              <input
                placeholder="Last Name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                className="outline-none text-sm bg-transparent w-full"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-xs pl-4 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm">Email</div>
          <div
            className={
              "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
              (errors.email ? " !bg-red-500/10" : "")
            }
          >
            <EmailIcon className="text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="outline-none text-sm bg-transparent w-full"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs pl-4 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <div className="text-sm">Phone number</div>
          <div
            className={
              "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
              (errors.phone ? " !bg-red-500/10" : "")
            }
          >
            <PhoneIcon className="text-gray-400" />
            <input
              placeholder="Phone Number"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Phone number must contain only numbers",
                },
              })}
              className="outline-none text-sm bg-transparent w-full"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs pl-4 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div className="flex flex-row justify-end gap-3">
          <button
            disabled={!isDirty}
            type="submit"
            className="w-fit px-16 font-bold uppercase mt-8 bg-red-700 text-white/90 py-2 rounded-full hover:bg-red-800 duration-200 cursor-pointer disabled:bg-gray-300 disabled:cursor-default"
          >
            Update
          </button>
          <button
            onClick={(e) => handleFormReset(e)}
            disabled={!isDirty}
            className="px-16 w-fit font-bold uppercase mt-8 bg-gray-500 text-white/90 py-2 rounded-full hover:bg-gray-600 duration-200 cursor-pointer disabled:bg-gray-300 disabled:cursor-default"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
