import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Link } from "react-router";
import { useSpinnerStore } from "../shared/stores/spinnerStore";
import { authApi } from "../shared/api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const pageVariants = {
  initial: { opacity: 0.7, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0.7, x: -100 },
};

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { accountType: "patient" },
  });

  const navigate = useNavigate();
  const setLoading = useSpinnerStore((state) => state.setLoading);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await authApi.register(data);
      toast.success("Register successfully");
      navigate("/login");
    } catch (err) {
      if (err.status === 400 && err?.response?.data) {
        for (const key in err.response.data) {
          toast.error(err.response.data[key][0]);
          setError(key, {
            type: "manual",
            message: err.response.data[key],
          });
        }

        return;
      }
      toast.error("Something has gone wrong");
    } finally {
      setLoading(false);
    }
  };

  const password = watch("password");

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="flex flex-row"
    >
      <div className="w-[40vw] bg-red-800 flex flex-col">
        <div className="text-white/90 font-bold text-4xl text-center mt-24">
          Healthcare system
        </div>
        <div className="px-20">
          <div className="text-white/90 font-bold text-lg mt-20 mb-4">
            Already have an account?
          </div>
          <div className="text-white/90">
            Log in to continue your personalized healthcare experience. Our
            AI-powered platform helps you manage your health, access medical
            insights, and stay connected with care providers — all in one place.
          </div>
          <Link
            to="/login"
            className="flex flex-row-reverse ml-auto items-center text-red-900 mt-8 w-fit bg-white gap-2 rounded-full px-6 py-2 group"
          >
            <div className="duration-400 min-w-[85px] group-hover:ml-8 font-bold text-right">
              Log Me In
            </div>
            <KeyboardArrowLeftIcon />
          </Link>
        </div>
      </div>

      <div className="w-[60vw] flex flex-col items-center h-[100vh] overflow-y-auto">
        <div className="text-red-800 mt-24 uppercase text-4xl font-bold">
          Register
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-72 w-[70%] mx-auto p-8 space-y-2"
        >
          <div>
            <label className="font-bold text-sm text-red-800 block mb-1">
              Account Type
            </label>
            <div className="flex gap-8 px-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="patient"
                  {...register("accountType", {
                    required: "Account type is required",
                  })}
                  defaultChecked
                  className="cursor-pointer accent-red-700"
                />
                <span className="text-sm text-red-800">Patient</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="doctor"
                  {...register("accountType", {
                    required: "Account type is required",
                  })}
                  className="cursor-pointer accent-red-700"
                />
                <span className="text-sm text-red-800">Doctor</span>
              </label>
            </div>
            {errors.accountType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.accountType.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
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
            <div
              className={
                "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                (errors.phone ? " !bg-red-500/10" : "")
              }
            >
              <PhoneIcon className="text-gray-400" />
              <input
                placeholder="Phone Number"
                {...register("phone", { required: "Phone number is required" })}
                className="outline-none text-sm bg-transparent w-full"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs pl-4 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <div
              className={
                "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                (errors.username ? " !bg-red-500/10" : "")
              }
            >
              <PersonIcon className="text-gray-400" />
              <input
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
                className="outline-none text-sm bg-transparent w-full"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs pl-4 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <div
                className={
                  "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                  (errors.password ? " !bg-red-500/10" : "")
                }
              >
                <KeyIcon className="text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="outline-none text-sm bg-transparent w-full"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs pl-4 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <div
                className={
                  "bg-gray-100 rounded-full px-4 py-2 flex gap-2 items-center focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                  (errors.confirmPassword ? " !bg-red-500/10" : "")
                }
              >
                <KeyIcon className="text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="outline-none text-sm bg-transparent w-full"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs pl-4 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mx-auto block px-16 font-bold uppercase mt-8 bg-red-700 text-white/90 py-2 rounded-full hover:bg-red-800 duration-200 cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </motion.div>
  );
}
