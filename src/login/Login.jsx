import { useForm } from "react-hook-form";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { authApi } from "../shared/api/api";
import { useSpinnerStore } from "../shared/stores/spinnerStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const pageVariants = {
  initial: { opacity: 0.7, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0.7, x: 100 },
};

export default function Login() {
  const setLoading = useSpinnerStore((state) => state.setLoading);
  const navigate = useNavigate();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await authApi.login(data);
      toast.success("Login successfully");
      navigate("/dashboard");
    } catch (err) {
      if (err.status === 400) {
        toast.error("Wrong credentials");
        setError("username", {
          type: "manual",
          message: "Wrong credentials",
        });
        return;
      }
      toast.error("Something has gone wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="flex flex-row"
    >
      <div className="w-[40vw] flex flex-col items-center h-[100vh]">
        <div className="text-red-800 mt-36 uppercase text-4xl font-bold">
          Login
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-64 mx-auto p-8 space-y-2"
        >
          <div>
            <div
              className={
                "bg-gray-100 rounded-full px-4 py-2 flex flex-row gap-2 focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                (errors.username?.message ? "  !bg-red-500/10" : "")
              }
            >
              <PersonIcon className="text-gray-400" />
              <input
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
                className="outline-none text-sm"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs pl-4 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <div
              className={
                "bg-gray-100 rounded-full px-4 py-2 flex flex-row gap-2 focus-within:shadow-md focus-within:shadow-red-500/10 duration-200" +
                (errors.password?.message ? "  !bg-red-500/10" : "")
              }
            >
              <KeyIcon className="text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="outline-none text-sm"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs pl-4 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full font-bold uppercase mt-4 bg-red-700 text-white/90 py-2 rounded-full hover:bg-red-800 duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>

      <div className="w-[60vw] bg-red-800 flex flex-col">
        <div className="text-white/90 font-bold text-4xl text-center mt-36">
          Healthcare system
        </div>
        <div className="px-20">
          <div className="text-white/90 font-bold text-lg mt-20 mb-4">
            New to our AI-powered healthcare system?
          </div>
          <div className="text-white/90">
            Join us today to experience smarter, faster, and more personalized
            healthcare. Our advanced AI technology helps you track your health,
            connect with professionals, and get tailored insights — all in one
            secure platform. Creating an account takes just a minute.
          </div>
          <Link
            to="/register"
            className="flex flex-row items-center text-red-900 mt-8 max-w-48 bg-white gap-2 rounded-full px-6 py-2 group"
          >
            <div className="duration-400 min-w-[90px] group-hover:flex-1 font-bold">
              Sign Me Up
            </div>
            <KeyboardArrowRightIcon />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
